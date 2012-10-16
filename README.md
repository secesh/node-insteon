Node.JS Insteon Communication Driver
====================================


Install
-------
This is a developmental branch; it is not published to npm.  You must checkout the correct branch using git.

	npm install serialport
	git clone git://github.com/secesh/node-insteon.git node_modules/insteon -b websocket

How to Use
----------
See examples/websocket

Experimental
------------
This is not production ready; in particular there are many known issues or portions of the insteon protocol that are not implemented fully or possibly correctly. Any help is appreciated ;)
	
Connection Tips
---------------
This has been tested with the following environments and devices:

* Devices
  * PowerLinc Serial Dual Band Modem ([#2413S](http://www.smarthome.com/2413S/PowerLinc-Modem-INSTEON-Serial-Interface-Dual-Band/p.aspx))
  * PowerLinc Portable USB (wireless only) ([#2448A7](http://www.smarthome.com/2448A7/INSTEON-Portable-USB-Adapter/p.aspx))
  * PowerLinc USB Modem (not wireless) ([#2412U](http://www.smarthome.com/2412U/PowerLinc-INSTEON-Modem-USB/p.aspx))
  * PowerLinc USB Dual Band Modem ([#2413U](http://www.smarthome.com/2413U/PowerLinc-Modem-INSTEON-USB-Interface-Dual-Band/p.aspx))


* Linux
  * #2413S: Recent verisions of Ubuntu and Fedora have been tested; this device is available via standard COM ports (ie `/dev/ttyS0`) or USB serial port adapters (ie `/dev/ttyUSB0`)
  * #2448A7: not tested
  * #2412U: not tested
  * #2413U: not tested
* Ubuntu running from VMWare Player on a Windows 7 host
  * #2413S: As long as windows recognizes the COM port, this should work using standard COM ports (ie `/dev/ttyS0`)
  * #2448A7: not tested
  * #2412U: First install [the drivers](http://www.ftdichip.com/Drivers/VCP.htm) in the Windows host.  Then the device is available on a port such as `/dev/USBS0`
  * #2413U: not tested
* OSX (MacBook Air)
  * #2413S: not tested
  * #2448A7: First install [the drivers](http://www.ftdichip.com/Drivers/VCP.htm) according to [the install guide](http://www.ftdichip.com/Support/Documents/AppNotes/AN_134_FTDI_Drivers_Installation_Guide_for_MAC_OSX.pdf).  Then the device should be available on a port such as `/dev/tty.usbserial-A8006Xpl`

License
-------
Please share your work or contact for commercial use

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">node-insteon</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/gcanivet/node-insteon" property="cc:attributionName" rel="cc:attributionURL">Graeme Canivet</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.
