require('dotenv').config({ path: __dirname + '/../../.env' })
const { execSync } = require('child_process');
const pool = require('../database');

var dbName = process.argv[2];
var dbUser = process.argv[3];

// Check if required arguments 
// have been provided
if (dbName && dbUser) {

  // SQL statements that are used to create the
  // three tables: users, sensors, measurements
  var createDbSQL = `CREATE DATABASE $1 OWNER $2;`;
  var createDbParams = [dbName, dbUser];
  var usersTableSQL =
      `CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    is_admin BOOLEAN DEFAULT false
);`
  var sensorsTableSQL =
      `CREATE TABLE sensors(
    sensor_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);`
  var measuresTableSQL =
      `CREATE TABLE measurements(
    id SERIAL PRIMARY KEY,
    sensor_id INT,
    celcius FLOAT,
    humidity FLOAT,
    created TIMESTAMP DEFAULT NOW(),
    CONSTRAINT sensor
      FOREIGN KEY(sensor_id)
        REFERENCES sensors(sensor_id)
  );`


  execSync(`createdb -O ${dbUser} ${dbName}`);
  console.log(`Created database: '${dbName}'`);


  pool.query(usersTableSQL, (err, res) => {
      if (err) {
          console.log(err.stack)
      } else {
          console.log(`Added table: 'users'`)
      }
  });

  pool.query(sensorsTableSQL, (err, res) => {
      if (err) {
          console.log(err.stack)
      } else {
          console.log(`Added table: 'sensors'`);

          pool.query(measuresTableSQL, (err, res) => {
              if (err) {
                  console.log(err.stack)
              } else {
                  console.log(`Added table: 'measurements'`);
                  process.exit(0)
              }
          });

      }
  });



} else {
    console.error('Aborted: Please provide database name and username as arguments');
}