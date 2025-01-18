-- 
-- creates the diffrent tabless
-- 

--USE vteam;

DROP PROCEDURE IF EXISTS StartTrip;
DROP PROCEDURE IF EXISTS EndTrip;
DROP PROCEDURE IF EXISTS LogBikeMovement;
DROP PROCEDURE IF EXISTS RemoveBikes;
DROP PROCEDURE IF EXISTS RemoveUsers;
DROP PROCEDURE IF EXISTS RemoveTrips;
DROP PROCEDURE IF EXISTS TripCost;
DROP PROCEDURE IF EXISTS UpdateStatus;
DROP PROCEDURE IF EXISTS GetAvailableBikes;
DROP PROCEDURE IF EXISTS GetBikesInCity;
DROP PROCEDURE IF EXISTS GetAllBikes;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS BikeMovement;
DROP TABLE IF EXISTS Trip;
DROP TABLE IF EXISTS Bike;
DROP TABLE IF EXISTS Zone;

--
-- table för att skapa elsparkcyklarna
--
CREATE TABLE Bike
(
  bike_id VARCHAR(36) PRIMARY KEY,
  status ENUM('available', 'in_use', 'maintenance', 'charging') DEFAULT 'available',
  battery_level FLOAT NOT NULL DEFAULT 100,
  position POINT NOT NULL,
  speed FLOAT DEFAULT 0,
  simulation INT DEFAULT 0
);

--
-- table för att skapa användare
--
CREATE TABLE User (
  user_id VARCHAR(60) PRIMARY KEY,
  balance FLOAT,
  email VARCHAR (255) UNIQUE,
  simulation_user INT DEFAULT 0,
  admin INT DEFAULT 0
);

--
-- table för att skapa resor
--
CREATE TABLE Trip
(
  trip_id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(60) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  start_position POINT NOT NULL,
  end_position POINT,
  duration_minutes INT,
  cost INT,
  simulation_trip INT DEFAULT 0,
  FOREIGN KEY (bike_id) REFERENCES Bike(bike_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

--
-- table log för cyklarnas position.
--
CREATE TABLE BikeMovement
(
  movement_id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id VARCHAR(36) NOT NULL,
  position POINT NOT NULL,
  speed FLOAT,
  FOREIGN KEY (bike_id) REFERENCES Bike(bike_id)
);

--
-- table för att skapa alla soner 
--
CREATE TABLE Zone
(
  zone_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  type ENUM('parking', 'chargestation', 'wrongly_parked'),
  coordinates POINT NOT NULL,
  capacity INT,
  radius INT DEFAULT 75
);


--
-- en procedure för att starta en resa med en användare och en cykel.
--
DELIMITER ;;

CREATE PROCEDURE StartTrip(
  IN input_bike_id VARCHAR(36),
  IN input_user_id VARCHAR(60)
)
BEGIN

  DECLARE bike_start_position POINT;
  DECLARE is_simulation INT DEFAULT 0;

  IF (SELECT simulation FROM Bike WHERE bike_id = input_bike_id) = 1 
    AND (SELECT simulation_user FROM User WHERE user_id = input_user_id) = 1 THEN
    SET is_simulation = 1;
  END IF;

  IF (SELECT status FROM Bike WHERE bike_id = input_bike_id) = 'available' THEN
    SELECT position INTO bike_start_position
    FROM Bike
    WHERE bike_id = input_bike_id;
    INSERT INTO Trip (bike_id, user_id, start_time, start_position, simulation_trip )
    VALUES (input_bike_id, input_user_id, NOW(), bike_start_position, is_simulation);

    UPDATE Bike SET status = 'in_use'
    WHERE bike_id = input_bike_id;
  ELSE
    SELECT CONCAT('Bike ', input_bike_id, ' is Unavailable') AS message;
  END IF;

END
;;
DELIMITER ;

--
-- en procedure för att avsluta resan och lägga till dem sista sakerna i trip.
--
DELIMITER ;;

CREATE PROCEDURE EndTrip(
  IN input_bike_id VARCHAR(36)
)
BEGIN
  DECLARE bike_start_position POINT;
  DECLARE bike_end_position POINT;
  DECLARE new_trip_id INT;
  DECLARE matched_zone_type ENUM('parking', 'chargestation', 'wrongly_parked');
  DECLARE start_right BOOLEAN DEFAULT FALSE;

  SELECT trip_id INTO new_trip_id
  FROM Trip
  WHERE bike_id = input_bike_id
    AND end_time IS NULL;

  SELECT start_position INTO bike_start_position
  FROM Trip
  WHERE trip_id = new_trip_id;

  SELECT COUNT(*) > 0 INTO start_right
  FROM Zone
  WHERE (type = 'parking' OR type = 'chargestation')
  AND ST_Distance_Sphere(coordinates, bike_start_position) <= radius;

  SELECT position INTO bike_end_position
  FROM Bike
  WHERE bike_id = input_bike_id;

  SELECT type INTO matched_zone_type
  FROM Zone
  WHERE ST_Distance_Sphere(coordinates, bike_end_position) <= radius;

  UPDATE Trip
  SET 
    end_time = NOW(),
    end_position = bike_end_position
  WHERE trip_id = new_trip_id;

  IF matched_zone_type = 'parking' OR matched_zone_type = 'chargestation' THEN
    IF start_right THEN
      CALL TripCost(new_trip_id, matched_zone_type);
    ELSE
      CALL TripCost(new_trip_id, 'discount');
    END IF;
  ELSE
    CALL TripCost(new_trip_id, 'wrongly_parked');
  END IF;

  UPDATE Bike
  SET
  status = 'available',
  speed = 0
  WHERE bike_id = input_bike_id;

END;;
DELIMITER ;

--
-- Procedure som upddaterar bike table till sin nya position
--
DELIMITER ;;

CREATE PROCEDURE LogBikeMovement(
  IN input_bike_id VARCHAR(36),
  IN new_position POINT,
  IN new_speed FLOAT
)
BEGIN
  UPDATE Bike
  SET
  position = new_position,
  speed = new_speed
  WHERE bike_id = input_bike_id;

  INSERT INTO BikeMovement (bike_id, position, speed)
  VALUES (input_bike_id, new_position, new_speed);
END
;;
DELIMITER ;

--
-- tar bort cyklar 
--
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

--
-- tar bort resor
--
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

--
-- tar bort användare  
--
DELIMITER ;;

CREATE PROCEDURE RemoveUsers(
  IN input_remove INT
)
BEGIN
  IF input_remove = 1 THEN
    DELETE FROM User WHERE simulation_user = 1;
  ELSE
    DELETE FROM User;
  END IF;
END
;;

DELIMITER ;

--
-- räknar ut hur mycket resan kommer kosta
--
DELIMITER ;;

CREATE PROCEDURE TripCost(
  IN input_trip_id INT,
  IN input_zone VARCHAR(50)
)
BEGIN
  DECLARE t_start_time DATETIME;
  DECLARE t_end_time DATETIME;
  DECLARE t_duration_minutes INT;
  DECLARE t_unlock_fee FLOAT DEFAULT 20;
  DECLARE t_per_minute_rate FLOAT DEFAULT 2.5;
  DECLARE t_wrongparking FLOAT DEFAULT 30;
  DECLARE t_discount FLOAT DEFAULT 15;
  DECLARE t_cost FLOAT;
  DECLARE t_user_id VARCHAR(60);

  SELECT start_time, end_time, user_id INTO t_start_time, t_end_time, t_user_id
  FROM Trip
  WHERE trip_id = input_trip_id;

  SELECT input_zone AS message;

  SET t_duration_minutes = TIMESTAMPDIFF(MINUTE, t_start_time, t_end_time);

  SET t_cost = t_unlock_fee + (t_duration_minutes * t_per_minute_rate);

  IF input_zone = 'discount' THEN 
    SET t_cost = t_cost - t_discount;
  END IF;

  IF input_zone = 'wrongly_parked' THEN
    SET t_cost = t_cost + t_wrongparking;
  END IF;

  UPDATE Trip
  SET
    duration_minutes = t_duration_minutes,
    cost = t_cost
  WHERE Trip_id = input_trip_id;

  UPDATE User
  SET 
    balance = balance - t_cost
  WHERE user_id = t_user_id;
END
;;
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE UpdateStatus(
  IN u_bike_id VARCHAR(36),
  IN new_status VARCHAR(50)
)
BEGIN
  UPDATE bike
  SET
    status = new_status
  WHERE bike_id = u_bike_id;
END
;;

DELIMITER ;


--
-- hämtar alla cyklar som är available
--
DELIMITER ;;

CREATE PROCEDURE GetAvailableBikes()
BEGIN
  SELECT DISTINCT
    b.bike_id,
    b.status,
    b.battery_level,
    ST_X(b.position) AS longitude,
    ST_Y(b.position) AS latitude,
    b.simulation,
    IF(z.city IS NULL, 'outside city', z.city) AS city
  FROM Bike b
  LEFT JOIN Zone z
    ON ST_Distance_Sphere(b.position, z.coordinates) <= 16000
  WHERE b.status = 'available';
END;;

DELIMITER ;


--
-- hämtar alla cyklar i en stad
--
DELIMITER ;;

CREATE PROCEDURE GetBikesInCity(
  IN input_city VARCHAR(50)
)
BEGIN
  SELECT DISTINCT
    b.bike_id,
    b.status,
    b.battery_level,
    ST_X(b.position) AS longitude,
    ST_Y(b.position) AS latitude,
    b.simulation,
    z.city
  FROM Bike b
  JOIN Zone z
  ON 
    ST_Distance_Sphere(z.coordinates, b.position) <= 16000
  WHERE z.city = input_city;
END;;

DELIMITER ;

--
-- hämtar all cyklar ovsätt vad
--
DELIMITER ;;

CREATE PROCEDURE GetAllBikes()
BEGIN
  SELECT DISTINCT
    b.bike_id,
    b.status,
    b.battery_level,
    ST_X(b.position) AS longitude,
    ST_Y(b.position) AS latitude,
    b.simulation,
    IF(z.city is NULL, 'outside city', z.city) as city 
  FROM Bike b
  LEFT JOIN Zone z
    ON ST_Distance_Sphere(z.coordinates, b.position) <= 16000
  ORDER BY z.city;
END;;

DELIMITER ;

--
-- lägg till pengar till user
--
DELIMITER ;;

CREATE PROCEDURE AddMoney(
  IN u_user_id VARCHAR(60),
  IN add_money FLOAT
)
BEGIN
  UPDATE User
  SET balance = balance + add_money
  WHERE user_id = u_user_id;
END;;

DELIMITER ;

--
-- Hämta en resa för en användare som inte är avslutad
--
DELIMITER ;;

CREATE PROCEDURE GetOngoingTrip(
  IN input_user_id VARCHAR(60)
)
BEGIN
  SELECT *
  FROM Trip
  WHERE user_id = input_user_id
    AND end_time IS NULL;
END;;

DELIMITER ;