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
VALUES ('SQL le retour', 'chill', 'https://play.soundsgood.co/embed/5ad9971be7806b34155747da', 1, 'false', 8);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('J''aime le rock', 'rock', 'https://play.soundsgood.co/embed/5ad8a263e7806b3415568c2f', 1, 'true', 17);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Gontran the best', 'rap', 'https://play.soundsgood.co/embed/5ad8a369e7806b3415568dc4', 1, 'false', 2);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Node', 'chill', 'https://play.soundsgood.co/embed/5aaa5526a5bede0811e9c742', 2, 'false', 8);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('linux forever', 'slow', 'https://play.soundsgood.co/embed/5ad998dce7806b3415574987', 2, 'true', 15);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Concentration pour coder', 'musique bizarre', 'https://play.soundsgood.co/embed/5ad99778e7806b34155747de', 3, 'false', 5);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('Pugs life', 'relax your pug', 'https://play.soundsgood.co/embed/5ad9993ae7806b34155749e9', 3, 'true', 11);

INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('node', 'serveur', 'https://play.soundsgood.co/embed/5ad997ede7806b34155747ef', 4, 'false', 6);
INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes)
VALUES ('NPM', 'rap français', 'https://play.soundsgood.co/embed/5ad9998ee7806b34155749f0', 4, 'true', 7);

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