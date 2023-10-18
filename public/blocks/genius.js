/**
 * important documentation here
 */
'use strict';

/*
 * To use these blocks, read the README!!!
 * A lot of libraries have to be installed and i2c has to be enabled on the pi
 */

/*
 * Definition of START block
 * Since the start block is a brace, the "for start_i in range(1) is needed
 * Else, the identation does not work.
 * This does not make sense in the first place, since the start block only places
 * a few definitions and a folder, but in context of the whole blockly system
 * this is needed.
 */
Blockly.Blocks['start_block_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Starte Experiment und initalisiere Graph");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Beende Experiment");
    this.setColour(220);
  }
};

Blockly.Python['start_block_genius'] = function(block) {
 	Blockly.Python.definitions_['libraries_start_block_genius'] = 
		'import matplotlib as mpl\n'+
		'import matplotlib.pyplot as plt\n'+
		'from matplotlib.dates import DateFormatter\n'+
		'import pandas as pd\n'+
		'import datetime as dt\n'+
		'import time\n'+
		'import os\n'+
		'import csv\n'+
		'import random\n'+
		'#from grove.i2c import Bus\n';
	Blockly.Python.definitions_['code_start_block_genius'] =
		'# Data directory for saving measurements and graphs\n'+
		'dataDir = "~/Desktop/Messungen/"\n'+
		'# Check if folder exists, else create directory\n'+
		'if not os.path.exists(os.path.expanduser(dataDir)):\n'+
		'    os.makedirs(os.path.expanduser(dataDir))\n'+
		'# Delete contents of directory\n'+
		'for filename in os.listdir(os.path.expanduser(dataDir)):\n'+
		'    # construct full file path\n'+
		'    file = str(os.path.expanduser(dataDir)) + filename\n'+
		'    if os.path.isfile(file):\n'+
		'        os.remove(file)\n';
	var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
	var code = 'for start_i in range(1):\n' + '  pass\n' + statements_blocks;
	return code;
};

/*
 * Definition of TIME block (stolen from the gc2 project)
 */
Blockly.Blocks['sleep_s_genius'] = {
	init: function() {
		this.setColour(140);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.appendValueInput('sekunden')
			.setCheck('Number')
			.appendField('warte');
		this.appendDummyInput()
			.appendField('Sekunden');
		this.setTooltip('Warte eine gewisse Zeit in Sekunden.');
	}
};

Blockly.Python['sleep_s_genius'] = function(block) {
	var delayTime = Blockly.Python.valueToCode(block, 'sekunden', Blockly.Python.ORDER_ATOMIC) || '0';
	Blockly.Python.definitions_['import_sleep'] = 'from time import sleep';
	var code = 'sleep(' + delayTime + ')\n';
	return code;
};


/*
 * Definition of some blocks which do nothing but are there to display the programming idea
 */
Blockly.Blocks['stub_messen_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Lies den aktuellen Wert am Sensor ab.");
    this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['stub_notieren_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Notiere den Wert im Graphen.");
    this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['stub_auswerten_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Werte den Graphen aus.");
    this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
    this.setColour(300);
  }
};


/*
 * Definition of SENSOR TEST block
 */
Blockly.Blocks['sensor_test_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sensor Test - GeNIUS");
    this.appendValueInput("name")
    	.setCheck("String")
	.appendField("Name");
    this.appendValueInput("unit")
    	.setCheck("String")
	.appendField("Einheit");
    this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
    this.setColour(135);
  }
};

Blockly.Python['sensor_test_genius'] = function(block) {
	var val_name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC);
	var val_unit = Blockly.Python.valueToCode(block, 'unit', Blockly.Python.ORDER_ATOMIC);
	var code = 	
		'def measurement_TEST(name, unit):\n'+
		'    csvTESTtemp = name + "values.csv"\n'+
		'    value = random.random()\n'+
		'    time = dt.datetime.now().strftime("%H:%M:%S")\n'+
		'    fileTESTtemp = os.path.expanduser(dataDir) + str(csvTESTtemp)\n'+
		'    with open(fileTESTtemp, "a", newline="") as f:\n'+
		'        writer = csv.writer(f)\n'+
		'        writer.writerow([time, value, unit, name])\n'+
		'measurement_TEST(' + val_name + ', ' + val_unit + ') # only needed in finished block\n';
	return code;
};

/*
 * Definition of PLOT block
 */
Blockly.Blocks['plot_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Trage Wert(e) in den Graphen ein");
    this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
    this.setColour(0);
  }
};

Blockly.Python['plot_genius'] = function(block) {
	var code = 	
		'def plot_data():\n'+
		'    # Use every .csv in dataDir\n'+
		'    filelist = [] # all filenames are stored in here\n'+
		'    for file in os.listdir(os.path.expanduser(dataDir)):\n'+
		'        if file.endswith(".csv"):\n'+
		'            filelist.append(file)\n'+
		'    # Check if filelist is empty, if empty return without plot\n'+
		'    if not filelist:\n'+
		'        print("Es gibt keine Daten zum Auswerten!")\n'+
		'        print("Mindestens ein Sensor muss verwendet werden und angeschlossen sein.")\n'+
		'        return 1\n'+
		'    # List of colors, since the below command does not work on old versions\n'+
		'    # Hopefully they are enough.\n'+
		'    #colors = mpl.colormaps.get_cmap("Set1").colors\n'+
		'    colors = ["red", "green", "blue", "black", "orange", "gray", "yellow",\n'+
		'              "teal", "cyan", "pink", "lime", "navy", "orchid", "tan"]\n'+
		'    # Create a figure with a subplot for every sensor, squeeze: always tuples\n'+
		'    fig, axs = plt.subplots(len(filelist), squeeze = False, sharex = True)\n'+
		'    fig.set_figheight(len(filelist) * 3) # set overall height\n'+
		'    fig.set_figwidth(10)\n'+
		'    axs = axs.flatten()\n'+
		'    for num in range(len(filelist)):\n'+
		'        path = os.path.expanduser(dataDir) + filelist[num]\n'+
		'        # Read data\n'+
		'        data = pd.read_csv(path, delimiter = ",", header = None,\n'+
		'                               names = ["time", "value", "unit", "name"])\n'+
		'        data["time"] = pd.to_datetime(data["time"], format = "%H:%M:%S")\n'+
		'        # Only first value for unit and name are used, since they\n'+
		'        # should stay the same\n'+
		'        axs[num].set_title("Sensor " + str(data["name"][0]))\n'+
		'        axs[num].set_ylabel(data["unit"][0])\n'+
		'        # Plot value over time\n'+
		'        axs[num].plot(data["time"], data["value"], marker = "x", color = colors[num])\n'+
		'        axs[num].grid()\n'+
		'        # CAREFUL: The measurement rate has to be 1Hz or lower!\n'+
		'        # Else, the points in between are not plotted, since they have the same\n'+
		'        # timestamp\n'+
		'        axs[num].xaxis.set_major_formatter(DateFormatter("%H:%M:%S"))\n'+
		'    #fig.supxlabel("Zeit") # does not work on old versions of matplotlib\n'+
		'    plt.xticks(rotation = 45)\n'+
		'    plt.tight_layout()\n'+
		'    plotpath = os.path.expanduser(dataDir) + "plot.png"\n'+
		'    plt.savefig(plotpath, dpi = 300)\n'+
		'    plt.close()\n'+
		'plot_data()\n';
	return code;
};

/**
 * sensor definitions for aht20
 * currently only the temperature is used
 * to obtain the humidity, another block is needed
 */
Blockly.Blocks['aht20temp_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Speichere Wert des Sensors AHT20");
    this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
    this.setColour(135);
  }
};

Blockly.Python['aht20temp_genius'] = function(block) {
	var code =
		'# copied from the example\n'+
		'class GroveAHT20(object):\n'+
		'    def __init__(self, address=0x38, bus=None):\n'+
		'        #pass\n'+
		'        self.address = address\n'+
		'        # I2C bus\n'+
		'        self.bus = Bus(bus)\n'+
		'    def read(self):\n'+
		'        self.bus.write_i2c_block_data(self.address, 0x00, [0xac, 0x33, 0x00])\n'+
		'        # measurement duration < 16 ms\n'+
		'        time.sleep(0.016)\n'+
		'        data = self.bus.read_i2c_block_data(self.address, 0x00, 6)\n'+
		'        humidity = data[1]\n'+
		'        humidity <<= 8\n'+
		'        humidity += data[2]\n'+
		'        humidity <<= 4\n'+
		'        humidity += (data[3] >> 4)\n'+
		'        humidity /= 1048576.0\n'+
		'        humidity *= 100\n'+
		'        temperature = data[3] & 0x0f\n'+
		'        temperature <<= 8\n'+
		'        temperature += data[4]\n'+
		'        temperature <<= 8\n'+
		'        temperature += data[5]\n'+
		'        temperature = temperature / 1048576.0*200.0-50.0  # Convert to Celsius\n'+
		'        return temperature, humidity\n'+
		'def measurement_aht20():\n'+
		'    csvaht20temp = "aht20temp.csv"\n'+
		'    csvaht20humi = "aht20humi.csv" # Not implemented yet\n'+
		'    try:\n'+
		'        # For debugging without the seeed library comment the following two lines and uncomment below\n'+
		'        #aht20 = GroveAHT20()\n'+
		'        #temp, humi = aht20.read()\n'+
		'        temp = 1\n'+
		'        #humi = 10\n'+
		'        time = dt.datetime.now().strftime("%H:%M:%S")\n'+
		'        fileaht20temp = os.path.expanduser(dataDir) + str(csvaht20temp)\n'+
		'        with open(fileaht20temp, "a", newline="") as f:\n'+
		'            writer = csv.writer(f)\n'+
		'            writer.writerow([time, temp, "°C", "AHT20"])\n'+
		'    except:\n'+
		'        print("Hast du den Sensor korrekt angeschlossen?")\n'+
		'        print("Es konnten keine Daten aufgenommen werden.")\n'+
		'measurement_aht20() # only needed in finished block\n';
	return code;
};























































































/**
 * sensor definitions for aht20
 * currently only the temperature is used
 * to obtain the humidity, another block is needed
 * this form is code is absolutely stupid, but there are no other options :/
 */
Blockly.Blocks['use_old_aht20'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("Benutze Sensor");
		this.appendDummyInput()
			.appendField("OLD AHT20 (Temperatur)");
		this.appendStatementInput("blocks")
			.setCheck(null);
		this.appendDummyInput()
			.appendField("Ende der Benutzung");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(105);
	}
};

Blockly.Python['use_old_aht20'] = function(block) {
	Blockly.Python.definitions_['libs_aht20'] = 'import time \n'+
		'from grove.i2c import Bus \n';
	Blockly.Python.definitions_['class_aht20'] ='# copied from the example\n'+
		'class GroveTemperatureHumidityAHT20(object):\n'+
    		'	def __init__(self, address=0x38, bus=None):\n'+
        	'		self.address = address\n'+
        	'		# I2C bus\n'+
        	'		self.bus = Bus(bus)\n'+
    		'	def read(self):\n'+
        	'		self.bus.write_i2c_block_data(self.address, 0x00, [0xac, 0x33, 0x00])\n'+
        	'		# measurement duration < 16 ms\n'+
        	'		time.sleep(0.016)\n'+
        	'		data = self.bus.read_i2c_block_data(self.address, 0x00, 6)\n'+
        	'		humidity = data[1]\n'+
        	'		humidity <<= 8\n'+
        	'		humidity += data[2]\n'+
        	'		humidity <<= 4\n'+
        	'		humidity += (data[3] >> 4)\n'+
        	'		humidity /= 1048576.0\n'+
        	'		humidity *= 100\n'+
        	'		temperature = data[3] & 0x0f\n'+
        	'		temperature <<= 8\n'+
        	'		temperature += data[4]\n'+
        	'		temperature <<= 8\n'+
        	'		temperature += data[5]\n'+
        	'		temperature = temperature / 1048576.0*200.0-50.0  # Convert to Celsius\n'+
        	'		return temperature, humidity\n';
	Blockly.Python.definitions_['init_aht20'] = 'aht20InfoSet = ["aht20", [], [], 0, 0]\n';
		//above is a dummy which needs to be changed
	Blockly.Python.definitions_['meas_aht20'] = 'sensaht20 = GroveTemperatureHumidityAHT20()\n'+
		'temperature, humidity  = sensaht20.read()\n'+
		'print("Temperature in Celsius is {:.2f} C".format(temperature))\n'+
		'print("Relative Humidity is {:.2f} %".format(humidity))\n';
	var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
	var code = 'verwendeterSensor = aht20InfoSet\n'+
		'for i in range(1):\n'+
		'	pass\n'+
		statements_blocks+
		'verwendeterSensor = 0\n';
	return code;
};

