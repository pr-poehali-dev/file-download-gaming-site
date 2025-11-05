import json
import os
import jwt
from typing import Dict, Any, Optional
import psycopg

def verify_token(token: str, jwt_secret: str) -> Optional[Dict]:
    try:
        return jwt.decode(token, jwt_secret, algorithms=['HS256'])
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage comments - get, create, update, delete
    Args: event with httpMethod (GET/POST/PUT/DELETE), headers with X-Auth-Token
    Returns: HTTP response with comments data or success status
    '''
    method: str = event.get('httpMethod', 'GET')
    headers = event.get('headers', {})
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
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
            if method == 'GET':
                query_params = event.get('queryStringParameters', {})
                file_id = query_params.get('file_id')
                
                if not file_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'file_id required'})
                    }
                
                cur.execute("""
                    SELECT c.id, c.content, c.rating, c.created_at, c.updated_at,
                           u.username, u.avatar_url, c.user_id
                    FROM comments c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.file_id = %s
                    ORDER BY c.created_at DESC
                """, (int(file_id),))
                
                comments = []
                for row in cur.fetchall():
                    comments.append({
                        'id': row[0],
                        'content': row[1],
                        'rating': row[2],
                        'created_at': row[3].isoformat(),
                        'updated_at': row[4].isoformat(),
                        'username': row[5],
                        'avatar_url': row[6],
                        'user_id': row[7]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'comments': comments})
                }
            
            elif method == 'POST':
                auth_token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Authentication required'})
                    }
                
                user_data = verify_token(auth_token, jwt_secret)
                if not user_data:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid token'})
                    }
                
                body_data = json.loads(event.get('body', '{}'))
                file_id = body_data.get('file_id')
                content = body_data.get('content', '').strip()
                rating = body_data.get('rating')
                
                if not file_id or not content:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'file_id and content required'})
                    }
                
                if rating and (rating < 1 or rating > 5):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'rating must be between 1 and 5'})
                    }
                
                cur.execute("""
                    INSERT INTO comments (user_id, file_id, content, rating)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, created_at
                """, (user_data['user_id'], int(file_id), content, rating))
                
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': result[0],
                        'created_at': result[1].isoformat(),
                        'message': 'Comment created'
                    })
                }
            
            elif method == 'DELETE':
                auth_token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Authentication required'})
                    }
                
                user_data = verify_token(auth_token, jwt_secret)
                if not user_data:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid token'})
                    }
                
                query_params = event.get('queryStringParameters', {})
                comment_id = query_params.get('id')
                
                if not comment_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'comment id required'})
                    }
                
                cur.execute("SELECT user_id FROM comments WHERE id = %s", (int(comment_id),))
                comment = cur.fetchone()
                
                if not comment:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Comment not found'})
                    }
                
                if comment[0] != user_data['user_id']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Not authorized'})
                    }
                
                cur.execute("UPDATE comments SET content = '[удалено]', rating = NULL WHERE id = %s", (int(comment_id),))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Comment deleted'})
                }
            
            else:
                return {
                    'statusCode': 405,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Method not allowed'})
                }
