--
-- test file
--

USE vteam;

source setup.sql
source ddl.sql

INSERT INTO Bike (position)
VALUES (POINT(16.1612, 55.5869));
INSERT INTO Bike (position)
VALUES (POINT(76.1612, 15.5869));

-- SELECT ST_AsText(position) AS start_position FROM Bike;

CALL StartTrip(1);
-- SELECT
-- ST_X(position) AS position
-- FROM Bike
-- WHERE bike_id = 1;
-- CALL LogBikeMovement(1, POINT(16.1613, 55.5869));
-- SELECT
-- ST_X(position) AS position
-- FROM Bike
-- WHERE bike_id = 1;
-- CALL LogBikeMovement(1, POINT(16.1614, 55.5869));
-- SELECT
-- ST_X(position) AS position
-- FROM Bike
-- WHERE bike_id = 1;
-- CALL LogBikeMovement(1, POINT(16.1615, 55.5869));

CALL EndTrip(1, POINT(56.1612, 15.5869));
-- CALL EndTrip(1, POINT(96.1612, 15.5869));
-- CALL StartTrip(2);
-- CALL EndTrip(2, POINT(86.1612, 15.5869));


-- SELECT * FROM Bike;
SELECT 
trip_id,
bike_id,
start_time,
end_time,
CONCAT (ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
CONCAT (price, 'kr') AS price,
speed
FROM Trip;


-- SELECT 
-- ST_X(position),
-- ST_Y(position)
-- FROM Bike
-- WHERE bike_id = 1;
