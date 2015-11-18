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
        is_full: 0, //是否收集满了
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
        'click .gather-btn': 'gather'
    },
    type: {
        render: globalEvent.gather.render
    },
    render: function(e, data){
        var me = this;
        console.count('gather.render');
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
                me.setFull();
                me.stopCounter();
            }else { //未收集满，启动定时器
                me.coinCounter == null && me.counter();
            }
            me.counterGatherCoin();
        }
    },
    /*
        设置采集状态
     */
    setFull: function(){
        this.model.digseconds = this.model.digmaxtime * 60 * 1000;
        this.model.is_full = 1;
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
            if(coin > 0){
                me.model.bigtime = 2;
            }
        }
    },
    /*
        设置流量币采集定时器
     */
    counter: function(){
        var me = this;
        console.count('gather.counter');
        if(me.counter == null){
            me.coinCounter = setTimeout(function(){
                me.model.digseconds ++;
                me.render();//更新采集界面
                me.counter();
            }, UPDATE_COIN_COUNTER);
        }
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
    },
    destroy: function(){
        event.off('gather');
        this.stopCounter();
    }
});

module.exports = Gather;
