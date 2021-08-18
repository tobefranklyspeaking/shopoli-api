
CREATE DATABASE qaapi;

\connect qaapi;


/******** CREATE QUESTIONS ********/

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported INTEGER NOT NULL DEFAULT 0,
  helpful INTEGER NOT NULL DEFAULT 0
);

COPY questions FROM '/Users/franklyspeaking/Desktop/questions.csv' WITH DELIMITER ',' CSV HEADER;

alter table questions
alter column date_written type timestamp without time zone using to_timestamp(date_written/1000),
ALTER COLUMN date_written SET DEFAULT current_timestamp;

SELECT setval('questions_id_seq',(SELECT GREATEST(MAX(id)+1,nextval('questions_id_seq')) - 1 FROM questions));


/*************** CREATE ANSWERS *****************/

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INTEGER NOT NULL DEFAULT 0,
  helpful INTEGER NOT NULL DEFAULT 0
);

COPY answers FROM '/Users/franklyspeaking/Desktop/answers.csv' WITH DELIMITER ',' CSV HEADER;

alter table answers
alter column date_written type timestamp without time zone using to_timestamp(date_written/1000),
ALTER COLUMN date_written SET DEFAULT current_timestamp;

SELECT setval('answers_id_seq',(SELECT GREATEST(MAX(id)+1,nextval('answers_id_seq')) - 1 FROM answers));


/***************CREATE PHOTOS*****************/

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  answer_id integer NOT NULL,
  url VARCHAR(2083) NOT NULL
);

COPY photos FROM '/Users/franklyspeaking/Desktop/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;

SELECT setval('photos_id_seq',(SELECT GREATEST(MAX(id)+1,nextval('photos_id_seq')) - 1 FROM photos));


/***************Data Load********************/

COPY answers FROM '/Users/franklyspeaking/Desktop/answers.csv' WITH DELIMITER ',' CSV HEADER;

COPY questions FROM '/Users/franklyspeaking/Desktop/questions.csv' WITH DELIMITER ',' CSV HEADER;

COPY photos FROM '/Users/franklyspeaking/Desktop/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;