-- Up
CREATE TABLE playlists (
  id INTEGER PRIMARY KEY,
  title VARCHAR(100),
  url VARCHAR(250),
  genre VARCHAR(100)
);
-- Down
DROP TABLE playlists;
