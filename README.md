# Contents of this repository

This repository contains the code needed to use the Raspberry Pi in school to read and display sensor data. The sensor readout is programmed with a block-based programming language (blockly).

It is a fork of the code by Dominik Jerger who did his bachelors thesis on this topic. He forked it from the Grazer Computer Club (https://github.com/GrazerComputerClub/Blockly-gPIo).

It contains the following bits and pieces:
* This instruction on how to set up the Raspberry Pi
* The code for blockly with somme addional grove sensors
* Some additional files to use the Raspberry Pi in school

The long story:

We want to use the Raspberry Pi 4 in school to teach the pupils how to code. Therefore external sensors are programmed and the data is read and displayed. For example one can use a CO2-sensor to investigate photosynthesis.

The programming is done with blockly and some blocks we programmed by ourselves. The sensor are mostly grove sensors. Then the data is displayed live with <a href="https://matplotlib.org/">matplotlib</a> and a simple html page. The pupils connect to the Raspberry Pi by WiFi and a browser.

Since the code is used in german schools, most sensors are implemented in german

## TODO
* [ ] Update to newest blockly version
* [ ] Set x0 to 0, since first few nan values are already measuremnts, also check nan behaviuour

# How to setup the system
The outcome of this section should be a ready-to-use system image for the Raspberry Pi 4.

1. Download <a href="https://www.raspberrypi.com/software/operating-systems/">Raspberry Pi OS</a> and install it on an SD card, boot and set up username and passwort (`pi:pi`, username should be `pi`, since paths refer to `/home/pi`.
2. Update the Raspberry Pi.
3. *Only if used with a VNC server to connect:* Activate VNC (in `raspi-config`) and set display resloution to 1280x720 (via `raspi-config`, the display resolution is changed to match the screen of iPad, which are used in school).
4. Install <a href="https://raspap.com/#docs">raspap</a> and `onboard`, a virtual keyboard (raspap user: `admin`, password: `secret`, raspap wifi ssid: `raspi-webgui`, password: `ChangeMe`).
5. Install `matplolib` and the grove package (original can be found <a href="https://github.com/Seeed-Studio/grove.py">here</a>, but this is not working on 03.08.2023, a working version is in `./files`)
6. Clone this git repository
7. Install the desktop files by coping the .desktop files in `./files/desktop` to `~/Desktop`, the file `blocklyServer.desktop` has to be copied to `/etc/xdg/autostart`!

install these packages:

```
sudo apt-get install python3-dev python3-gpiozero python3-websockets python3-matplotlib firefox python3-pandas
```
for support of the SCD40 sensor:

```
pip3 install adafruit-circuitpython-scd4x
```

## Sensors with specific blocks
We use the <a href="https://wiki.seeedstudio.com/Grove_System/">grove system</a> by *seeed studio*. The sensors of the *grove system* are connected with the <a href="https://wiki.seeedstudio.com/Grove_Base_Hat_for_Raspberry_Pi/">Grove Base Hat</a> to the Raspberry Pi. The following sensors where implemented:

* The SCD40 by Calliope on the I2C port
* The AHT20 by grove on the I2C port

Some examples by grove can be found and copied from the examples folder

```
/usr/local/lib/python3.9/dist-packages/grove
```

## Start blockly
Blockly can be started in three modes. First, if the webserver is used as described below, simply connect to the Rasperry Pi via WiFi (attention: the SSID is changed) and open `10.3.141.1` and start programming.

Second, if used with VNC, connect to the Rasperry Pis WiFi (attention: the SSID is changed) and open an VNC app and connect to `10.3.141.1`. Then open the files on the desktop accordingly.

Third, by executing `python3 run.py` in this folder on a terminal. The background service is started and one can see severe errors.

**Imprtant:** When opening `10.3.141.1` or manually `./public/index_de.html` with a browser and change the settings to `localhost` (or `GeNIUS Pi` when connecting via webserver). The settings are opened with the gear button.

**If using with VNC:** Change the path for plotting in the start block to the right path, in `./public`, since it is the path for the webserver in the normal version.

## Old installation instruction of the GC2

### Blockly-gPIo
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
  Add the following line to `/etc/rc.local` to autostart the deamon

```
sudo -u pi -i -- bash -c "python3 /home/pi/blockly-rpi-genius/run.py &"
```

# Writing new blocks
This is quite easy, but a few steps need to be done:

1. You can develop new blocks in the `./development.py` file, since all blocks done in the GeNIUS project were developed here.
2. Copy the contents of the block in the `genius.js` file in `./public/blocks`. To do this faster, use the `./addstring` script, which adds the desired strings to the start and end of the lines. Important: since most blocks are structured in functions, the function needs to be executed at the end ob the block.
3. Think of adding `;` at the end of every block definition.

# Webserver
The blockly app can also be run on a webserver, and can be reached in the local network.
If the end user device is connected with the WiFi of the Raspberry Pi (SSID "raspi webgui"), blockly can be reached in every browser at the adress "http://10.3.141.1/index.html".

To start the webserver, several steps have to be done:

1. Change the port of raspAP from 80 to 8080 in `/etc/lighttpd/lighttpd.conf`:

```
lighttpd server.port = 8080
```

2. install apache2: `sudo apt-get install apache2`

3. Create the folders and copy the data:

```
sudo install -v -o www-data -g www-data -m 775 -d "/home/pi/blockly-web"
sudo cp -r blockly-rpi-genius/public/* "/home/pi/blockly-web/"
sudo chown -R www-data:www-data "/home/pi/blockly-web/"
sudo chmod -R 777 /home/pi/blockly-web/messungen"
```

4. Change the configuration file (`/etc/apache2/apache2.conf`) of apache:

```
<Directory /home/pi/blockly-web>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

5. And in `/etc/apache2/conf-enabled/000-default.conf`:

```
DocumentRoot /home/pi/blockly-web
```

6. Add this line to `/etc/rc.local` to change the SSID of the WiFi to the MAC adress of the pi (be careful, the `changessid` script has to be executable `chmod +x changessid`):

```
sudo -- bash -c "/home/pi/blockly-rpi-genius/files/changessid"
```

# Shrinking the image
Clone <a href="https://github.com/Drewsif/PiShrink" >PiShrink</a> and execute:

```
sudo pishrink.sh -v -d in.img out_shrinked.img
```

Important: when first booting a shrinked image, wait minimum 10 minutes! It needs some time to unpack.
