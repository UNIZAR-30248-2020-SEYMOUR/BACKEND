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
  PRIMARY KEY(id),
  CONSTRAINT user_fk FOREIGN KEY (owner) REFERENCES USERS(uuid) ON DELETE CASCADE
);

CREATE TABLE CATEGORIES (
  name varchar(100) NOT NULL,
  imageUrl varchar(255),
  PRIMARY KEY(name)
);

CREATE TABLE VIDEOS (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(40) NOT NULL,
  description varchar(255) NOT NULL,
  course int NOT NULL REFERENCES COURSES(id),
  location varchar(255) NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT course_fk FOREIGN KEY (course) REFERENCES COURSES(id) ON DELETE CASCADE
);

INSERT INTO CATEGORIES (name,imageUrl) VALUES("Marketing","assets/img/categories/marketing.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Software","assets/img/categories/software.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Hardware","assets/img/categories/hardware.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Negocios","assets/img/categories/negocios.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Desarrollo personal","assets/img/categories/desarrolloPersonal.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Fotografía","assets/img/categories/fotografia.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Música","assets/img/categories/musica.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Literatura","assets/img/categories/literatura.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Matemáticas","assets/img/categories/matematicas.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Biología","assets/img/categories/biologia.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Medicina","assets/img/categories/medicina.jpg");
INSERT INTO CATEGORIES (name,imageUrl) VALUES("Otro","assets/img/categories/otro.jpg");
