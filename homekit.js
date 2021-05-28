const hap = require("hap-nodejs");
require('dotenv').config({ path: __dirname + '/.env' })
var pool = require('./config/database');


const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const Service = hap.Service;

// optionally set a different storage location with code below
// hap.HAPStorage.setCustomStoragePath("...");

const accessoryUuid = hap.uuid.generate("raspberrypi");
const accessory = new Accessory("Raspberry Pi", accessoryUuid);

const tempService = new Service.TemperatureSensor("Temperature");
const tempCharacteristic = tempService.getCharacteristic(Characteristic.CurrentTemperature);
tempCharacteristic.on(CharacteristicEventTypes.GET, callback => {
  pool.query('SELECT * FROM measurements ORDER BY created DESC LIMIT 1;', (error, results) => {
        if (error)
            throw error;
        var latestTemp = results.rows[0].celcius;
        console.log("Queried current temp: " + latestTemp);
        callback(undefined, latestTemp);
    });
  
});

const humidityService = new Service.HumiditySensor("Humidity");
const humidityCharacteristic = humidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity);
humidityCharacteristic.on(CharacteristicEventTypes.GET, callback => {
  pool.query('SELECT * FROM measurements ORDER BY created DESC LIMIT 1;', (error, results) => {
        if (error)
            throw error;
        var currentHumidity = results.rows[0].humidity;
        console.log("Queried current humidity: " + currentHumidity);
        callback(undefined, currentHumidity);
    });
  
});

accessory.addService(tempService);
accessory.addService(humidityService);


// once everything is set up, we publish the accessory. Publish should always be the last step!
accessory.publish({
  username: "18:51:06:F4:BC:8A",
  pincode: "678-90-822",
  port: 0,
  category: hap.Categories.TemperatureSensor, // value here defines the symbol shown in the pairing screen
});

console.log("Accessory setup finished!");