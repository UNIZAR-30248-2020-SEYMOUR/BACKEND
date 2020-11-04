SET NAMES 'utf8';

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

INSERT INTO CATEGORIES (name,imageUrl) VALUES("Marketing",assets/img/marketing.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Software",assets/img/software.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Hardware",assets/img/hardware.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Negocios",assets/img/negocios.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Desarrollo personal",assets/img/desarrolloPersonal.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Fotografía",assets/img/fotografia.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Música",assets/img/musica.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Literatura",assets/img/literatura.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Matemáticas",assets/img/matematicas.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Biología",assets/img/biologia.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Medicina",assets/img/medicina.jpg);
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Otro",assets/img/otro.jpg);
