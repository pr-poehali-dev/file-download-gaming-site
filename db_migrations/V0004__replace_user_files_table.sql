-- Create new table with nullable user_id
CREATE TABLE t_p79167660_file_download_gaming.user_files_new (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p79167660_file_download_gaming.users(id),
  name VARCHAR(255) NOT NULL,
  game VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  download_type VARCHAR(50),
  mod_type VARCHAR(50),
  size VARCHAR(50) NOT NULL,
  version VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20) DEFAULT 'direct',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author_name VARCHAR(100)
);

-- Copy data from old table
INSERT INTO t_p79167660_file_download_gaming.user_files_new 
  (id, user_id, name, game, content_type, download_type, mod_type, size, version, file_url, file_type, downloads, created_at, author_name)
SELECT id, user_id, name, game, content_type, download_type, mod_type, size, version, file_url, file_type, downloads, created_at, author_name
FROM t_p79167660_file_download_gaming.user_files;

-- Update sequence
SELECT setval('t_p79167660_file_download_gaming.user_files_new_id_seq', 
              COALESCE((SELECT MAX(id) FROM t_p79167660_file_download_gaming.user_files_new), 1));

-- Rename tables
ALTER TABLE t_p79167660_file_download_gaming.user_files RENAME TO user_files_old;
ALTER TABLE t_p79167660_file_download_gaming.user_files_new RENAME TO user_files;
