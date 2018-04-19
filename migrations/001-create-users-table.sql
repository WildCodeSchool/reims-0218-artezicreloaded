-- Up
CREATE TABLE wilders (
id INTEGER PRIMARY KEY,
pseudo VARCHAR(255),
avatar VARCHAR(255),
bio TEXT );

INSERT INTO wilders(pseudo, avatar, bio)
VALUES ('Gontran', 'http://i.pravatar.cc/150', 'lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS');

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
VALUES ('jaime le rock', 'rock', 'www.truc.com', 1, 'true', 17);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('gontran the best', 'rap', 'www.blu.com', 1, 'false', 2);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('SQL le retour', 'chill', 'www.sqlite.com', 2, 'false', 8);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('linux forever', 'slow', 'www.linux.com', 2, 'true', 15);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('express', 'varietoche', 'www.express.com', 3, 'false', 5);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('pugs life', 'rnb', 'www.pug.com', 3, 'true', 11);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('node', 'serveur', 'www.express.com', 4, 'false', 6);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('npm', 'rap français', 'www.npm.com', 4, 'true', 7);

CREATE TABLE competitions (
id INTEGER PRIMARY KEY,
theme VARCHAR(255),
id_playlists INTEGER );

CREATE TABLE votes (
date TEXT,
id INTEGER PRIMARY KEY,
id_playlists INTEGER,
id_wilders INTEGER,
FOREIGN KEY(id_wilders) REFERENCES wilders(id),
FOREIGN KEY(id_playlists) REFERENCES playlists(id)
);

-- Down 
DROP TABLE playlists;
DROP TABLE wilders;
DROP TABLE competitions;
DROP TABLE votes;