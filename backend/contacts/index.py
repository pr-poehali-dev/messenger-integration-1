"""
Функция управления контактами: добавление, поиск, список
"""
import json
import os
import psycopg2
import jwt

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
            return add_contact(user_id, event)
        elif method == 'GET':
            return get_contacts(user_id)
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

def add_contact(user_id: int, event: dict) -> dict:
    body = json.loads(event.get('body', '{}'))
    contact_phone = body.get('phone', '').strip()
    
    if not contact_phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Phone is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        cur.execute(
            f"SELECT id, username, avatar_url FROM {os.environ['MAIN_DB_SCHEMA']}.users WHERE phone = %s",
            (contact_phone,)
        )
        contact = cur.fetchone()
        
        if not contact:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        contact_id, username, avatar_url = contact
        
        if contact_id == user_id:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Cannot add yourself'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            f"""SELECT chat_id FROM {os.environ['MAIN_DB_SCHEMA']}.chat_participants 
                WHERE user_id = %s AND chat_id IN (
                    SELECT chat_id FROM {os.environ['MAIN_DB_SCHEMA']}.chat_participants 
                    WHERE user_id = %s
                )""",
            (user_id, contact_id)
        )
        existing_chat = cur.fetchone()
        
        if existing_chat:
            chat_id = existing_chat[0]
        else:
            cur.execute(
                f"INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.chats DEFAULT VALUES RETURNING id"
            )
            chat_id = cur.fetchone()[0]
            
            cur.execute(
                f"INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.chat_participants (chat_id, user_id) VALUES (%s, %s)",
                (chat_id, user_id)
            )
            cur.execute(
                f"INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.chat_participants (chat_id, user_id) VALUES (%s, %s)",
                (chat_id, contact_id)
            )
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'chat_id': chat_id,
                'contact': {
                    'id': contact_id,
                    'username': username,
                    'phone': contact_phone,
                    'avatar_url': avatar_url
                }
            }),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()

def get_contacts(user_id: int) -> dict:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        cur.execute(
            f"""SELECT DISTINCT u.id, u.username, u.phone, u.avatar_url, u.last_seen, cp.chat_id
                FROM {os.environ['MAIN_DB_SCHEMA']}.users u
                JOIN {os.environ['MAIN_DB_SCHEMA']}.chat_participants cp ON u.id = cp.user_id
                WHERE cp.chat_id IN (
                    SELECT chat_id FROM {os.environ['MAIN_DB_SCHEMA']}.chat_participants 
                    WHERE user_id = %s
                ) AND u.id != %s
                ORDER BY u.last_seen DESC""",
            (user_id, user_id)
        )
        
        contacts = []
        for row in cur.fetchall():
            contact_id, username, phone, avatar_url, last_seen, chat_id = row
            contacts.append({
                'id': contact_id,
                'username': username,
                'phone': phone,
                'avatar_url': avatar_url,
                'last_seen': last_seen.isoformat() if last_seen else None,
                'chat_id': chat_id
            })
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'contacts': contacts}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
