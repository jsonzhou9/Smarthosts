module.exports = {
    timer:-1,
	show:function(){
		$(".loader").css({display:"block"});
	},
	hide:function(){
		$(".loader").css({display:"none"});
	},
    showMsg:function(msg,timeout){
        var me = this;
        $(".notifi .msg").html(msg);
        $(".notifi").css({top:"0px",opacity:"1"});
        me.timer && clearTimeout(me.timer);
        if(timeout){
            me.timer = setTimeout(function(){
               me.hideMsg();
            },timeout);
        }
    },
    hideMsg:function(){
        $(".notifi").css({top:"-26px",opacity:"0"});
    }
};