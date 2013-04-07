function getURL(str){
	var re =  /([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.([a-z]{2,6})/gi; 
	return str.match(re);
}

function getIP(str){
	//var re=/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/gi;
	var re=/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/gi;
	return str.match(re);
}

function getEnable(str){
	if(/^#/.test(str)){
		return false;
	}else{
		return true;
	}
}

function hosts2json(_data){
	var data = _data.split("\n");
	var hostsList = [];
	for(var i=0;i<data.length;i++){
		var ipItem = getIP(data[i]);
		if(ipItem && ipItem.length>0){
			var urlItem = getURL(data[i]);
			if(urlItem && urlItem.length>0){ 
				var enable = getEnable(data[i]);
				for(var j=0;j<urlItem.length;j++){ //多个域名配一个IP
					hostsList.push({ip:ipItem[0],host:urlItem[j],enable:enable});
				}
			}
		}
	}
	
	return hostsList;
}

function hasEnableHosts(_data,ip,hosts){
	var data = _data.split("\n");
	for(var i=0;i<data.length;i++){
		var ipItem = getIP(data[i]);
		var enable = getEnable(data[i]);
		if(ipItem && ipItem.length>0 && ipItem[0]==ip && enable){
			var urlItem = getURL(data[i]);
			if(urlItem && urlItem.length>0){
				for(var j=0;j<urlItem.length;j++){
					if(urlItem[j]==hosts){
						return true;
					}
				}
			}
		}
	}
	
	return false;
}

function json2HostsText(list){
	var data = "";
	for(var i=0;i<list.length;i++){
		var line = "";
		line = list[i].ip + "  " + list[i].host+"\n";
		if(list[i].hasOwnProperty("enable") && list[i].enable==false){
			line = "#"+line;
		}
		data+=line;	
	}
	return data;
}

function listHasHost(_list,_ip,_host){
    for(var i=0;i<_list.length;i++){
        if(_list[i].ip==_ip && _list[i].host==_host){
            if(_list[i].hasOwnProperty("enable") && _list[i].enable==false){
                return false;
            }
            return true;
        }
    }
    return false;
}

function isChinese(str){//return chinese char num
    var count = 0;
    var badChar ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    badChar += "abcdefghijklmnopqrstuvwxyz";
    badChar += "0123456789";
    badChar += " "+"　";//半角与全角空格
    badChar += "`~!@#$%^&()-_=+]\\|:;\"\\'<,>?/";//不包含*或.的英文符号
    if(""==str){
        return count;
    }

    for(var i=0;i<str.length;i++){
        var c = str.charAt(i);//字符串str中的字符
        if(badChar.indexOf(c) == -1){
            count++;
        }
    }
    return count;
}

exports.hosts2json = hosts2json;
exports.hasEnableHosts = hasEnableHosts;
exports.json2HostsText = json2HostsText;
exports.isChinese = isChinese;
exports.listHasHost = listHasHost;