CREATE DATABASE qaapi;

\connect qaapi;

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written TEXT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL,
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL NOT NULL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written TIMESTAMP DEFAULT CURRENT_TIMESTAMP, NOT NULL
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL NOT NULL PRIMARY KEY,
  answer_id integer NOT NULL,
  url VARCHAR(2083) NOT NULL
);

