const prompt = require('prompt');
const { exec } = require('child_process');
var fs = require('fs');

prompt.message = "";
prompt.delimiter = "";

  var schema = {
    properties: {
      dbName: {
        description: 'Database name: ',
        pattern: /^[a-zA-Z0-9\-\_]+$/,
        message: 'Please keep database name to letters, numbers, underscores or dashes',
        required: true
      },
      dbUser: {
        description: 'Database user (must exist): ',
        pattern: /^[a-zA-Z0-9\-\_]+$/,
        message: 'Please keep database user to letters, numbers, underscores or dashes',
        required: true
      },
      dbPassword: {
        description: 'Database user password: ',
        hidden: true,
        required: false
      }
    }
  };


  console.log("Please enter details for database creation");
  prompt.start();
  prompt.get(schema, function (err, result) {

    // Create variables from user prompt data,
    // set dBPassword to '' if not provided.
    var { dbName, dbUser } = result;
    var dbPassword = result.dbPassword ? result.dbPassword : '';

    var envFile = 
      `PORT=3000
      DB_NAME=dbname
      DB_USER=dbusername
      DB_PASSWORD=dbpassword
      DB_HOST=localhost
      DB_PORT=5432`;

    // Update envFile text with database name, 
    // username and password from prompt.    
    var envFile = envFile.replace(/dbname/g, dbName);
    var envFile = envFile.replace(/dbusername/g, dbUser);
    var envFile = envFile.replace(/dbpassword/g, dbPassword);
    var envFile = envFile.replace(/ /g, '');
    
    // fs.writeFileSync doesn't seem to like writing to .env file name 
    // so we write to normal file name config.txt and then rename it.
    fs.writeFileSync('config.txt', envFile, {encoding:'utf8', flag:'w'});
    exec(`mv config.txt .env`);

    console.log('Updated the .env config file with the above database details')

    // Now that the .env file is set up we can run the  
    // command to create the database and tables
    exec(`node config/setup/createDatabase.js ${dbName} ${dbUser}`, (error, stdout, stderr) => {
      if (err) console.log(err);
      if (stderr) console.log(stderr);

      // Print output from the 
      // command being called
      console.log(stdout);
    });
    

  });

    