-- Get average duration of reservation 
-- this would be like avg("end date" - "start date")

SELECT AVG(end_date - start_date) AS average_duration
FROM reservations;