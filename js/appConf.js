'use strict';

var fs = require('fs');
var localDataPath = 'appData.json';

function getAppConf(_callback){
	_callback = _callback || function(){};
	fs.readFile(localDataPath,'utf-8', function(err, data) {
		if (err) {
			_callback(err,null);
		} else {
			_callback(null,data);
		}
	});
}

function saveAppConf(_data,_callback){
	_callback = _callback || function(){};
	fs.writeFile(localDataPath,_data,'utf-8',function(err) {
		if (err) {
			_callback(err);
		} else {
			_callback(null);
		}
	});
}

exports.getAppConf = getAppConf;
exports.saveAppConf = saveAppConf;