/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

/* zur Verwendung aller Blöcke müssen mehrere Librarys auf dem Raspberry Pi vorinstalliert werden.
 * für Sensor scd30: (1) https://pypi.org/project/scd30-i2c/ 
 * für Sensor sgp30: (1) https://pypi.org/project/grove.py/ (2) https://pypi.org/project/seeed-python-sgp30/
 * zur Ausgabe des Live-Graphen: (1) https://pypi.org/project/matplotlib/
 * 
 * Zudem müssen i2c-Devices auf dem Raspberry Pi enabled sein. 
 */


/*
 * Hier folgt die Definition der Blöcke
 * 
 */

Blockly.Blocks['start_Block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Ende");
    this.setColour(135);
  }
};

Blockly.Python['start_Block'] = function(block) {
  Blockly.Python.definitions_['libraries_start_Block'] = 'import matplotlib.pyplot as plt\n'+
  'import time\n'+
  'import os\n'+
  'from datetime import datetime\n';
  Blockly.Python.definitions_['initialisierungen_start_Block'] = 'yAxis_data = []\n'+
  'xAxis_data = []\n'+
  'yAxis_beschriftung = []\n'+
  'xAxis_beschriftung = []\n'+
  'verwendeterSensor = 0\n'+
  'nummerierungSensoren = 0\n'+
  'graphExistiert = False\n';
  Blockly.Python.definitions_['initialisierungen_inDateiSchreiben'] =
  'aktuelleZeit = datetime.now()\n'+
  'pfadSchreibdatei = "~/Desktop/Messungen/Messungen_{}.txt".format(aktuelleZeit.strftime("%d_%m_%y"))\n'+
  'folderExists = os.path.exists(os.path.expanduser("~/Desktop/Messungen"))\n'+
  'if not folderExists:\n'+
  '# Create directory because it does not exist\n'+
  '  os.makedirs(os.path.expanduser("~/Desktop/Messungen"))\n'+
  'f = open(os.path.expanduser(pfadSchreibdatei), "a")\n'+
  'f.write("\\n\\nMessung am {}:".format(aktuelleZeit.strftime("%d/%m/%y %H:%M:%S")))\n'+
  'f.close()';
  Blockly.Python.definitions_['funktion_verwendeGraphen'] =
  'def verwendeGraphen(verwendeterSensor):\n'+
  '  if verwendeterSensor != 0:\n'+ 
  '    global nummerierungSensoren, yAxis_data, xAxis_data\n'+
  '    plt.rcParams["figure.figsize"] = (7, max(4, 4*nummerierungSensoren))\n'+
  '    fig, ax = plt.subplots(nummerierungSensoren, 1, num=1, clear=True, squeeze=False)\n'+
  '    xAxis_data[verwendeterSensor[4]] = verwendeterSensor[1]\n'+
  '    yAxis_data[verwendeterSensor[4]] = verwendeterSensor[2]\n'+
  '    for i in range(nummerierungSensoren):\n'+
  '      messungNummer = len(xAxis_data[i])\n'+
  '      if messungNummer > 4:\n'+
  '        x_ticks = [0, int((messungNummer - 1) / 3 * 1), int((messungNummer - 1) / 3 * 2), messungNummer - 1]\n'+
  '        x_labels = [xAxis_data[i][0], xAxis_data[i][x_ticks[1]], xAxis_data[i][x_ticks[2]], xAxis_data[i][x_ticks[3]]]\n'+
  '        ax[i,0].set_xticks(ticks=x_ticks, labels=x_labels)\n'+
  '      ax[i,0].plot(xAxis_data[i], yAxis_data[i])\n'+
  '      ax[i,0].set_xlabel(xAxis_beschriftung[i])\n'+
  '      ax[i,0].set_ylabel(yAxis_beschriftung[i])\n'+
  '    plt.pause(0.2)\n'+
  '  else:\n'+
  '    print("Anzeigen des Graphens nicht möglich, \\n da Block nicht innerhalb eines Sensormoduls.")\n\n';
  Blockly.Python.definitions_['funktion_schreibeDaten'] =
  'def schreibeDaten(erhalteneDaten, messEinheit, sensorName, timeStamp):\n'+
  '  global pfadSchreibdatei\n'+
  '  f = open(os.path.expanduser(pfadSchreibdatei), "a")\n'+
  '  f.write("\\n{}: {} {} mit Sensor: {}".format(timeStamp, erhalteneDaten, messEinheit, sensorName))\n'+
  '  f.close()\n\n';
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var initialisierung_DatenListen = 'for i in range(nummerierungSensoren):\n'+
  '  yAxis_data.append([])\n'+
  '  xAxis_data.append([])\n\n';
  var zeigeGraphenNachAbschluss = '\nif graphExistiert:\n    plt.show()\n';
  var code = initialisierung_DatenListen + 'for i in range(1):\n' + '  pass\n' +
  statements_blocks + zeigeGraphenNachAbschluss ;
  return code;
};


/*****/


Blockly.Blocks['use_scd30'] = {
  init: function() {
    /*this.appendDummyInput()
        .appendField("Benutze Sensor scd30");*/
	this.appendDummyInput()
        .appendField("Benutze großen");
    this.appendDummyInput()
        .appendField("Kohlenstoffdioxid Sensor");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Ende der Benutzung");
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
  }
};

Blockly.Python['use_scd30'] = function(block) {
  Blockly.Python.definitions_['libraries_use_scd30'] = 'from scd30_i2c import SCD30 \n';
  Blockly.Python.definitions_['setup_use_scd30'] = 'scd30 = SCD30()\n'+
  'scd30.set_measurement_interval(2)\n'+
  'scd30.start_periodic_measurement()\n';
  Blockly.Python.definitions_['initialisierung_use_scd30'] = 'messanzahl = 0\n'+
  'scd30InfoSet = [\'scd30\', [], [], messanzahl, nummerierungSensoren]\n'+
  'xAxis_beschriftung.append("Uhrzeit")\n'+
  'yAxis_beschriftung.append("CO2-Messung mit scd30 [ppm]")\n'+
  'nummerierungSensoren = nummerierungSensoren+1\n';
  Blockly.Python.definitions_['funktion_messung_scd30'] = 'def messung_scd30():\n'+
  '  messungErfolgt = False\n'+
  '  while not messungErfolgt:\n'+
  '    if scd30.get_data_ready():\n'+
  '      m = scd30.read_measurement()\n'+
  '      if m is not None:\n'+
  '        messWertCO2 = int(m[0])\n'+
  '        print(f"scd30: {m[0]:.0f} ppm CO2")\n'+
  '        messungErfolgt = True\n'+
  '        scd30InfoSet[3] = scd30InfoSet[3]+1\n'+
  '        scd30InfoSet[1].append(datetime.now().strftime("%H:%M:%S"))\n'+
  '        scd30InfoSet[2].append(messWertCO2)\n'+
  '        schreibeDaten(messWertCO2, \'ppm\', scd30InfoSet[0], scd30InfoSet[1][-1])\n'+
  '    else:\n'+
  '      time.sleep(0.2)\n'+
  '  return messWertCO2\n\n';
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var code = 'verwendeterSensor = scd30InfoSet\n'+
    'for i in range(1):\n'+ '  pass\n' + statements_blocks +
	'verwendeterSensor = 0\n';
  return code;
};


/*****/


Blockly.Blocks['use_sgp30'] = {
  init: function() {
    /*this.appendDummyInput()
        .appendField("Benutze Sensor sgp30");*/
	this.appendDummyInput()
        .appendField("Benutze kleinen");
    this.appendDummyInput()
        .appendField("Kohlenstoffdioxid Sensor");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Ende der Benutzung");
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
  }
};

Blockly.Python['use_sgp30'] = function(block) {
  Blockly.Python.definitions_['libraries_use_sgp30'] = 'import seeed_sgp30\n'+
  'from grove.i2c import Bus\n';
  Blockly.Python.definitions_['setup_use_sgp30'] = 'sgp30 = seeed_sgp30.grove_sgp30(Bus(1))\n'+
  'sgp30.__init__(Bus(1))\n'+
  'for i in range(10):\n'+
  '  sgp30.read_measurements()\n'+
  '  time.sleep(1)\n';
  Blockly.Python.definitions_['initialisierung_use_sgp30'] = 'messanzahl = 0\n'+
  'sgp30InfoSet = [\'sgp30\', [], [], messanzahl, nummerierungSensoren]\n'+
  'xAxis_beschriftung.append("Uhrzeit")\n'+
  'yAxis_beschriftung.append("CO2-Messung mit sgp30 [ppm]")\n'+
  'nummerierungSensoren = nummerierungSensoren+1\n';
  Blockly.Python.definitions_['funktion_messung_sgp30'] = 'def messung_sgp30():\n'+
  '  data = sgp30.read_measurements()\n'+
  '  messWertCO2, messWertTVOC = data.data\n'+
  '  print("sgp30: {} ppm CO2".format(messWertCO2))\n'+
  '  sgp30InfoSet[3] = sgp30InfoSet[3]+1\n'+
  '  sgp30InfoSet[1].append(datetime.now().strftime("%H:%M:%S"))\n'+
  '  sgp30InfoSet[2].append(messWertCO2)\n'+
  '  schreibeDaten(messWertCO2, \'ppm\', sgp30InfoSet[0], sgp30InfoSet[1][-1])\n'+
  '  return messWertCO2\n\n';
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var code = 'verwendeterSensor = sgp30InfoSet\n'+
    'for i in range(1):\n' + '  pass\n' + statements_blocks +
	'verwendeterSensor = 0\n';
  return code;
};


/*****/


Blockly.Blocks['use_mq135'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Benutze Sensor mq135");
    this.appendDummyInput()
        .appendField("mit Raspberry GPIO ")
        .appendField(new Blockly.FieldNumber(14, 2, 26), "GPIO_Numb");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Ende der Benutzung");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
  }
};

Blockly.Python['use_mq135'] = function(block) {
  var number_gpionumb = block.getFieldValue('GPIO_Numb');
  Blockly.Python.definitions_['libraries_use_mq135'] = 'import matplotlib.pyplot as plt\n' +
  'import RPi.GPIO as GPIO \n \n';
  Blockly.Python.definitions_['setup_use_mq135'] = 'GPIO.setmode(GPIO.BCM)\n' +
  'GPIO.setup('+ number_gpionumb +', GPIO.IN)\n \n';
  Blockly.Python.definitions_['initialisierung_use_mq135'] = 'messanzahl = 0\n'+
  'mq135InfoSet = [\'mq135\', [], [], messanzahl, nummerierungSensoren]\n'+
  'xAxis_beschriftung.append("Uhrzeit")\n'+
  'yAxis_beschriftung.append("CO2-Messung mit mq135")\n'+
  'nummerierungSensoren = nummerierungSensoren+1\n';
  Blockly.Python.definitions_['funktion_messung_mq135'] = 'def messung_mq135():\n' +
  '  messWert = not GPIO.input(' + number_gpionumb +')\n' +
  '  if messWert == True:\n'+
  '    schwellenInfo = "Gas-Schwelle ist überschritten"\n'+
  '  else:\n'+
  '    schwellenInfo = "Gas-Schwelle ist nicht überschritten"\n'+
  '  print("mq135: {}".format(messWert))\n'+
  '  mq135InfoSet[3] = mq135InfoSet[3]+1\n'+
  '  mq135InfoSet[1].append(datetime.now().strftime("%H:%M:%S"))\n'+
  '  mq135InfoSet[2].append(messWert)\n'+
  '  schreibeDaten(messWert, schwellenInfo, mq135InfoSet[0], mq135InfoSet[1][-1])\n'+
  '  return messWert \n \n';
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var code = 'verwendeterSensor = mq135InfoSet\n'+
    'for i in range(1):\n' + '  pass\n' + statements_blocks +
	'verwendeterSensor = 0\n';
  return code;
};


/*****/

Blockly.Blocks['use_lightSensor'] = {
  init: function() {
	this.appendDummyInput()
        .appendField("Benutze Lichtsensor");
    this.appendDummyInput()
        .appendField("mit Analog Input")
        .appendField(new Blockly.FieldDropdown([["A0","0"], ["A2","2"], ["A4","4"], ["A6","6"]]), "AnalogPinNumber");
    this.appendStatementInput("blocks")
        .setCheck(null);
	this.appendDummyInput()
        .appendField("Ende der Benutzung");
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
  }
};

Blockly.Python['use_lightSensor'] = function(block) {
  var dropdown_name = block.getFieldValue('AnalogPinNumber');
  
  Blockly.Python.definitions_['libraries_use_lightSensor'] = 'from grove.adc import ADC\n';
  
  Blockly.Python.definitions_['setup_use_lightSensor'] = 'lightSensor = ADC()\n' +
  'channel = '+ dropdown_name + '\n'+
  'maxValueLightSensor = 2300\n';
  
  Blockly.Python.definitions_['initialisierung_use_lightSensor'] = 'messanzahl = 0\n'+
  'lightSensorInfoSet = [\'lightSensor\', [], [], messanzahl, nummerierungSensoren]\n'+
  'xAxis_beschriftung.append("Uhrzeit")\n'+
  'yAxis_beschriftung.append("Licht-Messung in % des Sensormaximums")\n'+
  'nummerierungSensoren = nummerierungSensoren+1\n';
  
  Blockly.Python.definitions_['funktion_messung_lightSensor'] = 'def messung_lightSensor():\n' +
  '  global maxValueLightSensor\n'+
  '  messWertV = lightSensor.read_voltage(channel)\n'+
  '  if(messWertV > maxValueLightSensor):\n'+
  '    maxValueLightSensor = messWertV\n'+
  '  messWertProz = messWertV/maxValueLightSensor*100\n'+
  '  messWertProz = round(messWertProz,1)\n'+
  '  print("Lichtsensor: {} % des Sensormaximums".format(messWertProz))\n'+
  '  lightSensorInfoSet[3] = lightSensorInfoSet[3]+1\n'+
  '  lightSensorInfoSet[1].append(datetime.now().strftime("%H:%M:%S"))\n'+
  '  lightSensorInfoSet[2].append(messWertProz)\n'+
  '  schreibeDaten(messWertProz, \'%\', lightSensorInfoSet[0], lightSensorInfoSet[1][-1])\n'+
  '  return messWertProz \n \n';
  
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var code = 'verwendeterSensor = lightSensorInfoSet\n'+
    'for i in range(1):\n' + '  pass\n' + statements_blocks +
	'verwendeterSensor = 0\n';
  return code;
};

/*****/


Blockly.Blocks['measure_in_varseconds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("messe in");
    this.appendValueInput("seconds")
        .setCheck("Number");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Sekunden");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  }
};

Blockly.Python['measure_in_varseconds'] = function(block) {
  var value_seconds = Blockly.Python.valueToCode(block, 'seconds', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'if verwendeterSensor == 0:\n'+
  '  print("Messung nicht möglich,\\n da Block nicht innerhalb eines Sensormoduls.")\n'+
  'else:\n'+
  '  time.sleep('+ value_seconds +')\n'+
  '  funktionsname = \'messung_\' + verwendeterSensor[0]\n'+
  '  gemessenerWert = eval(funktionsname + \'()\')\n\n';
  return code;
};


/*****/


Blockly.Blocks['show_graph'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("zeige Messung in Graphen an");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  }
};

Blockly.Python['show_graph'] = function(block) {
  // TODO: Assemble Python into code variable.
  var code = 'graphExistiert = True\n'+
    'verwendeGraphen(verwendeterSensor)\n\n';
  return code;
};


/*****/

Blockly.Blocks['iteration'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wiederhole");
    this.appendValueInput("quantity")
        .setCheck("Number");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("mal");
    this.appendStatementInput("statements")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
  }
};

Blockly.Python['iteration'] = function(block) {
  var value_quantity = Blockly.Python.valueToCode(block, 'quantity', Blockly.Python.ORDER_ATOMIC);
  var statements_statements = Blockly.Python.statementToCode(block, 'statements');
  // TODO: Assemble Python into code variable.
  var code = 'anzahlDurchlaeufe = ' + value_quantity +
  '\nfor i in range(anzahlDurchlaeufe):\n' + '  pass\n' + statements_statements;
  return code;
};
