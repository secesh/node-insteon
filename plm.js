/*****************************************
* This module provides a lightweight
* wrapper for the serialport connection
* to a PLM.
*********************/
var SerialPort = require('serialport')
var utils      = require('./utils.js')
var parser     = require('./parser.js').parser
var sp         = null
var events     = require('events')
var logMeta    = {source: 'plm'}

function PLM(args){
    var self = this
    var port = '/dev/ttyS0' //don't care to try to make a better guess.  If it fails, this.find() will fix it.
    var options = {
        port: port,
        verifyConnection : true, //after the port opens, verify a PLM is connected before allowing communication.
        
        //It is unlikely you'll want to change the following options, but they're here in case they need be.
        baudrate    : 19200,
        databits    : 8,
        stopbits    : 1,
        parity      : 'none',
        flowcontrol : false,
        parser      : parser()
    }
    utils.extend(options, args)
    
    var looking_for_plm = false
    
    //set this to true by default.  It will be reset to false when the serial port is connected IF
    //options.verifyConnection is enabled.  Otherwise we pretend it's verified to emit all messages.
    var plmVerified = true
    var verifyPLMinterval
    function verifyPLM(){
        var count = 0
        var verify = function() {
            self.sendHex('0260') //get IM info
            count++
            if(count > 5){
                if(verifyPLMinterval){
                    clearInterval(verifyPLMinterval)
                    verifyPLMinterval = null
                }
                self.emit("noPLM")
            }
        }
        verifyPLMinterval = setInterval(verify, 1000)
    }
    
    function spOpen(){
        setTimeout(
            function(){
                sp.close(function(e){
                    if(e) utils.winston.warn("FAILED to close serial port: " + e, logMeta)
                })
            }, 5000
        )
        
        if(options.verifyConnection){
            plmVerified = false
            verifyPLM()
        }else{
            self.emit("connected")
        }
    }
    function spEnd(){
        plmVerified = false
        self.emit("disconnected")
    }
    function spClose(){
        plmVerified = false
        utils.winston.info("Serialport is closed", logMeta)
        self.emit("disconnected")
    }
    function spError(e){
        plmVerified = false
        utils.winston.warn("Serialport error: " + e, logMeta)
        self.emit("disconnected")
    }
    function spData(d){
        var message = utils.insteonJS(d)
        if(options.verifyConnection && !plmVerified && message.type == "Get IM Info"){
            plmVerified = true
            if(verifyPLMinterval){
                clearInterval(verifyPLMinterval)
                verifyPLMinterval = null
            }
            self.emit("connected") //don't emit the message; emit a connect notification.
        }else if(plmVerified){
            self.emit("data"  , message)
        }
    }
    
    this.connect = function(port){
        //Commented following.  Don't think it necessary due to reassignment.
        //TODO: confirm reassignment flushes listeners.
        // sp.removeLisener('end'  , spEnd   )
        // sp.removeLisener("open" , spOpen  )
        // sp.removeLisener('close', spClose )
        // sp.removeLisener('error', spError )
        // sp.removeLisener('data' , spData  )

        sp = new SerialPort.SerialPort(port, {
            baudrate    : options.baudrate,
            databits    : options.databits,
            stopbits    : options.stopbits,
            parity      : options.parity,
            flowcontrol : options.flowcontrol,
            parser      : options.parser
        })
        sp.on("open" , spOpen  )
        sp.on('end'  , spEnd   )
        sp.on('close', spClose )
        sp.on('error', spError )
        sp.on('data' , spData  )
    }
    
    this.sendByteArray = function(byteArray, callback){
        sp.write(new Buffer(byteArray), callback)
    }
    this.sendHex = function(hex, callback) {
        sp.write(new Buffer(hex, "hex"), callback)
    }
    
    function found(error, ports){
        //TODO: There's a flagrent logic error, probably.  I only have one port on my system.  I
        //suspect this will run through so fast that it'll only really test the last port.
        //progression through ports needs to be handled on a callback.
        if(error){
            utils.winston.warn("Went looking for PLM, but received error: " + error, logMeta)
        }else{
            utils.winston.debug("The following serial ports are available on your system:", logMeta)
            for(port in ports){
                self.connect(ports[port].comName)
                utils.winston.debug("    Port " + port + ":", logMeta)
                utils.winston.debug("        path: " + ports[port].comName, logMeta)
                utils.winston.debug("        make: " + ports[port].manufacturer, logMeta)
                utils.winston.debug("        id  : " + ports[port].pnpId, logMeta)
            }
            utils.winston.debug("done listing ports", logMeta)
        }
    }
    
    this.find = function(){
        SerialPort.list(found)
    }
    
    self.connect(options.port)
}
PLM.prototype  = new events.EventEmitter
module.exports.PLM = PLM
