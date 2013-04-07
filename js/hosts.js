'use strict';

var fs = require('fs');
var util = require('./util.js');
var hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';

function getLocalHosts(_callback){
	_callback = _callback || function(){};
	fs.readFile(hostsPath,'utf-8', function(err, data) {
		if (err) {
			_callback(err,null);
		} else {
			_callback(null,data);
		}
	});
}

function saveLocalHosts(_data,_callback){
	_callback = _callback || function(){};
	fs.writeFile(hostsPath,_data,'utf-8',function(err) {
		if (err) {
			_callback(err);
		} else {
			_callback(null);
		}
	});
}

function addHosts(_ip,_host,_callback){
	_callback = _callback || function(){};
	getLocalHosts(function(err, data){
		if(!err){
			if(!util.hasEnableHosts(data,_ip,_host)){
				var dataStr = _ip+"  "+_host+"\n"+data;

				saveLocalHosts(data,function(err){
					if(!err){
						_callback(null);
					}else{
						_callback(err);
					}
				});
			}
		}else{
			_callback(err);
		}
	});
}

exports.getLocalHosts = getLocalHosts;
exports.saveLocalHosts = saveLocalHosts;
exports.addHosts = addHosts;