/**
 * Created by linxiaojie on 2015/11/17.
 */
var event = require('./event');
var request = require('./request');

/*
    view
 */

var User = require('./user'),
    SignIn = require('./signIn'),
    Gather = require('./gather'),
    globalEvent = require('./global.event');

var user = signIn = gather = null;


/*
    @res {object}数据集
    @first{bool} 是否初始化 是：true；否：false
 */
var refresh = function(res, first){
    var userModel = {
        logo: res.logo,
        name: res.name,
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
            bigtime: res.bigtime, //每N分钟计算一次
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
    }else{
        event.trigger(globalEvent.user.render, userModel);
        event.trigger(globalEvent.signIn.render, signInModel);
        event.trigger(globalEvent.gather.render, gatherModel);
    }
};
//首次加载
request.get(request.bytecoin.get).done(function(res){
    refresh(res, true);
}).done(function(){
    event.on(globalEvent.bytecoin.render,function(e){
        request.get(request.bytecoin.get).done(function(res){
            //非初始化加载
            refresh(res);
        });
    });
});