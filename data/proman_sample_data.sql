--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET default_tablespace = '';
SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS public.users;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id INTEGER                NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    type        VARCHAR(10)         NOT NULL,
    owner       VARCHAR(20)         NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);
CREATE TABLE users (
    id serial NOT NULL,
    username varchar(20),
    password text,
    registration_date date
);

---
--- insert data
---

INSERT INTO statuses(title, board_id) VALUES ('new', 1);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 1);
INSERT INTO statuses(title, board_id) VALUES ('testing', 1);
INSERT INTO statuses(title, board_id) VALUES ('done', 1);
INSERT INTO statuses(title, board_id) VALUES ('new', 2);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 2);
INSERT INTO statuses(title, board_id) VALUES ('testing', 2);
INSERT INTO statuses(title, board_id) VALUES ('done', 2);
INSERT INTO statuses(title, board_id) VALUES ('new', 3);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 3);
INSERT INTO statuses(title, board_id) VALUES ('testing', 3);
INSERT INTO statuses(title, board_id) VALUES ('done', 3);
INSERT INTO statuses(title, board_id) VALUES ('additional', 3);
INSERT INTO statuses(title, board_id) VALUES ('new', 4);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 4);
INSERT INTO statuses(title, board_id) VALUES ('testing', 4);
INSERT INTO statuses(title, board_id) VALUES ('done', 4);

INSERT INTO boards(title, type, owner) VALUES ('Private Test board', 'private', 'test');
INSERT INTO boards(title, type, owner) VALUES ('Private Admin board', 'private', 'admin');
INSERT INTO boards(title, type, owner) VALUES ('Public board', 'public', '');
INSERT INTO boards(title, type, owner) VALUES ('Second public board', 'public', '');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Boards list overview', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Create public boards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Rename board', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'Board view with four default columns', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Board view with dynamic columns', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Rename columns', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Create card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Order the cards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Change card status', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'Edit card title', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'Offline access', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'User registration', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 9, 'User login', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 10, 'Private boards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 11, 'User logout', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 12, 'Delete public boards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 13, 'Delete private boards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 11, 'Delete cards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 11, 'Delete columns', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 14, 'Manual synchronization', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 15, 'Live synchronization', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 16, 'Archive cards', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 17, 'Callbacks', 2);

INSERT INTO users VALUES (1, 'admin', '$2b$12$XeC/nv0xqJwULcE8GGDsE.FB9XIxnHucsA6qv/ynbsLgfdFXMa9He',  '2022-12-13 14:49:35');
INSERT INTO users VALUES (2, 'test', '$2b$12$BUsvilq2feigmR1aPM6UZeBWc/WlqVBUsP1Oakgur.5JWGipHNksy',  '2022-12-15 14:49:35');
---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;
