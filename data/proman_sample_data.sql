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
    title    VARCHAR(200)           NOT NULL
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

INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');

INSERT INTO boards(title, type, owner) VALUES ('Board 1', 'private', 'test');
INSERT INTO boards(title, type, owner) VALUES ('Board 3', 'public', '');
INSERT INTO boards(title, type, owner) VALUES ('Board 2', 'private', 'admin');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2);

INSERT INTO users VALUES (1, 'admin', '$2b$12$XeC/nv0xqJwULcE8GGDsE.FB9XIxnHucsA6qv/ynbsLgfdFXMa9He',  '2022-12-13 14:49:35');
INSERT INTO users VALUES (2, 'test', '$2b$12$BUsvilq2feigmR1aPM6UZeBWc/WlqVBUsP1Oakgur.5JWGipHNksy',  '2022-12-15 14:49:35');
---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;
