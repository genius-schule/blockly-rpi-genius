/**
 * important documentation here
 */
'use strict';

/**
 * sensor definitions for aht20
 * currently only the temperature is used
 * to obtain the humidity, another block is needed
 * this form is code is absolutely stupid, but there are no other options :/
 */
Blockly.Blocks['use_aht20'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("Benutze Sensor");
		this.appendDummyInput()
			.appendField("AHT20 (Temperatur)");
		this.appendStatementInput("blocks")
			.setCheck(null);
		this.appendDummyInput()
			.appendField("Ende der Benutzung");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(105);
	}
};

Blockly.Python['use_aht20'] = function(block) {
	Blockly.Python.definitions_['libs_aht20'] = {
		'import time \n'+
		'from grove.i2c import Bus \n';
	}
	Blockly.Python.defintions_['class_aht20'] = {
		/* copied from the example */
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
	}
	Blockly.Python.definitions_['init_aht20'] = {
		/* this is a dummy which needs to be changed */
		'aht20InfoSet = ["aht20", [], [], 0, 0]\n';
	}
	Blockly.Python.definitions_['meas_aht20'] = {
		'temperature, humidity  = sensor.read()\n'+
		'print("Temperature in Celsius is {:.2f} C".format(temperature))\n'+
		'print("Relative Humidity is {:.2f} %".format(humidity))\n';
	}
	var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
	var code = {
		'verwendeterSensor = aht20InfoSet\n'+
		'for i in range(1):\n'+
		'	pass\n'+
		'verwendeterSensor = 0\n';
	}
	return code;
};

