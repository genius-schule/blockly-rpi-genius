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
        .appendField("Starte Messungen");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Beende Messungen");
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
		'import board\n'+
		'import adafruit_scd4x\n'+
		'from grove.i2c import Bus\n'+
		'from grove.gpio import GPIO\n'+
		'from grove.adc import ADC\n';
	Blockly.Python.definitions_['code_start_block_genius'] =
		'# Data directory for saving measurements and graphs\n'+
		'dataDir = "~/blockly-web/messungen/"\n'+
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
			.appendField('Sekunde(n)');
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
 * Definition of SENSOR TEST Temperatur block
 * It outputs always random values between 0 and 1.
 */
Blockly.Blocks['sensor_test_temp_genius'] = {
  init: function() {
    this.appendDummyInput()
	  	.appendField("mit Sensor XYZ erfasste")
		.appendField("Temperatur", "sens_info");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(300);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['sensor_test_temp_genius'] = function(block) {
	Blockly.Python.definitions_['functions_sensor_test'] = 
		'def measurement_test():\n'+
		'    value = random.random()\n'+
		'    return value\n';
	var code = 'measurement_test()';
	return [code, Blockly.Python.ORDER_ATOMIC];
};

/*
 * Definition of SENSOR TEST Abstand block
 * It outputs always random values between 0 and 1.
 */
Blockly.Blocks['sensor_test_dist_genius'] = {
  init: function() {
    this.appendDummyInput()
	.appendField("mit Sensor XYZ erfasste")
    	.appendField("Distanz", "sens_info");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(300);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['sensor_test_dist_genius'] = function(block) {
	Blockly.Python.definitions_['functions_sensor_test'] = 
		'def measurement_test():\n'+
		'    value = random.random()\n'+
		'    return value\n';
	var code = 'measurement_test()';
	return [code, Blockly.Python.ORDER_ATOMIC];
};

/*
 * EXPLICIT WRITE Block
 * This block allows explicit writes to a csv file.
 * Careful: this has in parts the same code as the plot and write block.
 * In contrary to the write_plot block it only writes the value to a csv file
 */
Blockly.Blocks['write_explicit_genius'] = {
	init: function() {
		this.appendValueInput("measurement")
			.setCheck("Number")
			.appendField("Speichere in Datei:");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(240);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};

Blockly.Python['write_explicit_genius'] = function(block) {
	// get the value which is put into the block
	var value_measurement = Blockly.Python.valueToCode(block, 'measurement',
							 Blockly.Python.ORDER_ATOMIC);
	// get the content of the "sens_info" filed of the sensor blocks to evaluate
	// it is evaluted by the elif statements to set unit and kind of sensor
	if(this.getInputTargetBlock("measurement") == null) {
		var input_kind = "unknown";
	} else {
		//var input_tooltip = this.getInputTargetBlock("measurement").tooltip;
		var input_kind = this.getInputTargetBlock("measurement").getFieldValue("sens_info");
	}
	Blockly.Python.definitions_['functions_write_explicit'] =
		'def write_to_csv(value, sensor):\n'+
		'    # Check what kind of data is given to the function\n'+
		'    if sensor == "Temperatur":\n'+
		'        kind = "Temperatur"\n'+
		'        unit = "°C"\n'+
		'    elif sensor == "Dinstanz":\n'+
		'        kind = "Abstand"\n'+
		'        unit = "cm"\n'+
		'    elif sensor == "Feuchtigkeit":\n'+
		'        kind = "Feuchtigkeit"\n'+
		'        unit = "% rel."\n'+
		'    elif sensor == "Lichtstärke":\n'+
		'        kind = "Helligkeit"\n'+
		'        unit = "a.u."\n'+
		'    else:\n'+
		'        kind = "Unbekannt"\n'+
		'        unit = "a.u."\n'+
		'    filename = kind + ".csv"\n'+
		'    time = dt.datetime.now().strftime("%H:%M:%S")\n'+
		'    filetemp = os.path.expanduser(dataDir) + str(filename)\n'+
		'    with open(filetemp, "a", newline="") as f:\n'+
		'        writer = csv.writer(f)\n'+
		'        writer.writerow([time, value, unit, kind])\n';
	var code = 
		'write_to_csv(' + value_measurement + ', "' + input_kind + '")\n';
	return code;
};

/*
 * Definition of WRITE and PLOT block
 * This is a combination block for write and plot, since this is the same for
 * the pupils
 * Its speciality is to obatin the sens_info value from the input block 
 * (this HAS to be a sensor block, else it will not work) and plot the data
 * with the correct unit and kind of sensor (see eilf statements in write_to_csv)
 */
Blockly.Blocks['write_plot_genius'] = {
	init: function() {
		this.appendValueInput("measurement")
			.setCheck("Number")
			.appendField("Trage in den Graphen ein:");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(240);
		this.setTooltip("");
		this.setHelpUrl("");
	}
};

Blockly.Python['write_plot_genius'] = function(block) {
	// see documentation of the write explicit block
	var value_measurement = Blockly.Python.valueToCode(block, 'measurement',
							 Blockly.Python.ORDER_ATOMIC);
	if(this.getInputTargetBlock("measurement") == null) {
		var input_kind = "unknown";
	} else {
		//var input_tooltip = this.getInputTargetBlock("measurement").tooltip;
		var input_kind = this.getInputTargetBlock("measurement").getFieldValue("sens_info");
	}
	Blockly.Python.definitions_['functions_plot'] =
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
		'        data["time_diff"] = (data["time"] - data["time"].iloc[0]).dt.total_seconds() / 60\n'+
		'        # Only first value for unit and name are used, since they\n'+
		'        # should stay the same\n'+
		'        axs[num].set_title("Sensor " + str(data["name"][0]))\n'+
		'        axs[num].set_ylabel(data["unit"][0])\n'+
		'        axs[num].set_xlabel("Zeit in Minuten seit Experimentbeginn")\n'+
		'        # Plot value over time\n'+
		'        axs[num].plot(data["time_diff"], data["value"], marker = "x", color = colors[num])\n'+
		'        axs[num].grid()\n'+
		'        # CAREFUL: The measurement rate has to be 1Hz or lower!\n'+
		'        # Else, the points in between are not plotted, since they have the same\n'+
		'        # timestamp\n'+
		'        #axs[num].xaxis.set_major_formatter(DateFormatter("%H:%M:%S"))\n'+
		'    #fig.supxlabel("Zeit") # does not work on old versions of matplotlib\n'+
		'    plt.xticks(rotation = 45)\n'+
		'    plt.tight_layout()\n'+
		'    plotpath = os.path.expanduser(dataDir) + "plot.png"\n'+
		'    plt.savefig(plotpath, dpi = 300)\n'+
		'    plt.close()\n'+
		'def write_to_csv(value, sensor):\n'+
		'    # Check what kind of data is given to the function\n'+
		'    if sensor == "Temperatur":\n'+
		'        kind = "Temperatur"\n'+
		'        unit = "°C"\n'+
		'    elif sensor == "Abstand":\n'+
		'        kind = "Abstand"\n'+
		'        unit = "cm"\n'+
		'    elif sensor == "Feuchtigkeit":\n'+
		'        kind = "Feuchtigkeit"\n'+
		'        unit = "% rel."\n'+
		'    elif sensor == "Helligkeit":\n'+
		'        kind = "Helligkeit"\n'+
		'        unit = "a.u."\n'+
		'    else:\n'+
		'        kind = "Unbekannt"\n'+
		'        unit = "a.u."\n'+
		'    filename = kind + ".csv"\n'+
		'    time = dt.datetime.now().strftime("%H:%M:%S")\n'+
		'    filetemp = os.path.expanduser(dataDir) + str(filename)\n'+
		'    with open(filetemp, "a", newline="") as f:\n'+
		'        writer = csv.writer(f)\n'+
		'        writer.writerow([time, value, unit, kind])\n';
	var code =
		'write_to_csv(' + value_measurement + ', "' + input_kind + '")\n'+
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
        .appendField("mit Sensor AHT20 erfasste")
	.appendField("Temperatur", "sens_info");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(300);
  }
};


Blockly.Python['aht20temp_genius'] = function(block) {
	Blockly.Python.definitions_['functions_aht20temp'] =
		'# copied from the example\n'+
		'class GroveAHT20(object):\n'+
		'    def __init__(self, address=0x38, bus=None):\n'+
		'        #pass\n'+
		'        self.address = address\n'+
		'        # I2C bus\n'+
		'        self.bus = Bus(bus)\n'+
		'        #humi = 10\n'+
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
		'        aht20 = GroveAHT20()\n'+
		'        temp, humi = aht20.read()\n'+
		'        #temp = 1\n'+
		'        return temp\n'+
		'    except:\n'+
		'        print("Hast du den Sensor korrekt angeschlossen? (AHT20 an I2C)")\n'+
		'        print("Es konnten keine Daten aufgenommen werden.")\n';
	var code = 'measurement_aht20()';
	return [code, Blockly.Python.ORDER_ATOMIC];
};

/**
 * sensor definitions for scd40
 * currently only the temperature is used
 * to obtain the co2 or humidity another block is needed
*/ 
Blockly.Blocks['scd40temp_genius'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mit Sensor SCD40 erfasste")
	.appendField("Temperatur", "sens_info");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(300);
  }
};

Blockly.Python['scd40temp_genius'] = function(block) {
	Blockly.Python.definitions_['functions_scd40temp'] =
		'try:\n'+
		'    i2c = board.I2C()  # uses board.SCL and board.SDA\n'+
		'    scd4x = adafruit_scd4x.SCD4X(i2c)\n'+
		'    scd4x.start_periodic_measurement()\n'+
		'except:\n'+
		'    print("Hast du den Sensor korrekt angeschlossen? (SCD40 an I2C)")\n'+
		'    print("Es konnten keine Daten aufgenommen werden.")\n'+
		'def measurement_scd40_temp():\n'+
		'    # returns cached (!) or new value if ready (new value around every 5s)\n'+
		'    # returns None if sensor not ready after startup!\n'+
		'    try:\n'+
		'        temp = scd4x.temperature\n'+
		'        if temp == None:\n'+
		'            return float("nan")\n'+
		'        return temp\n'+
		'    except:\n'+
		'        print("Hast du den Sensor korrekt angeschlossen? (SCD40 an I2C)")\n'+
		'        print("Es konnten keine Daten aufgenommen werden.")\n';
	var code = 'measurement_scd40_temp()';
	return [code, Blockly.Python.ORDER_ATOMIC];
};

