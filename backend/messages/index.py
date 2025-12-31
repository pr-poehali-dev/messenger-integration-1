"""
Функция обмена сообщениями: отправка, получение, история чата
"""
import json
import os
import psycopg2
import jwt
from datetime import datetime

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        token = event.get('headers', {}).get('authorization', '').replace('Bearer ', '')
        if not token:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        jwt_secret = os.environ.get('JWT_SECRET', 'default-secret-key')
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        user_id = payload['user_id']
        
        if method == 'POST':
            return send_message(user_id, event)
        elif method == 'GET':
            return get_messages(user_id, event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Token expired'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def send_message(user_id: int, event: dict) -> dict:
    body = json.loads(event.get('body', '{}'))
    chat_id = body.get('chat_id')
    content = body.get('content', '').strip()
    
    if not chat_id or not content:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'chat_id and content are required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        cur.execute(
            f"""SELECT 1 FROM {os.environ['MAIN_DB_SCHEMA']}.chat_participants 
                WHERE chat_id = %s AND user_id = %s""",
            (chat_id, user_id)
        )
        if not cur.fetchone():
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Not a participant of this chat'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            f"""INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.messages 
                (chat_id, sender_id, content) 
                VALUES (%s, %s, %s) RETURNING id, created_at""",
            (chat_id, user_id, content)
        )
        message_id, created_at = cur.fetchone()
        
        cur.execute(
            f"UPDATE {os.environ['MAIN_DB_SCHEMA']}.users SET last_seen = NOW() WHERE id = %s",
            (user_id,)
        )
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'message': {
                    'id': message_id,
                    'chat_id': chat_id,
                    'sender_id': user_id,
                    'content': content,
                    'created_at': created_at.isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()

def get_messages(user_id: int, event: dict) -> dict:
    query_params = event.get('queryStringParameters') or {}
    chat_id = query_params.get('chat_id')
    
    if not chat_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'chat_id is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        cur.execute(
            f"""SELECT 1 FROM {os.environ['MAIN_DB_SCHEMA']}.chat_participants 
                WHERE chat_id = %s AND user_id = %s""",
            (chat_id, user_id)
        )
        if not cur.fetchone():
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Not a participant of this chat'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            f"""SELECT m.id, m.sender_id, m.content, m.created_at, m.is_read, u.username
                FROM {os.environ['MAIN_DB_SCHEMA']}.messages m
                JOIN {os.environ['MAIN_DB_SCHEMA']}.users u ON m.sender_id = u.id
                WHERE m.chat_id = %s
                ORDER BY m.created_at ASC""",
            (chat_id,)
        )
        
        messages = []
        for row in cur.fetchall():
            msg_id, sender_id, content, created_at, is_read, sender_username = row
            messages.append({
                'id': msg_id,
                'sender_id': sender_id,
                'sender_username': sender_username,
                'content': content,
                'created_at': created_at.isoformat(),
                'is_read': is_read,
                'is_mine': sender_id == user_id
            })
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'messages': messages}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
