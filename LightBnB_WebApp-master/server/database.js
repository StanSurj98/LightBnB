// Dummy data from json/
const properties = require('./json/properties.json');
const users = require('./json/users.json');

// Connecting to our PostgreSQL DB
const { Pool } = require('pg');
const pool = new Pool({
  user: 'stanleysurjanto',
  pass: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((res) => {
      if (!res.rows[0]) return null; // If user doesn't exist but not error yet

      // console.log(res.rows[0])
      return res.rows[0]; // User Object returned as promise
    })
    .catch(e => console.log(e.message));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(res => {
      // console.log(res.rows[0]);
      if (!res.rows[0]) return null;
      return res.rows[0];
    })
    .catch(e => console.log(e.message))
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $3, $2)
    RETURNING *;`, [user.name, user.password, user.email])
    .then((res) => {
      // console.log(res.rows[0]);
      return res.rows[0];
    }).catch(e => console.log(e.message));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT reservations.*, properties.*
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    WHERE reservations.guest_id = $1
    ORDER BY reservations.start_date
    LIMIT $2;
  `, [guest_id, limit])
    .then(res => {
      // console.log(res.rows)
      return res.rows;
    })
    .catch(e => console.log(e.message));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // For options filtering in the search bar
  const queryParams = [];
  // A dynamic query that we will update as each option added through
  // LEFT JOIN : for bug where new properties do not have property_reviews, REGARDLESS we want to see it
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN
  property_reviews ON properties.id = property_id
  WHERE 1=1
  `;
  // To see the options object
  console.log(`OPTIONS: `, options);


  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += ` AND properties.owner_id = $${queryParams.length}`;
  }

  if (options.city) {
    // we push a "like" string, can access it as $index later
    queryParams.push(`%${options.city}%`);
    // string concat the query with the proper WHERE filter
    queryString += ` AND properties.city LIKE $${queryParams.length}`; // the $1 position
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${Number(options.maximum_price_per_night) * 100}`);
    queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${Number(options.minimum_price_per_night) * 100}`);
    queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;
  }

  // Lastly we push in the limit parameter

  queryString += `
  GROUP BY properties.id
  `;


  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  console.log(queryString, queryParams);
  
  // !! NOTE !! need to return the pool.query promise chain
  return pool
    // !! IMPORTANT !! parameterize the query against SQL injections
    .query(queryString, queryParams)
    .then((res) => {
      // console.log(res.rows);
      return res.rows;
    })
    .catch(e => console.log(e.message));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
