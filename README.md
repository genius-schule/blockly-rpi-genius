# Contents of this repository

This repository contains the code needed to use the Raspberry Pi in school to read and display sensor data. The sensor readout is programmed with a block-based programming language (blockly).

It is a fork of the code by Dominik Jerger who did his bachelors thesis on this topic. He forked it from the Grazer Computer Club (https://github.com/GrazerComputerClub/Blockly-gPIo).

It contains the following bits and pieces:
* This instruction on how to set up the raspberry pi
* The code for blockly with somme addional grove sensors
* Some additional files to use the raspberry pi in school

The long story:

We want to use the Raspberry Pi 4 in school to teach the pupils how to code. Therefore external sensors are programmed and the data is read and displayed. For example one can use a CO2-sensor to investigate photosynthesis.

The programming is done with blockly and some blocks we programmed by ourselves. The sensor are mostly grove sensors. Then the data is displayed live with <a href="https://matplotlib.org/">matplotlib</a>. The pupils connect to the Raspberry Pi by WiFi (provided by raspap) with a VNC app.

Since the code is used in german schools, most sensors are implemented in german

## Todo
* [ ] Update to newest blockly version
* [ ] Program one sensor block (AHT22)
* [ ] Update Readme (Installation, depencencies...) and how to use
* [ ] Installation instructions
* [ ] Desktop files
* [ ] Changed seeed installation file

## How to setup the system
The outcome of this section should be a ready-to-use system image for the Raspberry Pi 4.

1. Download Raspberry Pi OS and install it on an SD card, boot and set up username and passwort.
2. Update the Pi, activate VNC and set display resloution to 1280x720 (via `raspi config`, the display resolution is changed to match the screen of iPad, which are used in school).
3. Install <a href="https://raspap.com/#docs">raspap</a> and *onboard*, a virtual keyboard.
4. Install `matplolib` and the *grove package* by seeed TODO
5. Clone this git repository
6. Install the desktop files TODO

## Sensors with specific blocks
We use the <a href="https://wiki.seeedstudio.com/Grove_System/">grove system</a> by *seeed studio*. The sensors of the *grove system* are connected with the <a href="https://wiki.seeedstudio.com/Grove_Base_Hat_for_Raspberry_Pi/">Grove Base Hat</a> to the Raspberry Pi. The following sensors where implemented:
* <a href="https://wiki.seeedstudio.com/Grove-VOC_and_eCO2_Gas_Sensor-SGP30/">Grove - VOC and eCO2 Gas Sensor(SGP30)</a>
  * (Python-Library) <a href="https://pypi.org/project/seeed-python-sgp30/">seeed-python-sgp30</a>
  * (Python-Library) <a href="https://github.com/Seeed-Studio/grove.py">grove.py</a>

* <a href="https://wiki.seeedstudio.com/Grove-CO2_Temperature_Humidity_Sensor-SCD30/">Grove - CO2 & Temperature & Humidity Sensor (SCD30)</a>
  * (Python-Library) <a href="https://pypi.org/project/scd30-i2c/">scd30-i2c</a>

* <a href="https://wiki.seeedstudio.com/Grove-Light_Sensor/">Grove - Light Sensor</a>
  * (Python-Library) <a href="https://github.com/Seeed-Studio/grove.py">grove.py</a>

Additionally, the sensor <a href="https://www.waveshare.com/wiki/MQ-135_Gas_Sensor"> MQ-135</a> is integrated.

## Blockly-gPIo
Visual programming for the Raspberry Pi with access to the GPIO and a simple browser-based simulation mode.

The original blockly by google is extended to integrate the GPIOs of the Raspberry Pi. Thankfully, we didn't need to start from the beginning because 
we found [blockly-gpio](https://github.com/carlosperate/Blockly-gPIo) from carlosperate on Github.

### Dependencies
 * python3
 * python3 librarys (websockets, gpiozero)
 * webserver, if run locally

### Installation
* Make sure that Raspbian 10 (Buster) has the all dependencies installed:  
```
  sudo apt-get install python3-dev python3-gpiozero python3-pip python3-websocket  
  sudo pip3 install websockets -t /usr/local/lib/python3.7/dist-packages
```
*  Download this repository and execute *run.py*:  
  ```
  git clone https://github.com/GrazerComputerClub/Blockly-gPIo.git  
  cd Blockly-gPIo  
  python3 run.py
  ```
*  Optional: Install local webserver with blockly-gpio   
  ```
  apt-get install lighttpd
  git clone https://github.com/GrazerComputerClub/Blockly-gPIo.git
  install -v -o www-data -g www-data -m 775 -d "/var/www/html/Blockly-gPIo/"
  cp -r Blockly-gPIo/public/* "/var/www/html/Blockly-gPIo"
  chown -R www-data:www-data "/var/www/html/Blockly-gPIo"
  ```
