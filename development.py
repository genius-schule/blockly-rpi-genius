import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter
import pandas as pd
import datetime as dt
import time
import math
import sys
import os
import csv
import random
from grove.i2c import Bus
from grove.gpio import GPIO
from grove.adc import ADC

###############################################################################
# START BLOCK
# All above libraries are added here, since we need them either way and
# do not add them in every sensor block.
###############################################################################
# Data directory for saving measurements and graphs
dataDir = "~/Desktop/Messungen/"

# Check if folder exists, else create directory
if not os.path.exists(os.path.expanduser(dataDir)):
    os.makedirs(os.path.expanduser(dataDir))

# Delete contents of directory
for filename in os.listdir(os.path.expanduser(dataDir)):
    # construct full file path
    file = str(os.path.expanduser(dataDir)) + filename
    if os.path.isfile(file):
        os.remove(file)

###############################################################################
# SENSOR BLOCK AHT20
###############################################################################
# copied from the example
class GroveAHT20(object):
    def __init__(self, address=0x38, bus=None):
        #pass
        self.address = address
        # I2C bus
        self.bus = Bus(bus)
    def read(self):
        self.bus.write_i2c_block_data(self.address, 0x00, [0xac, 0x33, 0x00])
        # measurement duration < 16 ms
        time.sleep(0.016)
        data = self.bus.read_i2c_block_data(self.address, 0x00, 6)
        humidity = data[1]
        humidity <<= 8
        humidity += data[2]
        humidity <<= 4
        humidity += (data[3] >> 4)
        humidity /= 1048576.0
        humidity *= 100
        temperature = data[3] & 0x0f
        temperature <<= 8
        temperature += data[4]
        temperature <<= 8
        temperature += data[5]
        temperature = temperature / 1048576.0*200.0-50.0  # Convert to Celsius
        return temperature, humidity

def measurement_aht20():
    csvaht20temp = "aht20temp.csv"
    csvaht20humi = "aht20humi.csv" # Not implemented yet

    try:
        # For debugging without the seeed library comment the following two lines and uncomment below
        #aht20 = GroveAHT20()
        #temp, humi = aht20.read()
        temp = 1
        #humi = 10

        time = dt.datetime.now().strftime("%H:%M:%S")

        fileaht20temp = os.path.expanduser(dataDir) + str(csvaht20temp)
        with open(fileaht20temp, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([time, temp, "°C", "AHT20"])
    except:
        print("Hast du den Sensor korrekt angeschlossen?")
        print("Es konnten keine Daten aufgenommen werden.")

#measurement_aht20() # Only needed in finished block

###############################################################################
# SENSOR BLOCK SEEED DISTANCE V2
###############################################################################
usleep = lambda x: time.sleep(x / 1000000.0)
_TIMEOUT1 = 1000
_TIMEOUT2 = 10000

class GroveUltrasonicRanger(object):
    def __init__(self, pin):
        self.dio = GPIO(pin)

    def _get_distance(self):
        self.dio.dir(GPIO.OUT)
        self.dio.write(0)
        usleep(2)
        self.dio.write(1)
        usleep(10)
        self.dio.write(0)
        self.dio.dir(GPIO.IN)

        t0 = time.time()
        count = 0
        while count < _TIMEOUT1:
            if self.dio.read():
                break
            count += 1
        if count >= _TIMEOUT1:
            return None
        t1 = time.time()
        count = 0
        while count < _TIMEOUT2:
            if not self.dio.read():
                break
            count += 1
        if count >= _TIMEOUT2:
            return None
        t2 = time.time()
        dt = int((t1 - t0) * 1000000)
        if dt > 530:
            return None
        distance = ((t2 - t1) * 1000000 / 29 / 2)    # cm
        return distance

    def get_distance(self):
        while True:
            dist = self._get_distance()
            if dist:
                return dist

def measurement_distance(pin):
    sonar = GroveUltrasonicRanger(pin)
    distance = sonar.get_distance()
    #distance = 1
    return distance

#measurement_distance(5) # 5 is D5 on the grove hat

###############################################################################
# SENSOR BLOCK SEEED MOISTURE
###############################################################################
class GroveMoistureSensor:
    # args: pin(int)
    def __init__(self, channel):
        self.channel = channel
        self.adc = ADC()

    @property
    def moisture(self):
        '''
        Get the moisture strength value/voltage

        Returns:
            (int): voltage, in mV
        '''
        value = self.adc.read_voltage(self.channel)
        return value

def measurement_moisture(pin):
    sensor = GroveMoistureSensor(pin)
    moisture = sensor.moisture
    #moisture = 1
    return moisture

#measurement_moisture(0) # 0 is port A0 on the grove hat

###############################################################################
# SENSOR BLOCK TEST
# This only tests the graph capabilities with random values.
# Name and unit have to be set as arguments
###############################################################################
def measurement_TEST(name, unit):
    csvTESTtemp = name + "values.csv"

    value = random.random()
    time = dt.datetime.now().strftime("%H:%M:%S")

    fileTESTtemp = os.path.expanduser(dataDir) + str(csvTESTtemp)
    with open(fileTESTtemp, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([time, value, unit, name])

#measurement_TEST("name", "unit") # Only needed in finished block

###########################################################################
# PLOTTING BLOCK
###########################################################################
def plot_data():
    # Use every .csv in dataDir
    filelist = [] # all filenames are stored in here
    for file in os.listdir(os.path.expanduser(dataDir)):
        if file.endswith(".csv"):
            filelist.append(file)

    # Check if filelist is empty, if empty return without plot
    if not filelist:
        print("Es gibt keine Daten zum Auswerten!")
        print("Mindestens ein Sensor muss verwendet werden und angeschlossen sein.")
        return 1
    
    # List of colors, since the below command does not work on old versions
    # Hopefully they are enough.
    #colors = mpl.colormaps.get_cmap("Set1").colors
    colors = ["red", "green", "blue", "black", "orange", "gray", "yellow",
              "teal", "cyan", "pink", "lime", "navy", "orchid", "tan"]

    # Create a figure with a subplot for every sensor, squeeze: always tuples
    fig, axs = plt.subplots(len(filelist), squeeze = False, sharex = True)
    fig.set_figheight(len(filelist) * 3) # set overall height
    fig.set_figwidth(10)
    axs = axs.flatten()

    for num in range(len(filelist)):
        path = os.path.expanduser(dataDir) + filelist[num]
        # Read data
        data = pd.read_csv(path, delimiter = ",", header = None,
                               names = ["time", "value", "unit", "name"])
        data["time"] = pd.to_datetime(data["time"], format = "%H:%M:%S")
        # Only first value for unit and name are used, since they
        # should stay the same
        axs[num].set_title("Sensor " + str(data["name"][0]))
        axs[num].set_ylabel(data["unit"][0])
        # Plot value over time
        axs[num].plot(data["time"], data["value"], marker = "x", color = colors[num])
        axs[num].grid()
        # CAREFUL: The measurement rate has to be 1Hz or lower!
        # Else, the points in between are not plotted, since they have the same
        # timestamp
        axs[num].xaxis.set_major_formatter(DateFormatter("%H:%M:%S"))

    #fig.supxlabel("Zeit") # does not work on old versions of matplotlib
    plt.xticks(rotation = 45)
    plt.tight_layout()
    plotpath = os.path.expanduser(dataDir) + "plot.png"
    plt.savefig(plotpath, dpi = 300)
    plt.close()
#plot_data() # Only needed in finished block

###############################################################################
#for count in range(100):
#    print(count)
#    measurement_aht20()
#   measurement_TEST("TEST1", "unit")
#    measurement_TEST("TEST2", "uni")
#    measurement_TEST("TEST3", "un")
#    measurement_TEST("TEST4", "u")
#    plot_data()
    #time.sleep(1) # Minimum time distance, how is this done? TODO!
    #time.sleep(2)
