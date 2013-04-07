'use strict';

var appConf = require('./appConf.js');

function saveMenuPos(_pos){
	localStorage.setItem("menuPos",_pos);
}

function getMenuPos(){
	var menuPos = localStorage.getItem("menuPos");
	if(menuPos)return menuPos;
	else return 0;
}

function saveStorage(_hosts_ip,_hosts_domain,_hosts_path){
	localStorage.setItem("hosts_ip",_hosts_ip);
    localStorage.setItem("hosts_domain",_hosts_domain);
	localStorage.setItem("hosts_path",_hosts_path);
	localStorage.setItem("isset",1);
}

function getStorage(){
	var _hosts_ip = localStorage.getItem("hosts_ip");
	var _hosts_domain = localStorage.getItem("hosts_domain");
	var _hosts_path = localStorage.getItem("hosts_path");

	return {
		ip:_hosts_ip,
		domain:_hosts_domain,
		path:_hosts_path
	}
}

function initStorage(){
	appConf.getAppConf(function(err,data){
		if(!err){
			var localAppData = JSON.parse(data);
			var _isset = localStorage.getItem("isset");
			if(_isset==0){
                var ip = localAppData.conf_file_ip || "";
                var domain = localAppData.conf_file_domain || "";
                var path = localAppData.conf_file_path || "";
				saveStorage(ip,domain,path);
			}
		}
	});
}

function clearStorage(){
	localStorage.clear();
}

exports.initStorage = initStorage;
exports.getStorage = getStorage;
exports.saveStorage = saveStorage;
exports.clearStorage = clearStorage;

exports.saveMenuPos = saveMenuPos;
exports.getMenuPos = getMenuPos;