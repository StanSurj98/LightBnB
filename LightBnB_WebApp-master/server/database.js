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
      console.log(res.rows[0]);
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
  return getAllProperties(null, 2);
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
  // !! NOTE !! need to return the pool.query promise chain
  return pool
    // !! IMPORTANT !! parameterize the query against SQL injections
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((res) => {
      // console.log(res.rows);
      // .then() always wraps our return in a promise object despite res.rows being an array of objects
      return res.rows;
      // because it is used in a .then() elsewhere in the app, which only accepts promise objects
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
