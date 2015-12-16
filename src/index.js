/**
 * Created by linxiaojie on 2015/11/17.
 */
var event = require('./event');
var request = require('./request');
var tabs = require('./tabs');

/*
    view
 */

var User = require('./user'),
    SignIn = require('./signIn'),
    Gather = require('./gather'),
    globalEvent = require('./global.event'),
    Tabs = require('./tabs'),
    Spend = require('./spend'),
    tabs = null,
    Toast = require('./toast'),
    Hint = require('./hint');
var toast = new Toast({
    el: document.body
});

var user = signIn = gather = spend = null ;

//初始化tabs选项卡
$(function(){
    tabs =  new Tabs(".tabs");
    event.on(globalEvent.tabs.switch, function(e, idx){
        tabs.goto(idx);
    });

    /*
        加载图片
     */
    var img = ['/public/images/g_s.png', '/public/images/g_m.gif', '/public/images/g_e.gif'],
        image = new Image(),
        i = 0,
        l = img.length;
    image.onload = function(){
        i++;
        i < l && (image.src = img[i]);
    };
    image.src = img[i];

/*
    @res {object}数据集
    @first{bool} 是否初始化 是：true；否：false
 */
var refresh = function(res, first){
    var userModel = {
        nickname: res.nickname,
        logourl: res.logourl,
        coinnum: res.coinnum
        },
        signInModel = {
            signnum: res.signnum,//今日签到可获取流量币数
            tmrsignnum: res.tmrsignnum,//明日签到可获取流量币数
            signmark: res.signmark //是否签到标识，0未签到，1已签到
        },
        gatherModel = {
            pitmark: res.pitmark,//矿井标识 0未从未挖过 1不可领取 2可以领取
            digseconds: res.digseconds,//	挖掘的时间 秒
            digtime: res.digtime, //每N分钟计算一次
            digmaxtime: res.digmaxtime, //最多累计N小时
            digbytecoin: res.digbytecoin //每bigtime分钟收集N个流量币
        };
    if(typeof first != 'undefined'){
        user = new User({
            el: '#user',
            model: userModel
        });
        signIn = new SignIn({
            el: '#signin',
            model: signInModel
        });
        gather = new Gather({
            el: '#gather',
            model: gatherModel
        });

        tabs.$el.show();
    }else{
        event.trigger(globalEvent.user.render, userModel);
        event.trigger(globalEvent.signIn.render, signInModel);
        event.trigger(globalEvent.gather.render, gatherModel);
    }
};
//首次加载
//赚流量

request.get(request.bytecoin.get).done(function(res){
    refresh(res, true);
}).done(function(){
    event.on(globalEvent.bytecoin.render,function(e){
        request.get(request.bytecoin.get).done(function(res){
            //非初始化加载
            refresh(res);
        });
    });
}).fail(function(){
    toast.show(Hint.ERROR_MSG);
});


//花流量
spend = new Spend({
    el: '#spend'
});

});