-- For now, let's just show the properties in Vancouver and SOME details 
-- INCLUDING their average rating! (think about linking property id with reviews)

-- First build it incrementally, go without ratings first
SELECT properties.id, title, cost_per_night, AVG(property_reviews.rating) as average_rating
-- Join the two tables we need info from
FROM properties
JOIN
-- Commonality being the property id's
property_reviews ON properties.id = property_id
-- We filter the properties in vancouver - since we can't guarantee spelling, use %
WHERE properties.city LIKE '%ancouv%'
GROUP BY properties.id
-- THEN our aggregate function in a HAVING clause once we've grouped them together
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night ASC
LIMIT 10;