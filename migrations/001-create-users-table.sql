-- Up
CREATE TABLE wilders (
id INTEGER PRIMARY KEY,
pseudo VARCHAR(255) NOT NULL,
avatar VARCHAR(255),
bio TEXT NOT NULL );

INSERT INTO wilders(pseudo, bio)
VALUES ('gontran', 'developer at WCS');

CREATE TABLE playlists (
id INTEGER PRIMARY KEY,
titre VARCHAR(255) NOT NULL,
genre VARCHAR(255) NOT NULL,
url VARCHAR(255) NOT NULL,
id_wilders INTEGER NOT NULL,
compete BOOLEAN NOT NULL,
nbrevotes INTEGER NOT NULL 
);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('jaime le rock', 'rock', 'www.truc.com', 1,  'true', 17);

CREATE TABLE competitions (
id INTEGER PRIMARY KEY,
theme VARCHAR(255) NOT NULL,
id_playlists INTEGER NOT NULL );

CREATE TABLE votes (
id INTEGER PRIMARY KEY,
id_playlists INTEGER NOT NULL,
votes INTEGER NOT NULL );

-- Down 
DROP TABLE playlists;
DROP TABLE wilders;
DROP TABLE competitions;
DROP TABLE votes;