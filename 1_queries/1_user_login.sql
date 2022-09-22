-- Get details for a single user - 'tristanjacobs@gmail.com' for now
-- IRL we want to show them a unique landing page!

SELECT id, name, email, password
FROM users
WHERE email = 'tristanjacobs@gmail.com';