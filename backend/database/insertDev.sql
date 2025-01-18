--
-- lägger till saker i table
--

USE testdb;
DROP TABLE IF EXISTS TempZone;

--
-- temporärt för att senare omvandla latitude och longitude till POINT
--
CREATE TABLE TempZone (
    name VARCHAR(50),
    city VARCHAR(50),
    type ENUM('parking', 'chargestation', 'wrongly_parked'),
    latitude FLOAT,
    longitude FLOAT,
    capacity INT,
    radius INT DEFAULT 75
);

LOAD DATA LOCAL INFILE 'zone.csv'
INTO TABLE TempZone
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

INSERT INTO Zone (name, city, type, coordinates, capacity, radius)
SELECT
    name,
    city,
    type,
    ST_PointFromText(CONCAT('POINT(', latitude , ' ', longitude, ')')),
    capacity,
    radius
FROM TempZone;

--
-- Load users from csv
--
-- LOAD DATA INFILE '/docker-entrypoint-initdb.d/user.csv'
-- INTO TABLE User
-- FIELDS TERMINATED BY ',' 
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (user_id, balance, email, simulation_user, admin);