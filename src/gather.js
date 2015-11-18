/**
 * Created by linxiaojie on 2015/11/17.
 */
var event = require('./event');
View = require('./View'),
    _template = require('./tpl/gather.html'),
    request = require('./request'),
    globalEvent = require('./global.event');

var UPDATE_COIN_COUNTER = 1000; //时间计时器更新间隔

var Gather = View.extends({
    template: _template,
    model:{
        digprogress: '0%', //采集进度
        dig_format_time: '00:00:00', //显示计时器的时间
        total_gather_coin: 0, //已收集流量币
        pitmark: 0, //采集状态： 未开始：0, 不可领取：1，可领取 2
        digseconds: 0,//	挖掘的时间 秒
        bigtime: 15, //每N分钟计算一次
        digmaxtime:4, //最多累计N小时
        digbytecoin: 0.25, //每bigtime分钟收集N个流量币
        pit_fn: function () {
            this.pit_class = this.pitmark == 1 ? 'disable' : '';
            return function (text) {
                return  text ;
            }
        }
    },
    events: {
        'click .gather-btn': 'onGatherClick'
    },
    type: {
        render: globalEvent.gather.render
    },
    onGatherClick: function(){
        var me = this,
            model = me.model;
/*        console.table({
            'onGatherClick': model.pitmark
        });*/
        //可领取 or 开始挖矿
        if(model.pitmark === 0 || model.pitmark === 2){
            var cb = function(res){
                //更新赚流量界面
                if(res.retcode === 1){
                    event.trigger(globalEvent.bytecoin.render);//触发赚流量更新
                }
            };
            request.post(request.gather.bytecoin_pit).done($.proxy(cb, this));
        }
    },
    render: function(e, data){
        var me = this;
        console.count('gather.render');
        console.table(me.model);
        me.model = $.extend({}, me.model, data || {});
        me.doMath();
        me.$el.html(me.template(me.model));
    },
    /*
      是否开始采集：
       是： 1.计算当前已采金币
            1.1已收集满，停止计时器
            1.2设置已收集流量币
           2.添加计时器
     */
    doMath: function(){
        var me = this,
            model = me.model;
        //是否开始收集
        if(model.pitmark != 0 ){
            var digseconds = model.digseconds,
                maxSeconds = model.digmaxtime * 60 * 1000;
            //超过最大收集时间，收集满了
            if(digseconds >= maxSeconds ){
                this.model.digseconds = this.model.digmaxtime * 60 * 1000;
                me.stopCounter();
            }
            me.formateDigSeconds();
            me.counterGatherCoin();
        }
    },
    stopCounter: function(){
        this.coinCounter&&clearTimeout(this.coinCounter);
    },
    /*
        按时间计算收集的流量币数量
        @param{int} 毫秒数
     */
    counterGatherCoin: function(){
        var me = this,
            model = me.model,
            digseconds = model.digseconds;
        if(digseconds > 0){
            var coin = me.model.total_gather_coin = Math.floor(digseconds / 60 / model.bigtime)  * model.digbytecoin;
            coin > 0 && (
                    me.model.total_gather_coin = coin,
                    me.model.pitmark = 2
            );
        }
    },
    /*
        设置流量币采集定时器
     */
    counter: function(){
        var me = this;
        //console.count('gather.counter');
        me.coinCounter = null;
        me.coinCounter = setTimeout(function(){
            me.model.digseconds++;
            me.render();//更新采集界面
            me.counter();
        }, UPDATE_COIN_COUNTER);
    },
    caculateProgress: function(){
        var maxSeconds = this.model.digmaxtime * 60 * 1000;
        this.model.digprogress = (this.model.digseconds / maxSeconds / 100) + '%';
    },
    formateDigSeconds: function(){
        var digseconds = this.model.digseconds,
            t, s = '', e, n = 60;
        //console.count('formateDigSeconds');
        for(var i=0; i < 3; i++){
            if(digseconds != 0){
                e = digseconds % n ;
                t = e === 0 ? '00' : (e < 10 ? '0' + e : e);
                s = s == '' ? t : t + ':' + s ;
                digseconds = parseInt(digseconds / n, 10);
            }else{
                s = s == '' ? '00' : '00:' + s ;
            }
        }

        this.model.dig_format_time = s;
    },
    addEvent: function(){
        var me = this;
        event.on(me.type.render, $.proxy(me.render, me));
    },
    init: function(){
        this.addEvent();
        this.coinCounter = null; //流量币时间计时器
        //console.log(this.model);
        event.trigger(this.type.render);
        this.counter(); //启动定时器
    },
    destroy: function(){
        event.off('gather');
        this.stopCounter();
    }
});

module.exports = Gather;
