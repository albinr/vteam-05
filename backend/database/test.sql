--
-- test file
--

USE vteam;

-- source setup.sql
-- source ddl.sql



-- SELECT ST_AsText(position) AS start_position FROM Bike;

-- CALL StartTrip(1);
-- CALL EndTrip(1, POINT(16.1613, 55.5869));
-- CALL EndTrip(2, POINT(16.1613, 55.5869));
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

-- CALL EndTrip(1, POINT(56.1612, 15.5869));
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
CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position
FROM Trip;

-- SELECT
-- movement_id,
-- bike_id,
-- ST_X(position),
-- ST_Y(position)
-- FROM BikeMovement
-- ORDER BY bike_id, movement_id;

SELECT
bike_id,
status,
ST_X(position),
ST_Y(position)
FROM Bike;
