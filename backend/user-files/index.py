'''
Business: Управление пользовательскими файлами - добавление и получение
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с данными файлов
'''

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT 
                uf.id,
                uf.name,
                uf.game,
                uf.content_type,
                uf.download_type,
                uf.mod_type,
                uf.size,
                uf.version,
                uf.file_url,
                uf.file_type,
                uf.downloads,
                uf.created_at,
                u.username as author
            FROM t_p79167660_file_download_gaming.user_files uf
            JOIN t_p79167660_file_download_gaming.users u ON uf.user_id = u.id
            ORDER BY uf.created_at DESC
        ''')
        
        files = cur.fetchall()
        cur.close()
        conn.close()
        
        files_list = [dict(f) for f in files]
        for f in files_list:
            if f['created_at']:
                f['created_at'] = f['created_at'].isoformat()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'files': files_list})
        }
    
    if method == 'POST':
        headers = event.get('headers', {})
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Необходима авторизация'})
            }
        
        body_data = json.loads(event.get('body', '{}'))
        
        required_fields = ['name', 'game', 'contentType', 'size', 'version', 'fileUrl']
        for field in required_fields:
            if not body_data.get(field):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': f'Поле {field} обязательно'})
                }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            INSERT INTO t_p79167660_file_download_gaming.user_files 
            (user_id, name, game, content_type, download_type, mod_type, size, version, file_url, file_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, created_at
        ''', (
            int(user_id),
            body_data['name'],
            body_data['game'],
            body_data['contentType'],
            body_data.get('downloadType'),
            body_data.get('modType'),
            body_data['size'],
            body_data['version'],
            body_data['fileUrl'],
            body_data.get('fileType', 'direct')
        ))
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'file': dict(result)
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
