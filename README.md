# Habitat

Habitat is a light-weight web server with APIs to POST or GET temperature and humidity readings from sensors. It’s built with Express and uses PostgreSQL as a database.

## Installation

Clone the repository to your machine:

```shell
$ git clone https://github.com/RhettTrickett/habitat.git
```

and install the dependencies:

```
$ npm install
```

In addition to the above you’ll need to have PostgreSQL installed on your machine. You can find installation instructions for various platforms [here](https://www.postgresql.org/download/).

‌

## Set up

### Database

Habitat can automatically set up its database and tables but it needs a PostgreSQL user to own this database. With PostgreSQL installed you can create a new user with this command:

```shell
$ createuser -P username
```

Next run the command below. It will ask you for a name for your database as well as the username and password for the user you’ve created above.

```shell
$ npm run setupdb
```

This script will do the following:

* Create a `.env` file with the database name, user and password you’ve just provided. Express will then use these details to connect to the database when it needs to insert or retrieve data.
* Create a new database and set the user you’ve provided as the owner
* Create the required _users_, _sensors_ and _measurements_ tables in the database

### Create a Habitat admin user

You’ll need an admin user make authenticated calls to the API:

```
$ npm run createadmin
```

### Create a sensor 

You need to include a `sensor_id` when you log temperature and humidity readings to Habitat, so you can create one like this:

```
$ npm run createsensor
```

‌

## API

### Authentication

_**WARNING: Habitat uses Basic Authentication over HTTP**. Do not use Habitat on publically accessible networks, it is not secure. Using Basic Authentication over HTTP means that authentication credentials are not encrypted when requests are sent over the network, and so they may be intercepted by others on the network. For now, you should only use Habitat on your private Wi-Fi network where you are certain that there are no malicious users. Support for more secure authentication will be added in subsequent versions._

### Hostname

The examples below use the `localhost` hostname when making requests. This will work if you are making requests from the same device you are running Habitat on. However, if you’re making a request from one \(client\) device to another \(server\) on the private network, the request must be made to the server’s private IP address within the network. 

You can determine the private IP address for a device on a network by running a command from its command-line: On Linux run `hostname -I`. On Mac OS, run `ipconfig getifaddr en`. On Windows, run `ipconfig`  and look for the value labelled IPv4 address. 

Once you have this, replace `localhost` in the request examples below with the IP address of the target device. So `http://localhost:3000/measurements/latest/` would become `http://<ip_address>:3000/measurements/latest/`.

### Record a sensor reading

To record a sensor reading you can make a POST request with Basic Authentication to the `/measurements/` endpoint with the following JSON body:

```json
{
  "sensor_id": 1,
  "celcius": 21.4,
  "humidity": 32.4
}
```

`celcius` and `humidity` measurements are supported out of the box, you can also add support for more measurement types. See **Custom measurment fields** lower down for details.

You must include a `sensor_id` field for a valid sensor in the database when recording measurements. You can create a new sensor by running `npm run createsensor` from the command-line in the root of the project.

Here is an example of a `curl` request that you can make from the command-line:

```shell
$ curl -u username:password \
        --header "Content-Type: application/json" \
        --request POST \
        --data '{"sensor_id":1 ,"celcius":21.4, "humidity": 32.4}' \
        http://localhost:3000/measurements/
```

### Get latest reading

You can get the latest reading from the database by making a GET request with Basic Authentication to the `/measurements/latest/` endpoint. Here is a `curl` example:

```shell
$ curl -u username:password \
        http://localhost:3000/measurements/latest/ | json_pp
```

‌

## Custom measurement fields

If you’d like to support additional measurement types, you can add new columns to the `measurements` database and then include these fields in your POST request JSON. Here’s how you could add support for Fahrenheit temperatures.

Connect to the database from the command-line using the `psql` client:

```shell
$ psql dbname
```

Enter the following SQL query to alter the table and add a Fahrenheit column. You can set whatever [data types and constraints](https://able.bio/rhett/getting-hands-on-with-postgresql-on-linux--e8d67b59#tables) you’d like:

```sql
ALTER TABLE measurements ADD COLUMN fahrenheit FLOAT;
```

Now you can include a fahrenheit in your POST requests:

```json
{
  "sensor_id": 1,
  "fahrenheit": 70.5,
  "celcius": 21.4,
  "humidity": 32.4
}
```

## Contributions

Any contributions are welcome.

‌