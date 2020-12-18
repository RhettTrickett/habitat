/**
 * BasicHTTPClient.ino
 *
 *  Created on: 24.05.2015
 *
 */
#include <U8x8lib.h>
#include <Arduino.h>
#include <SPI.h>
#include <RH_RF95.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include "credentials.h" // My WiFi configuration.

#include <HTTPClient.h>

#define USE_SERIAL Serial
#include <ArduinoJson.h>

WiFiMulti wifiMulti;

#define RFM95_CS 18
#define RFM95_RST 14
#define RFM95_INT 26

/*
const char* bayou_url = "http://157.230.188.100:3000/api/drives/1a142aee9702045f3049325318f14fab10d24ce3e0c8a387d092759c0594ba5e";
const char* bayou_privkey = "db84537367d8e9096e93b97cfef3adc11781d90abb56f24d96ee12e7ce899344";
*/

// Change to 434.0 or other frequency, must match RX's freq!
#define RF95_FREQ 915.0

// Singleton instance of the radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);

String receivedText;
String receivedRssi;

U8X8_SSD1306_128X64_NONAME_SW_I2C u8x8(/* clock=*/ 15, /* data=*/ 4, /* reset=*/ 16);


unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 90 seconds (5000)
unsigned long timerDelay = 90000;




void setup() {

u8x8.begin();
  u8x8.setFont(u8x8_font_chroma48medium8_r);

  u8x8.drawString(0, 0, "Gateway on!");
  
    USE_SERIAL.begin(9600);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    //wifiMulti.addAP("InmanSquareOasis", "portauprince");

wifiMulti.addAP(SSID,WiFiPassword);

while (!rf95.init()) {
    Serial.println("LoRa radio init failed");
    Serial.println("Uncomment '#define SERIAL_DEBUG' in RH_RF95.cpp for detailed debug info");
    while (1);
  }
  Serial.println("LoRa radio init OK!");

  // Defaults after init are 434.0MHz, modulation GFSK_Rb250Fd250, +13dbM
  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("setFrequency failed");
    while (1);
  }
  Serial.print("Set Freq to: "); Serial.println(RF95_FREQ);

  rf95.setTxPower(23, false);



}

void loop() {

DynamicJsonDocument doc(2048);

float temperature = 23.3;
float humidity = 10.2;

doc["private_key"] =  habitat_privkey;
//JsonObject fields = doc.createNestedObject("fields");

doc["celcius"]=temperature;
   doc["humidity"]=humidity;

String json;
serializeJson(doc, json);
serializeJson(doc, Serial);


      // wait for WiFi connection
    if((wifiMulti.run() == WL_CONNECTED)) {

Serial.println("Posting!");

        HTTPClient http;
        int httpCode;

/*
// FarmOS -----------------------------------------------

        USE_SERIAL.print("[HTTP] begin...\n");
        // configure traged server and url
        USE_SERIAL.print(farmOS_url);
        
        http.begin(farmOS_url);
        //http.addHeader("Authorization",bayou_privkey);

        //http.begin(url);
        //http.addHeader(authorize);
        
        http.addHeader("Content-Type", "application/json");
        USE_SERIAL.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        
        String output;
        serializeJson(doc, output);
        httpCode = http.POST(output);        

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
            }
        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();

*/
// BAYOU -----------------------------------------------

        USE_SERIAL.print("[HTTP] begin...\n");
        // configure traged server and url
        USE_SERIAL.print(habitat_url);
        
        http.begin(habitat_url);
        
        //http.addHeader("Authorization",habitat_privkey);
        
        http.addHeader("Content-Type", "application/json");
        USE_SERIAL.print("[HTTP] POST...\n");
        // start connection and send HTTP header
        
      
        httpCode = http.POST(json);        

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] POST... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
            }
        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
        
        
    }

    delay(10000); // wait a minute until the next post
      
    
 // end if (rf95.available())

} // end loop
