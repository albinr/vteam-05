-- 
-- lägger till saker i table
-- 

USE vteam;
DROP TABLE IF EXISTS TempZone;

--
-- temporärt för att senare omvandla latitude och longitude till POINT
--
CREATE TABLE TempZone (
    name VARCHAR(255),
    city VARCHAR(255),
    type VARCHAR(50),
    latitude FLOAT,
    longitude FLOAT,
    capacity INT
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

INSERT INTO Zone (name, city, type, coordinates, capacity)
SELECT
    name,
    city,
    type,
    ST_PointFromText(CONCAT('POINT(', longitude, ' ', latitude, ')')),
    capacity
FROM TempZone;
