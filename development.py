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
#import board
#import adafruit_scd4x
#from grove.i2c import Bus
#from grove.gpio import GPIO
#from grove.adc import ADC

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
    try:
        # For debugging without the seeed library comment the following two lines and uncomment below
        aht20 = GroveAHT20()
        #temp, humi = aht20.read()
        temp = 1
        return temp
    except:
        print("Hast du den Sensor korrekt angeschlossen? (AHT20 an I2C)")
        print("Es konnten keine Daten aufgenommen werden.")
        return float('nan')

#measurement_aht20() # Only needed in finished block

###############################################################################
# SENSOR BLOCK SCD40
###############################################################################
# TODO!!!! add try excep
i2c = board.I2C()  # uses board.SCL and board.SDA
scd4x = adafruit_scd4x.SCD4X(i2c)
scd4x.start_periodic_measurement()
#print("Serial number:", [hex(i) for i in scd4x.serial_number])

def measurement_scd40_temp():
    # returns cached (!) or new value if ready (new value around every 5s)
    # returns None if sensor not ready after startup!
    try:
        temp = scd4x.temperature
        if temp == None:
            return float("nan")
        return temp
    except:
        print("Hast du den Sensor korrekt angeschlossen? (SCD40 an I2C)")
        print("Es konnten keine Daten aufgenommen werden.")
        return float('nan')


def measurement_scd40_co2():
    # returns cached (!) or new value if ready (new value around every 5s)
    # returns None if sensor not ready after startup!
    try:
        co2 = scd4x.CO2
        return co2
    except:
        print("Hast du den Sensor korrekt angeschlossen?")
        print("Es konnten keine Daten aufgenommen werden.")

    #print("Humidity: %0.1f %%" % scd4x.relative_humidity)

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
def measurement_test():
    value = random.random()
    return value

#measurement_test() # Only needed in finished block

###############################################################################
# SAVE VALUE BLOCK
# Saves given value, should be implented so it writes in right file
###############################################################################
def write_to_csv(value, sensor):
    # Check what kind of data is given to the function
    if sensor == "Temperatur":
        kind = "Temperatur"
        unit = "°C"
    elif sensor == "Distanz":
        kind = "Abstand"
        unit = "cm"
    elif sensor == "Feuchtigkeit":
        kind = "Feuchtigkeit"
        unit = "% rel."
    elif sensor == "Helligkeit":
        kind = "Helligkeit"
        unit = "a.u."
    else:
        kind = "Unbekannt"
        unit = "a.u."

    filename = kind + ".csv"
    time = dt.datetime.now().strftime("%H:%M:%S")

    filetemp = os.path.expanduser(dataDir) + str(filename)
    with open(filetemp, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([time, value, unit, kind])
#write_to_csv(value_measurement, input_kind) # only in finished block

###############################################################################
# PLOTTING BLOCK
###############################################################################
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
                               names = ["time", "value", "unit", "kindDE"])
        data["time"] = pd.to_datetime(data["time"], format = "%H:%M:%S")
        # calculate difference in minutes to first measurement
        data['time_diff'] = (data['time'] - data['time'].iloc[0]).dt.total_seconds() / 60
        # Only first value for unit and name are used, since they
        # should stay the same
        axs[num].set_title(str(data["kindDE"][0]))
        axs[num].set_ylabel(data["unit"][0])
        axs[num].set_xlabel("Zeit in Minuten seit Experimentbeginn")
        # Plot value over time
        axs[num].plot(data["time_diff"], data["value"], marker = "x", color = colors[num])
        axs[num].grid()
        # CAREFUL: The measurement rate has to be 1Hz or lower!
        # Else, the points in between are not plotted, since they have the same
        # timestamp
        #axs[num].xaxis.set_major_formatter(DateFormatter("%H:%M:%S"))

    #fig.supxlabel("Zeit") # does not work on old versions of matplotlib
    plt.xticks(rotation = 45)
    plt.tight_layout()
    plotpath = os.path.expanduser(dataDir) + "plot.png"
    plt.savefig(plotpath, dpi = 300)
    plt.close()

#plot_data() # Only needed in finished block

###############################################################################
for count in range(100):
    print("------- " + str(count) + " -------")
    #print(measurement_aht20())
    print(measurement_test())
    write_to_csv(measurement_test(), "Temperatur")
    #print(measurement_scd40_temp())
    #print(measurement_scd40_co2())
    plot_data()
    time.sleep(1) # Minimum time distance, how is this done? TODO!
