'use strict';

var http = require('http');
var hosts = require('./hosts.js');
var storage = require('./storage.js');

function getNetworkData(_callback){
	_callback = _callback || function(){};

	var storageData = storage.getStorage();
	var domain = storageData.domain;
	var path = storageData.path;

	if(domain && path){
		var req = http.get({host: domain,path:path}, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (data) {
				_callback(null,data);
			});
		}).on('error', function(e) {
			_callback(e,null);
		});

        req.setTimeout(3000,function(){ //超时三秒终止请求
            req.abort();
        });
	}else{
        _callback({},null);
    }
}

exports.getNetworkData = getNetworkData;