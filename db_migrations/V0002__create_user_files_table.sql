CREATE TABLE IF NOT EXISTS t_p79167660_file_download_gaming.user_files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p79167660_file_download_gaming.users(id),
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_files_user_id ON t_p79167660_file_download_gaming.user_files(user_id);
CREATE INDEX idx_user_files_game ON t_p79167660_file_download_gaming.user_files(game);