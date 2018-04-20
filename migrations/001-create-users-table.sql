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
VALUES ('SQL le retour', 'chill', 'https://play.soundsgood.co/playlist/sqlite', 1, 'false', 8);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('J''aime le rock', 'rock', 'https://play.soundsgood.co/playlist/gontran-aime-le-rock', 1, 'true', 17);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Gontran the best', 'rap', 'https://play.soundsgood.co/playlist/gontran-la-creme-of-the-creme', 1, 'false', 2);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Node', 'chill', 'https://play.soundsgood.co/playlist/node', 2, 'false', 8);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('linux forever', 'slow', 'https://play.soundsgood.co/playlist/linux', 2, 'true', 15);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Concentration pour coder', 'musique bizarre', 'https://play.soundsgood.co/playlist/concentration-4', 3, 'false', 5);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Pugs life', 'relax your pug', 'https://play.soundsgood.co/playlist/pugs-life', 3, 'true', 11);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('node', 'serveur', 'https://play.soundsgood.co/playlist/example', 4, 'false', 6);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('NPM', 'rap français', 'https://play.soundsgood.co/playlist/ntm', 4, 'true', 7);

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