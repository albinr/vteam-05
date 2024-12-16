USE vteam;

source setup.sql
source ddl.sql

INSERT INTO Pricing (unlock_fee, per_minute_rate, wrong_parking)
VALUES (15.0, 2.5, 30.0);

-- INSERT INTO User (user_id, Balance, Email)
-- VALUES (1, 100, 'test@email.com');

-- INSERT INTO Bike (position)
-- VALUES (POINT(16.1612, 55.5869));

-- INSERT INTO Bike (position)
-- VALUES (POINT(76.1612, 15.5869));

-- INSERT INTO Bike (position, simulation)
-- VALUES (POINT(76.1612, 15.5869), 1);

-- INSERT INTO Bike (position)
-- VALUES (POINT(16.1612, 55.5869));

-- INSERT INTO Bike (position, simulation)
-- VALUES (POINT(76.1612, 15.5869), 1);

-- INSERT INTO Bike (position, simulation)
-- VALUES (POINT(16.1612, 55.5869), 1);

-- INSERT INTO Bike (position, simulation)
-- VALUES (POINT(76.1612, 15.5869), 1);