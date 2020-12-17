var db = require('../config/database');

exports.getLatestMeasurement = function(req, res, next) {
    db.query('SELECT * FROM measurements ORDER BY created DESC LIMIT 1;', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
}


exports.postNewMeasurement = function(req, res, next) {

    // Extract into variables from request body
    var { feed_id, private_key, celcius, humidity } = req.body;

    console.log(feed_id);
    console.log(private_key);
    console.log(celcius);
    console.log(humidity);

      const query = {
        //text: 'INSERT INTO users(name, email) VALUES($1, $2)',
        text: 'SELECT * FROM feeds WHERE feed_id = $1',
        values: ['2'],
      }
      

      //console.log(query);
      
      /*
    db.query('SELECT * FROM feeds WHERE feed_id = 1', (error, results) => {
        if (error)
            throw error;
        console.log(results);
    });
    */

    console.log('poster key is:');
    console.log(private_key);

   db.query(query, (error, results) => {
    if (error)
        throw error;
        
    console.log("associated private_key is:");
    var key_to_match =results.rows[0].private_key;
    console.log(key_to_match);
    if(private_key==key_to_match) {
        console.log("key match!");
    }
    else{
        console.log("keys don't match!");
    }
});
    
    // Check if values are int, float and float
    var dataValid = (
        Number.isInteger(feed_id) &&
        typeof celcius == 'number' && !Number.isInteger(celcius) &&
        typeof humidity == 'number' && !Number.isInteger(humidity)
    )
    
    if (dataValid)  {
        // Create new measurement
        var insertSQL = `INSERT INTO measurements (feed_id, celcius, humidity) VALUES ($1, $2, $3);`
        var params = [feed_id, celcius, humidity]

        db.query(insertSQL, params, (error, result) => {
            if (error) {
                res.status(400).send(error);
            } else {
                res.status(200).send('Measurement recorded\n');    
            }
        });
    
    } else {
        res.status(400).send('Please check that your data types are correct' );
    }


}