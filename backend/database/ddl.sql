-- 
-- creates the diffrent tables
-- sdfsdfa


DROP PROCEDURE IF EXISTS StartTrip;
DROP PROCEDURE IF EXISTS EndTrip;
DROP PROCEDURE IF EXISTS LogBikeMovement;
DROP PROCEDURE IF EXISTS RemoveBikes;
DROP PROCEDURE IF EXISTS TripCost;
DROP TABLE IF EXISTS Pricing;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS BikeMovement;
DROP TABLE IF EXISTS Trip;
DROP TABLE IF EXISTS Bike;

CREATE TABLE Bike
(
  bike_id VARCHAR(30) PRIMARY KEY,
  status ENUM('available', 'in_use', 'maintenance', 'charging') DEFAULT 'available',
  battery_level INT NOT NULL DEFAULT 100,
  position POINT NOT NULL,
  simulation INT DEFAULT 0
);

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  Balance FLOAT,
  Email VARCHAR (255) UNIQUE
);

CREATE TABLE Trip
(
  trip_id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id VARCHAR(30) NOT NULL,
  user_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  start_position POINT NOT NULL,
  end_position POINT,
  duration_minutes INT,
  cost INT,
  speed FLOAT,
  simulation_trip INT DEFAULT 0,
  FOREIGN KEY (bike_id) REFERENCES Bike(bike_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE BikeMovement
(
  movement_id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id VARCHAR(30) NOT NULL,
  position POINT NOT NULL,
  FOREIGN KEY (bike_id) REFERENCES Bike(bike_id)
);

CREATE TABLE Pricing
(
  unlock_fee FLOAT DEFAULT 10 PRIMARY KEY,
  per_minute_rate FLOAT DEFAULT 2.5,
  wrong_parking FLOAT DEFAULT 30
);

DELIMITER ;;

CREATE PROCEDURE StartTrip(
  IN input_bike_id VARCHAR(30),
  IN input_user_id INT
)
BEGIN
  DECLARE bike_start_position POINT;
  DECLARE is_simulated INT;


  IF (SELECT status FROM Bike WHERE bike_id = input_bike_id) = 'available' THEN

    SELECT position, simulation INTO bike_start_position, is_simulated
    FROM Bike
    WHERE bike_id = input_bike_id;

    INSERT INTO Trip (bike_id, user_id, start_time, start_position, simulation_trip)
    VALUES (input_bike_id, input_user_id, NOW(), bike_start_position, is_simulated);

    UPDATE Bike
    SET status = 'in_use'
    WHERE bike_id = input_bike_id;
  ELSE
    SELECT CONCAT('Bike ', input_bike_id, ' is Unavailable') AS message;
  END IF;

END
;;
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE EndTrip(
  IN input_bike_id VARCHAR(30)
)
BEGIN

  DECLARE bike_end_position POINT;
  DECLARE new_trip_id INT;

  SELECT trip_id INTO new_trip_id
  FROM Trip
  WHERE bike_id = input_bike_id
  AND end_time IS NULL;

  IF (SELECT status FROM Bike WHERE bike_id = input_bike_id) = 'in_use' THEN
    SELECT position INTO bike_end_position
    FROM Bike
    WHERE bike_id = input_bike_id;

    UPDATE Trip
    SET 
      end_time = NOW(),
      end_position = bike_end_position
    WHERE trip_id = new_trip_id;

    CALL TripCost(new_trip_id);

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
  IN input_bike_id VARCHAR(30),
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

CREATE PROCEDURE RemoveTrips(
  IN input_remove INT
)
BEGIN
  IF input_remove = 1 THEN
    DELETE FROM Trip WHERE simulation_trip = 1;
  ELSE
    DELETE FROM Trip;
  END IF;
END
;;

DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE TripCost(
  IN input_trip_id INT
)
BEGIN
  DECLARE calculated_start_time DATETIME;
  DECLARE calculated_end_time DATETIME;
  DECLARE calculated_duration_minutes INT;
  DECLARE calculated_unlock_fee INT;
  DECLARE calculated_per_minute_rate INT;
  DECLARE calculated_cost FLOAT;

  SELECT start_time, end_time INTO calculated_start_time, calculated_end_time
  FROM Trip
  WHERE trip_id = input_trip_id;

  SET calculated_duration_minutes = TIMESTAMPDIFF(MINUTE, calculated_start_time, calculated_end_time);

  SELECT unlock_fee, per_minute_rate INTO calculated_unlock_fee, calculated_per_minute_rate
  FROM Pricing;

  SET calculated_cost = calculated_unlock_fee + (calculated_duration_minutes * calculated_per_minute_rate);

  UPDATE Trip
  SET
    duration_minutes = calculated_duration_minutes,
    cost = calculated_cost
  WHERE Trip_id = input_trip_id;
END
;;
DELIMITER ;
