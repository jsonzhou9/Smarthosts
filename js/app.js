'use strict';

var http = require('http');
var loader = require('./loader.js');
var hosts = require('./hosts.js');
var appConf = require('./appConf.js');
var netConf = require('./netConf.js');
var util = require('./util.js');
var storage = require('./storage.js');
var dialog = require('./dialog.js');

var localAppData = {hosts:[]}; //local
var hostsNetData = {hosts:[]}; //network
var menuList = [];

function renderMainList(_hostsList,_group,_type){
	$(".main_bar h3").html(_group);
	if(_type==0){
		$(".main_btn").css({display:"block"});
	}else{
		$(".main_btn").css({display:"none"});
	}

	var mainList = new EJS({url: 'templates/main_list.ejs'});
	var html = mainList.render({hostsList:_hostsList});
	$(".main_list").html(html);
	$('.main_list').tinyscrollbar();
}

function renderMenuList(_menuList,_menuPos){
	var menuListTemp = new EJS({url: 'templates/menu_list.ejs'});
	var html = menuListTemp.render({menuList:_menuList,menuPos:_menuPos});
	$("#menu_list").html(html);
	$('#menu_list').tinyscrollbar();
}

function startRender(){
	loader.hide();
	menuList = [];

	for(var i=0;i<localAppData.hosts.length;i++){
		var group = localAppData.hosts[i].group;
		menuList.push({group:group,index:i,type:0});
	}
	for(var i=0;i<hostsNetData.hosts.length;i++){
		var group = hostsNetData.hosts[i].group;
		menuList.push({group:group,index:i,type:1});
	}

	var menuPos = storage.getMenuPos();
	if(menuList.length>0){
		menuPos = menuPos>menuList.length-1?0:menuPos;
		changeMainList(menuPos);
	}else{
		showMainErr("无任何HOSTS配置信息！");
        $(".main_bar h3").html("");
        $(".main_btn").css({display:"none"});
	}

	renderMenuList(menuList,menuPos);
}

function showMainErr(err){
	var errStr = JSON.stringify(err);
	$(".main_list").html(err);
}

function addDefault(_list,_type){
    _type = _type || 0;
	var storageData = storage.getStorage();
	var ip = storageData.ip;
	var domain = storageData.domain;
    if(ip && domain){
        var hasHost = util.listHasHost(_list,ip,domain);
        if(!hasHost){ //不存在添加
            var host = {ip:ip,host:domain}
            if(_type==0){
                host['enable'] = true;
            }
            _list.unshift(host); //添加到第一行
        }
    }
}

function addDefaultHosts(_menuPos,_callback){
    var index = menuList[_menuPos].index;
    var list = localAppData.hosts[index].list;
    addDefault(localAppData.hosts[index].list,0);
    appConf.saveAppConf(JSON.stringify(localAppData));
    var hostsText = util.json2HostsText(list);
    changeHosts(hostsText,_menuPos,function(err){
        _callback(err);
    });
}

function getLocalHosts(){
	hosts.getLocalHosts(function(err,data){
		if(!err){
			var hostsList = util.hosts2json(data);
			localAppData.hosts.push({group:"本地自定义环境一",list:hostsList});
            addDefault(localAppData.hosts[0].list,0);
			appConf.saveAppConf(JSON.stringify(localAppData));
            var hostsText = util.json2HostsText(localAppData.hosts[0].list);
            changeHosts(hostsText,0,function(err){
                getNetworkData();
            });
		}
	});	
}

function getNetworkData(){ //get network conf file;
	netConf.getNetworkData(function(err,data){
		if(!err && data){
			hostsNetData = JSON.parse(data);
		}
        for(var i=0;i<hostsNetData.hosts.length;i++){ //添加默认hosts
            addDefault(hostsNetData.hosts[i].list,1);
        }
		startRender();
	});
}

function getUserHosts(_menuPos){  //for ui
    var index = menuList[_menuPos].index;
    var list = localAppData.hosts[index].list;
    var group = localAppData.hosts[index].group;
    return {group:group,list:util.json2HostsText(list)};
}

function addUserHosts(_group,_list,_menuPos){//for ui
    var index;
    if(typeof _menuPos != 'undefined'){
        index = menuList[_menuPos].index;
    }

    //判断字符是否为空
    if(!_group){
        loader.showMsg("分组名称必须填写！",2000);
        return false;
    }
    //判断字符长度
    var chineseNum = util.isChinese(_group);
    var len = _group.length+chineseNum;
    if(len>16){
        loader.showMsg("分组名字符过长！",2000);
        return false;
    }

    var hostsList = util.hosts2json(_list);
    if(typeof index == "undefined"){
        localAppData.hosts.push({group:_group,list:hostsList});
        index = localAppData.hosts.length-1;
        if(index<0)index = 0;
    }else{
        localAppData.hosts[index] = {group:_group,list:hostsList};
    }
    addDefault(localAppData.hosts[index].list,0);

    appConf.saveAppConf(JSON.stringify(localAppData),function(){
        init({onlylocal:true});
        loader.showMsg("保存成功！",2000);
        dialog.hide();
    });
}

function changeLocalHostsMode(_menuPos,_listPos,_enable){ //for ui
	var index = menuList[_menuPos].index;
	var list = localAppData.hosts[index].list;
	list[_listPos].temp = _enable;
}

function saveUserHosts(_menuPos){ //for ui
	var index = menuList[_menuPos].index;
	var list = localAppData.hosts[index].list;
	for(var i=0;i<list.length;i++){
		if(list[i].hasOwnProperty("temp")){
			list[i].enable = list[i].temp;
            delete list[i].temp;
		}
	}
	appConf.saveAppConf(JSON.stringify(localAppData));

	var hostsText = util.json2HostsText(list);
	changeHosts(hostsText,_menuPos);
    loader.showMsg("保存成功！",2000);
}

function delUserHosts(_menuPos){ //for ui
    var index = menuList[_menuPos].index;
    localAppData.hosts.splice(index,1);
    appConf.saveAppConf(JSON.stringify(localAppData));
    storage.saveMenuPos(0);
    init({onlylocal:true});
    loader.showMsg("删除成功！",2000);
}

function changeHosts(_data,_pos,_callbak){ //save hosts text
    var callback = _callbak || function(){};
	hosts.saveLocalHosts(_data,function(err){
		if(!err){
			storage.saveMenuPos(_pos);
		}
        callback(err);
	});
}

function changeMainList(_pos){ //for ui
	var index = menuList[_pos].index;
	var type = menuList[_pos].type;
	var list = [];

    //ui change
    $('#menu_list a').each(function(i){
        $(this).removeClass("curr");
    });
    $('#menu_list a').eq(_pos).addClass("curr");

	if(type==0){
		renderMainList(localAppData.hosts[index].list,localAppData.hosts[index].group,0);
		list = localAppData.hosts[index].list;
	}else{
		renderMainList(hostsNetData.hosts[index].list,hostsNetData.hosts[index].group,1);
		list = hostsNetData.hosts[index].list;
	}

	var data = util.json2HostsText(list);

	changeHosts(data,_pos);
}

function init(_opt){
    var opt = _opt || {onlylocal:false};
	localAppData = {hosts:[]};

	storage.initStorage();

	appConf.getAppConf(function(err,data){
		if(err){
			getLocalHosts();
		}else{
			localAppData = JSON.parse(data);
			if(!localAppData.hosts){
				localAppData.hosts = [];
				getLocalHosts();
			}else{
                if(!opt.onlylocal){
                    hostsNetData = {hosts:[]};
				    getNetworkData();
                }else{
                    startRender();
                }
			}
		}
	});
};

exports.init = init;
exports.changeMainList = changeMainList;
exports.changeLocalHostsMode = changeLocalHostsMode;
exports.saveUserHosts = saveUserHosts;
exports.delUserHosts = delUserHosts;
exports.addUserHosts = addUserHosts;
exports.getUserHosts = getUserHosts;
exports.addDefaultHosts = addDefaultHosts;