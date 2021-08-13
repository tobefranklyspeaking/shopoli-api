
CREATE DATABASE qaapi;

\connect qaapi;

CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL NOT NULL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  answer_id integer NOT NULL,
  url VARCHAR(2083) NOT NULL
);

/***************Data Load********************/


COPY answers FROM '/Users/franklyspeaking/Desktop/answers.csv' WITH DELIMITER ',' CSV HEADER;

COPY questions FROM '/Users/franklyspeaking/Desktop/questions.csv' WITH DELIMITER ',' CSV HEADER;

COPY photos FROM '/Users/franklyspeaking/Desktop/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;

/********works********/
alter table answers
alter date_written type varchar;

alter table answers
alter date_written type bigint using date_written::bigint;

alter table answers
alter date_written type varchar using date_written::to_char(varchar2, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');

/*******converts unix-timestamp into js equivalent datetime*******/

select to_timestamp(date_written/1000) from answers limit 1;

select to_char(to_timestamp(date_written/1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') from answers limit 1;

ALTER TABLE answers ALTER COLUMN date_written SET DATA TYPE timestamp without time zone USING to_timestamp(date_written/1000),
ALTER COLUMN date_written SET DEFAULT current_timestamp;

alter table answers
alter date_written type datetime to_timestamp(date_written/1000);
-- alter date_written type varchar using to_char(to_timestamp(date_written/1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ');