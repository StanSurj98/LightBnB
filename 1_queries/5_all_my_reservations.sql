-- Get all reservation data for a single user when they "log in"
-- Select the reservation id, property title, reservation start_date, property cost_per_night and the average rating of the property.
-- order results by earliest start date to most recent start date
-- limit results to 10


-- Use guest_id = 1 for now  

SELECT 
reservations.id, 
properties.title, 
properties.cost_per_night,
reservations.start_date,
AVG(property_reviews.rating) AS average_rating

FROM 
-- connecting just the user's reservation to the property in question
reservations JOIN properties ON property_id = properties.id
-- only connecting property reviews with the associated properties 
JOIN property_reviews ON properties.id = property_reviews.property_id

-- DOES THIS MAKE SENSE BELOW? what if we have duplicate reservation_id's? it makes more sense to join by PROPERTY id's
-- JOIN property_reviews ON reservations.id = property_reviews.reservation_id

WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;

