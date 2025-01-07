--
-- test file
--

USE vteam;

-- source setup.sql
-- source ddl.sql

-- SELECT
-- bike_id,
-- status,
-- ST_X(position),
-- ST_Y(position),
-- simulation
-- FROM Bike;

-- CALL StartTrip('1', 1);
-- CALL EndTrip('1');

-- SELECT
-- bike_id,
-- status
-- FROM Bike;


-- CALL StartTrip(2, 2);
-- CALL EndTrip(2);
-- CALL StartTrip(3, 3);
-- CALL EndTrip(3);
-- CALL StartTrip(1, 2);
-- CALL EndTrip(1);
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


-- SELECT 
-- trip_id,
-- bike_id,
-- user_id,
-- start_time,
-- end_time,
-- duration_minutes,
-- CONCAT (cost, 'kr'),
-- CONCAT (ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
-- CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
-- simulation_trip
-- FROM Trip;

-- SELECT
-- bike_id,
-- status
-- FROM Bike;
-- CALL RemoveTrips(1);


-- SELECT 
-- trip_id,
-- bike_id,
-- user_id,
-- start_time,
-- end_time,
-- duration_minutes,
-- CONCAT (cost, 'kr'),
-- CONCAT (ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
-- CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
-- simulation_trip
-- FROM Trip;

-- SELECT 
-- trip_id,
-- bike_id,
-- user_id,
-- start_time,
-- end_time,
-- CONCAT (ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
-- CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position
-- FROM Trip WHERE user_id = 2;

-- SELECT
-- movement_id,
-- bike_id,
-- ST_X(position),
-- ST_Y(position)
-- FROM BikeMovement
-- ORDER BY bike_id, movement_id;

-- SELECT
-- bike_id,
-- status,
-- ST_X(position),
-- ST_Y(position),
-- simulation
-- FROM Bike;

-- CALL RemoveBikes(1);

-- SELECT
-- bike_id,
-- status,
-- ST_X(position),
-- ST_Y(position),
-- simulation
-- FROM Bike;

-- SELECT * FROM User;