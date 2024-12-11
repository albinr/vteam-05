-- 
-- creates the diffrent tables
-- 

USE vteam;

DROP PROCEDURE IF EXISTS StartTrip;
DROP PROCEDURE IF EXISTS EndTrip;
DROP PROCEDURE IF EXISTS LogBikeMovement;
DROP PROCEDURE IF EXISTS RemoveBikes;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS BikeMovement;
DROP TABLE IF EXISTS Trip;
DROP TABLE IF EXISTS Bike;

CREATE TABLE Bike
(
  bike_id VARCHAR PRIMARY KEY,
  status ENUM('available', 'in_use', 'maintenance', 'charging') DEFAULT 'available',
  battery_level INT NOT NULL DEFAULT 100,
  position POINT NOT NULL,
  simulation INT DEFAULT 0
);

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR (50),
  Balance FLOAT,
  Email VARCHAR (255)
);

CREATE TABLE Trip
(
  trip_id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id INT NOT NULL,
  user_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  start_position POINT NOT NULL,
  end_position POINT,
  price INT,
  speed FLOAT,
  FOREIGN KEY (bike_id) REFERENCES Bike(bike_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE BikeMovement (
  movement_id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id INT NOT NULL,
  position POINT NOT NULL,
  FOREIGN KEY (bike_id) REFERENCES Bike(bike_id)
);


DELIMITER ;;

CREATE PROCEDURE StartTrip(
  IN input_bike_id INT,
  IN input_user_id INT
)
BEGIN

  DECLARE bike_start_position POINT;

  IF (SELECT status FROM Bike WHERE bike_id = input_bike_id) = 'available' THEN
    SELECT position INTO bike_start_position
    FROM Bike
    WHERE bike_id = input_bike_id;
    INSERT INTO Trip (bike_id, user_id, start_time, start_position)
    VALUES (input_bike_id, input_user_id, NOW(), bike_start_position);

    UPDATE Bike SET status = 'in_use'
    WHERE bike_id = input_bike_id;
  ELSE
    SELECT CONCAT('Bike ', input_bike_id, ' is Unavailable') AS message;
  END IF;

END
;;
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE EndTrip(
  IN input_bike_id INT
)
BEGIN

  DECLARE bike_end_position POINT;

  IF (SELECT status FROM Bike WHERE bike_id = input_bike_id) = 'in_use' THEN
    SELECT position INTO bike_end_position
    FROM Bike
    WHERE bike_id = input_bike_id;
    UPDATE Trip
    SET 
      end_time = NOW(),
      end_position = bike_end_position
    WHERE bike_id = input_bike_id
    AND end_time IS NULL;

    UPDATE Bike
    SET
      status = 'available'
    WHERE bike_id = input_bike_id;
  ELSE
    SELECT CONCAT('Bike ', input_bike_id, ' has not started a trip and can not end') AS message;
  END IF;

END
;;
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE LogBikeMovement(
  IN input_bike_id INT,
  IN new_position POINT
)
BEGIN
  UPDATE Bike
  SET position = new_position
  WHERE bike_id = input_bike_id;

  INSERT INTO BikeMovement (bike_id, position)
  VALUES (input_bike_id, new_position);
END
;;
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE RemoveBikes(
  IN input_remove INT
)
BEGIN
  IF input_remove = 1 THEN
    DELETE FROM Bike WHERE simulation = 1;
  ELSE
    DELETE FROM Bike;
  END IF;
END
;;

DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE RemoveTrips()
BEGIN
  DELETE FROM Trip;
END
;;

DELIMITER ;
