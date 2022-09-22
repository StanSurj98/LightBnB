-- This is where our INSERT statements will go 

-- Users
INSERT INTO users (name, email, password)
VALUES (
  'Alice Bobson',
  'alice_bobson@gmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'
),
(
  'Bob Builder',
  'bob_builder@gmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'
),
(
  'Chris Dominic',
  'c_dom@gmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'
);

-- Properties
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES 
(
  1, 'house', 'description', 'url', 'url2', 300, 4, 3, 3, 'canada', '1st st', 'calgary', 'ab', 'post_code', true
),
(
  2, 'beach house', 'description', 'url', 'url2', 450, 4, 4, 5, 'canada', '2nd st', 'vancouver', 'bc', 'post_code', true
),
(
  3, 'apartment', 'description', 'url', 'url2', 200, 1, 2, 2, 'canada', '3rd st', 'edmonton', 'ab', 'post_code', true
);

-- Reservations
INSERT INTO reservations  ( start_date,  end_date , property_id, guest_id )
VALUES
(
  '2018-09-11', '2018-09-26', 2, 3
),
(
  '2019-01-04', '2019-02-01', 2, 2
),
(
  '2023-10-01', '2023-10-14', 1, 3
);

-- Property Reviews
INSERT INTO property_reviews ( guest_id, property_id, reservations_id, rating, message )
VALUES
(
  3,             2,                1,        3, 'messages'
),
(
  2,             2,                2,        4, 'messages'
),
(
  3,             1,                3,        4, 'messages'
);