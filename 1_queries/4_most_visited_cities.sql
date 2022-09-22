-- Get city name and # of reservations to see most visited places

-- We need to aggregate count all the reservations
SELECT city, COUNT(reservations.*) as total_reservations
FROM 
properties
JOIN
-- again, we know the only thing joining these tables are the property id's
reservations ON properties.id = property_id
-- reservations grouped by city
GROUP BY city
ORDER BY total_reservations DESC;