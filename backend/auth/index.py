"""
Функция авторизации: отправка и проверка SMS-кодов
"""
import json
import os
import psycopg2
from datetime import datetime, timedelta
import random
import jwt
import requests

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'send_code':
            return send_verification_code(body)
        elif action == 'verify_code':
            return verify_code(body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def send_verification_code(body: dict) -> dict:
    phone = body.get('phone', '').strip()
    
    if not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Phone is required'}),
            'isBase64Encoded': False
        }
    
    code = str(random.randint(100000, 999999))
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        expires_at = datetime.now() + timedelta(minutes=5)
        
        cur.execute(
            f"INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.auth_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
            (phone, code, expires_at)
        )
        conn.commit()
        
        sms_api_key = os.environ.get('SMS_API_KEY', '')
        if sms_api_key:
            send_sms(phone, f'Ваш код подтверждения: {code}', sms_api_key)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'message': 'Code sent',
                'debug_code': code if not sms_api_key else None
            }),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()

def verify_code(body: dict) -> dict:
    phone = body.get('phone', '').strip()
    code = body.get('code', '').strip()
    username = body.get('username', '').strip()
    
    if not phone or not code:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Phone and code are required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        cur.execute(
            f"""SELECT id, expires_at, is_used FROM {os.environ['MAIN_DB_SCHEMA']}.auth_codes 
                WHERE phone = %s AND code = %s 
                ORDER BY created_at DESC LIMIT 1""",
            (phone, code)
        )
        result = cur.fetchone()
        
        if not result:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid code'}),
                'isBase64Encoded': False
            }
        
        code_id, expires_at, is_used = result
        
        if is_used:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Code already used'}),
                'isBase64Encoded': False
            }
        
        if datetime.now() > expires_at:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Code expired'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            f"UPDATE {os.environ['MAIN_DB_SCHEMA']}.auth_codes SET is_used = TRUE WHERE id = %s",
            (code_id,)
        )
        
        cur.execute(
            f"SELECT id, username FROM {os.environ['MAIN_DB_SCHEMA']}.users WHERE phone = %s",
            (phone,)
        )
        user = cur.fetchone()
        
        if user:
            user_id, existing_username = user
            if username:
                cur.execute(
                    f"UPDATE {os.environ['MAIN_DB_SCHEMA']}.users SET username = %s, last_seen = NOW() WHERE id = %s",
                    (username, user_id)
                )
        else:
            if not username:
                username = f'User{phone[-4:]}'
            
            cur.execute(
                f"INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.users (phone, username) VALUES (%s, %s) RETURNING id",
                (phone, username)
            )
            user_id = cur.fetchone()[0]
        
        conn.commit()
        
        jwt_secret = os.environ.get('JWT_SECRET', 'default-secret-key')
        token = jwt.encode(
            {'user_id': user_id, 'phone': phone, 'exp': datetime.utcnow() + timedelta(days=30)},
            jwt_secret,
            algorithm='HS256'
        )
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': {'id': user_id, 'phone': phone, 'username': username}
            }),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()

def send_sms(phone: str, message: str, api_key: str):
    try:
        response = requests.post(
            'https://smsc.ru/sys/send.php',
            data={
                'login': api_key.split(':')[0] if ':' in api_key else api_key,
                'psw': api_key.split(':')[1] if ':' in api_key else '',
                'phones': phone,
                'mes': message,
                'fmt': 3
            },
            timeout=10
        )
    except:
        pass
