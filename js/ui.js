'use strict'; 

var dialog = require('./js/dialog.js');
var storage = require('./js/storage.js');
var app = require('./js/app.js');
var loader = require('./js/loader.js');

$(function(){
	//left toobar
	$("#menu_add").click(function(){ //添加
        var addhosts = new EJS({url: 'templates/addhosts.ejs'});
        var data = {group:"",list:""};
        var html = addhosts.render(data);

        dialog.show({onOk:function(){
            var group = $(".table_form input[name=group]").val();
            var list = $(".table_form textarea[name=list]").val();
            app.addUserHosts(group,list);
        },content:html,toolbar:true,title:"添加自定义hosts分组",top:"40px"});

        return false;
	});
	$("#menu_set").click(function(){ //设置
		var setting = new EJS({url: 'templates/setting.ejs'});
		var conf = storage.getStorage();
		var data = {ip:"",domain:"",path:""};
		if(conf.ip){
			data.ip = conf.ip;
		}
		if(conf.domain){
			data.domain = conf.domain;
		}
		if(conf.path){
			data.path = conf.path;
		}

		var html = setting.render(data);

		dialog.show({onOk:function(){
			var domain = $(".table_form input[name=domain]").val();
			var ip = $(".table_form input[name=ip]").val();
			var path = $(".table_form input[name=path]").val();
            var currMenuPos = $('#menu_list a.curr').index('#menu_list a');
            storage.saveStorage(ip,domain,path);
            if(currMenuPos>=0 && domain && ip){ //添加默认hosts
                app.addDefaultHosts(currMenuPos,function(err){
                    loader.show();
                    app.init();
                    dialog.hide();
                });
            }else{
                loader.show();
                app.init();
                dialog.hide();
            }
		},content:html,toolbar:true,title:"网络hosts配置文件设置"});

		return false;
	});
	$("#menu_help").click(function(){ //帮助
        var help = new EJS({url: 'templates/help.ejs'});
        var html = help.render();

        dialog.show({content:html,toolbar:false,title:"帮助",top:"140px"});

        return false;
	});

	//left menu list
	$('#menu_list').on('click','a',function(event) {
		var cls = this.className;
		if(cls=="curr")return false;

		var pos = $(this).index('#menu_list a');
		app.changeMainList(pos);

		return false;
	});

	//right main list
	$(".main_list").on("mouseover","tbody tr",function(event){
		$(this).find('td').css({backgroundColor: "#e6ecef"});
	});
	$(".main_list").on("mouseout","tbody tr",function(event){
		var bgColor = "";
		if(this.className=="odd"){
			bgColor = "#FAFAFA";
		}else{
			bgColor = "#ffffff";
		}
		$(this).find('td').css({backgroundColor: bgColor});
	});

	$(".main_list").on("click","td .checkbox",function(event){
		var cls = this.className;
		var currMenuPos = $('#menu_list a.curr').index('#menu_list a');
		var listPos = $(this).index('.main_list td .checkbox');

		if(cls.indexOf("checked")>-1){
			$(this).removeClass("checked");
			app.changeLocalHostsMode(currMenuPos,listPos,false);
		}else{
			$(this).addClass("checked");
			app.changeLocalHostsMode(currMenuPos,listPos,true);
		}
		return false;
	});

	//right top toolbar
    $("#btn_del").click(function(event){
        var currMenuPos = $('#menu_list a.curr').index('#menu_list a');
        app.delUserHosts(currMenuPos);
        return false;
    });

	$("#btn_save").click(function(event){
		var currMenuPos = $('#menu_list a.curr').index('#menu_list a');
		app.saveUserHosts(currMenuPos);
        return false;
	});

    $("#btn_edit").click(function(event){
        var currMenuPos = $('#menu_list a.curr').index('#menu_list a');
        var data = app.getUserHosts(currMenuPos);

        var addhosts = new EJS({url: 'templates/addhosts.ejs'});
        var html = addhosts.render(data);

        dialog.show({onOk:function(){
            var group = $(".table_form input[name=group]").val();
            var list = $(".table_form textarea[name=list]").val();
            app.addUserHosts(group,list,currMenuPos);
        },content:html,toolbar:true,title:"编辑自定义hosts分组",top:"40px"});

        return false;
    });

    //window toolbar
    $('.titlebar .minimize').on('click', function () {
        global.mainWindow.minimize();
    });
    $('.titlebar .close').on('click', function () {
        global.mainWindow.close();
    });

});