SET NAMES 'utf8';

CREATE TABLE USERS (
  uuid varchar(36) NOT NULL,
  username varchar(40) NOT NULL UNIQUE,
  email varchar(100) NOT NULL UNIQUE,
  password varchar(256) NOT NULL,
  description varchar(255) DEFAULT NULL,
  resetLink varchar(255) DEFAULT NULL,
  numberOfRates int DEFAULT 0,
  sumOfRates int DEFAULT 0,
  rate float DEFAULT 0, -- sumOfRates / numberOfRates
  PRIMARY KEY (uuid)
);

CREATE TABLE COURSES (
  id int NOT NULL AUTO_INCREMENT,
  coursename varchar(40) NOT NULL,
  description varchar(255) NOT NULL,
  category varchar(100) NOT NULL REFERENCES CATEGORIES(name),
  owner varchar(36) NOT NULL REFERENCES USERS(uuid),
  numberOfRates int DEFAULT 0,
  sumOfRates int DEFAULT 0,
  rate float DEFAULT 0, -- sumOfRates / numberOfRates
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
  title varchar(40),
  description varchar(255),
  course int REFERENCES COURSES(id),
  location varchar(255),
  PRIMARY KEY(id),
  numberOfRates int DEFAULT 0,
  sumOfRates int DEFAULT 0,
  rate float DEFAULT 0, -- sumOfRates / numberOfRates
  CONSTRAINT course_fk FOREIGN KEY (course) REFERENCES COURSES(id) ON DELETE CASCADE
);

CREATE TABLE USER_RATES (
  id_user varchar(36) REFERENCES USERS(uuid),
  id_video int REFERENCES VIDEOS(id),
  score int DEFAULT 0, -- Rates cannot be negative numbers
  PRIMARY KEY (id_user, id_video)
);

DELIMITER $$
CREATE TRIGGER insertNewRate
AFTER INSERT ON USER_RATES
FOR EACH ROW
BEGIN
    UPDATE VIDEOS SET
        numberOfRates=numberOfRates+1,
        sumOfRates=sumOfRates+NEW.score,
        rate=sumOfRates/numberOfRates
        where id=NEW.id_video;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER updateRate
AFTER UPDATE ON USER_RATES
FOR EACH ROW
BEGIN
    UPDATE VIDEOS SET
        sumOfRates=sumOfRates-OLD.score+NEW.score,
        rate=sumOfRates/numberOfRates
        where id=NEW.id_video;
END$$
DELIMITER ;

-- TODO: trigger of course rate
-- TODO: trigger of user rate
-- TODO: trigger of delete user
-- TODO: trigger of delete course
-- TODO: trigger of delete video

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
