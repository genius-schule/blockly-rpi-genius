import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter
import pandas as pd
import datetime as dt
import time
import os
import csv
import random
#import seeed

###############################################################################
# START BLOCK
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
def measurement_aht20():
    csvaht20temp = "aht20temp.csv"
    csvaht20humi = "aht20humi.csv" # Not implemented yet

    # copied from the example
	#class GroveAHT20(object):
        #def __init__(self, address=0x38, bus=None):
            #pass
            #self.address = address
            # I2C bus
            #self.bus = Bus(bus)
    	#def read(self):
            #self.bus.write_i2c_block_data(self.address, 0x00, [0xac, 0x33, 0x00])
            # measurement duration < 16 ms
            #time.sleep(0.016)
            #data = self.bus.read_i2c_block_data(self.address, 0x00, 6)
            #humidity = data[1]
            #humidity <<= 8
            #humidity += data[2]
            #humidity <<= 4
            #humidity += (data[3] >> 4)
            #humidity /= 1048576.0
            #humidity *= 100
            #temperature = data[3] & 0x0f
            #temperature <<= 8
            #temperature += data[4]
            #temperature <<= 8
            #temperature += data[5]
            #temperature = temperature / 1048576.0*200.0-50.0  # Convert to Celsius
            #temperature = 1
            #humidity = 1
            #return temperature, humidity

    #aht20 = GroveAHT20()
    #temp, humi = aht20.read()
    #DEBUG
    temp = 1
    humi = 10
    time = dt.datetime.now().strftime("%H:%M:%S")

    fileaht20temp = os.path.expanduser(dataDir) + str(csvaht20temp)
    with open(fileaht20temp, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([time, temp, "°C", "AHT20"])

###############################################################################
# SENSOR BLOCK TEST
###############################################################################
def measurement_TEST(unit, name):
    csvTESTtemp = name + "values.csv"

    value = random.random()
    time = dt.datetime.now().strftime("%H:%M:%S")

    fileTESTtemp = os.path.expanduser(dataDir) + str(csvTESTtemp)
    with open(fileTESTtemp, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([time, value, unit, name])

###########################################################################
# PLOTTING BLOCK
###########################################################################
def plot_data():
    # Use every .csv in dataDir
    filelist = [] # all filenames are stored in here
    for file in os.listdir(os.path.expanduser(dataDir)):
        if file.endswith(".csv"):
            filelist.append(file)

    colors = mpl.colormaps.get_cmap("Set1").colors

    # Create a figure with a subplot for every sensor, squeeze: always tuples
    fig, axs = plt.subplots(len(filelist), squeeze = False, sharex = True)
    fig.set_figheight(len(filelist) * 3) # set overall height
    fig.set_figwidth(10)
    axs = axs.flatten()

    for num in range(len(filelist)):
        path = os.path.expanduser(dataDir) + filelist[num]
        # Read data
        data = pd.read_csv(path, delimiter = ',', header = None,
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
        # Else, the points in between are not plotted, since it is the same
        # timestamp
        axs[num].xaxis.set_major_formatter(DateFormatter("%H:%M:%S"))

    fig.supxlabel("Zeit")
    plt.xticks(rotation = 45)
    plt.tight_layout()
    plotpath = os.path.expanduser(dataDir) + "plot.png"
    plt.savefig(plotpath, dpi = 300)
    plt.close()

###############################################################################
for count in range(200):
    measurement_aht20()
    measurement_TEST("TEST1")
    measurement_TEST("TEST2")
    measurement_TEST("TEST3")
    measurement_TEST("TEST4")
    plot_data()
    time.sleep(1) # Minimum time distance, how is this done? TODO!
    #time.sleep(2)
