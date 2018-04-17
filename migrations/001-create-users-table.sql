-- Up
CREATE TABLE wilders (
id INTEGER PRIMARY KEY,
pseudo VARCHAR(255),
avatar VARCHAR(255),
bio TEXT );

INSERT INTO wilders(pseudo, avatar, bio)
VALUES ('gontran', 'http://i.pravatar.cc/150', 'lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS');

CREATE TABLE playlists (
id INTEGER PRIMARY KEY,
titre VARCHAR(255),
genre VARCHAR(255),
url VARCHAR(255),
id_wilders INTEGER,
compete BOOLEAN,
nbrevotes INTEGER,
FOREIGN KEY(id_wilders) REFERENCES wilders(id)
);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('jaime le rock', 'rock', 'www.truc.com', 1,  'true', 17);

CREATE TABLE competitions (
id INTEGER PRIMARY KEY,
theme VARCHAR(255),
id_playlists INTEGER );

CREATE TABLE votes (
id INTEGER PRIMARY KEY,
id_playlists INTEGER,
votes INTEGER,
FOREIGN KEY(id_wilders) REFERENCES wilders(id)
);

-- Down 
DROP TABLE playlists;
DROP TABLE wilders;
DROP TABLE competitions;
DROP TABLE votes;