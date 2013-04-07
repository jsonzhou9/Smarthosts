'use strict';

function init(_opation){
	var onShow = _opation.onShow || function(){};
	var onHide = _opation.onHide || function(){};
	var onOk = _opation.onOk || function(){hide();};
	var toolbar = _opation.toolbar || false;
	var content = _opation.content || "";
	var title = _opation.title || "";
	var dialogTop = _opation.top || "100px";

	if($(".jqmWindow").size()==0){ //add dom
		var dialog = new EJS({url: 'templates/dialog.ejs'});
		var html = dialog.render();
		$("body").append(html);
	}

	var opation = {
		modal:false,
		onShow:function(){
			if(toolbar){
				$(".dialog_bar").css({display:"block"});
			}else{
                $(".dialog_bar").css({display:"none"});
            }
			$(".dialog_title h3").html(title);
			$(".dialog_con").html(content);
			$(".jqmWindow").css({opacity:"1",webkitTransform:"scale(1)",top:dialogTop});

			onShow();
		},onHide:function(){
			$(".jqmWindow").css({webkitTransform:"scale(0)",opacity:"0",top:"500px"});
			$(".jqmOverlay").remove();

			onHide();
		}
	}

	$("#dialog_ok")[0].onclick = onOk;

	$('.jqmWindow').jqm(opation);
};

function show(_opation){
	init(_opation);
	$('.jqmWindow').jqmShow(); 
};

function hide(){
	$('.jqmWindow').jqmHide(); 
};

exports.show = show;
exports.hide = hide;