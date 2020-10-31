CREATE TABLE USERS (
  uuid varchar(36) NOT NULL,
  username varchar(40) NOT NULL UNIQUE,
  email varchar(100) NOT NULL UNIQUE,
  password varchar(256) NOT NULL,
  description varchar(255) DEFAULT NULL,
  resetLink varchar(255) DEFAULT NULL,
  PRIMARY KEY (uuid)
);

CREATE TABLE COURSES (
  id int NOT NULL AUTO_INCREMENT,
  coursename varchar(40) NOT NULL,
  description varchar(255) NOT NULL,
  category varchar(100) NOT NULL REFERENCES CATEGORIES(name),
  owner varchar(36) NOT NULL REFERENCES USERS(uuid),
  PRIMARY KEY(id)
);

CREATE TABLE CATEGORIES (
  name varchar(100) NOT NULL,
  PRIMARY KEY(name)
);

INSERT INTO CATEGORIES (name) VALUES("Marketing");
INSERT INTO CATEGORIES (name) VALUES("Software");
INSERT INTO CATEGORIES (name) VALUES("Hardware");
INSERT INTO CATEGORIES (name) VALUES("Negocios");
INSERT INTO CATEGORIES (name) VALUES("Desarrollo personal");
INSERT INTO CATEGORIES (name) VALUES("Fotografía");
INSERT INTO CATEGORIES (name) VALUES("Música");
INSERT INTO CATEGORIES (name) VALUES("Literatura");
INSERT INTO CATEGORIES (name) VALUES("Matemáticas");
INSERT INTO CATEGORIES (name) VALUES("Biología");
INSERT INTO CATEGORIES (name) VALUES("Medicina");
INSERT INTO CATEGORIES (name) VALUES("Otro");