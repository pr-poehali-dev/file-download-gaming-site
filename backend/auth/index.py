import json
import os
import jwt
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication - registration and login
    Args: event with httpMethod (POST), body with action (register/login)
    Returns: HTTP response with JWT token or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    dsn = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    
    if not dsn or not jwt_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Server configuration error'})
        }
    
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            if action == 'register':
                username = body_data.get('username', '').strip()
                email = body_data.get('email', '').strip().lower()
                password = body_data.get('password', '')
                
                if not username or not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'All fields required'})
                    }
                
                if len(password) < 6:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Password must be at least 6 characters'})
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute("SELECT id FROM t_p79167660_file_download_gaming.users WHERE email = %s OR username = %s", (email, username))
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User already exists'})
                    }
                
                cur.execute(
                    "INSERT INTO t_p79167660_file_download_gaming.users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, email, created_at",
                    (username, email, password_hash)
                )
                user = cur.fetchone()
                conn.commit()
                
                token = jwt.encode({
                    'user_id': user[0],
                    'username': user[1],
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user[0],
                            'username': user[1],
                            'email': user[2],
                            'created_at': user[3].isoformat()
                        }
                    })
                }
            
            elif action == 'login':
                email = body_data.get('email', '').strip().lower()
                password = body_data.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email and password required'})
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute(
                    "SELECT id, username, email, created_at FROM t_p79167660_file_download_gaming.users WHERE email = %s AND password_hash = %s AND is_active = true",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                token = jwt.encode({
                    'user_id': user[0],
                    'username': user[1],
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user[0],
                            'username': user[1],
                            'email': user[2],
                            'created_at': user[3].isoformat()
                        }
                    })
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'})
                }