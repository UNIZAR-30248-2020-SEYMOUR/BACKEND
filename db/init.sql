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
  imageUrl varchar(255),
  PRIMARY KEY(name)
);

INSERT INTO CATEGORIES (name,imageUrl) VALUES("Marketing",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Software",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Hardware",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Negocios",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Desarrollo personal",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Fotografía",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Música",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Literatura",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Matemáticas",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Biología",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Medicina",null);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Otro",null);