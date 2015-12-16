/**
 * Created by linxiaojie on 2015/11/17.
 */
var event = require('./event');
View = require('./View'),
    _template = require('./tpl/gather.html'),
    request = require('./request'),
    globalEvent = require('./global.event'),
    Toast = require('./toast'),
    Hint = require('./hint');
var toast = new Toast({
    el: document.body
});
var UPDATE_COIN_COUNTER = 1000; //时间计时器更新间隔

var Gather = View.extends({
    template: _template,
    model:{
        digprogress: '0%', //采集进度
        dig_format_time: '00:00:00', //显示计时器的时间
        total_gather_coin: 0, //已收集流量币
        pitmark: 0, //采集状态： 未开始：0, 不可领取：1，可领取 2
        digseconds: 0,//	挖掘的时间 秒
        digtime: 15, //每N分钟计算一次
        digmaxtime:4, //最多累计N小时
        digbytecoin: 0.25, //每digtime分钟收集N个流量币
        gather_time_union_txt: '',
        pit_class: '',
        gather_game_pic: '/public/images/g_s.png'
    },
    gatherGameState: {
        start: '/public/images/g_s.png',
        running: '/public/images/g_m.gif',
        end: '/public/images/g_e.gif'
    },
    events: {
        'click .gather-btn': 'onGatherClick'
    },
    type: {
        render: globalEvent.gather.render
    },
    setGatherGamePic: function(){
        var me = this,
            model = me.model,
            state = model.pitmark;
        state == '0' ? me.model.gather_game_pic = me.gatherGameState.start :
            me.isFull() ? me.model.gather_game_pic = me.gatherGameState.end :
                me.model.gather_game_pic = me.gatherGameState.running;
    },
    onGatherClick: function(e){
        var me = this,
            model = me.model;
        if(!!this.gather_click && this.gather_click == 'lock'){
            return ;
        }
        var $bnt = $(e.target);
        if($bnt.hasClass('disable')){
            return ;
        }
        me.gather_click = 'lock';
        $bnt.toggleClass('disable');//置灰
        //可领取 or 开始挖矿
        if(model.pitmark == 0 || model.pitmark == 2){
            me.stopCounter();
            var cb = function(res){
                if(res.retcode == "1" && model.pitmark != 0){
                    var dialog = new Dialog({
                        el: '.coin-dialog-box',
                        model:{
                            type6: 1,
                            coin: this.model.total_gather_coin
                        }
                    });
                    setTimeout(function(){
                        dialog.$cnt.addClass("hide");
                        setTimeout(function(){
                            dialog.destroy();
                        }, 2000)
                    }, 2000);
                }
                this.model.total_gather_coin = 0;
                //更新赚流量界面
                event.trigger(globalEvent.bytecoin.render);//触发赚流量更新
                this.counter();
            };
           if(model.pitmark == "2"){
               $('#gather_game_pic').attr('src', me.gatherGameState.end);
                setTimeout(function(){
                    request.post(request.gather.bytecoin_pit).done($.proxy(cb, me)).fail(function(){
                        toast.show(Hint.ERROR_MSG);
                        $bnt.toggleClass('disable');//还原
                    }).always(function(){
                        me.gather_click = 'unlock';
                    });
                },2000)
            }else{
                request.post(request.gather.bytecoin_pit).done($.proxy(cb, me)).fail(function(){
                    toast.show(Hint.ERROR_MSG);
                    $bnt.toggleClass('disable');//还原
                }).always(function(){
                    me.gather_click = 'unlock';
                });
            }

        }
    },
    render: function(e, data){
        var me = this;
        console.count('gather.render');
        //console.table(me.model);
        me.model = $.extend({}, me.model, data || {});
        //console.log(me.model);
        me.doFormat();
        me.doMath();
        me.setGatherText();
        me.setGatherGamePic();
        me.$el.html(me.template(me.model));
        //!me.$gatherGame && (me.$gatherGame = me.$('#gather_game_pic'));
    },
    doFormat: function(){
        var pitmark = this.model.pitmark,
            digseconds = this.model.digseconds;
        this.model.pitmark = pitmark === "" ? 0 : parseInt(pitmark, 10);
        this.model.digseconds = digseconds === "" ? 0 : parseInt(digseconds, 10);
    },
    setGatherText: function(){
        var me = this;
        //1.设置采集过程容器显示内容
        //2.设置采集硬币数显示内容gather_coin_txt
        if(!me.model.pitmark){
            me.model.gather_time_union_txt='\u4f60\u8fd8\u672a\u5f00\u5de5\u54e6';
        }else{
            if(me.model.digprogress === '100%'){
                me.model.gather_time_union_txt = '\u91c7\u96c6\u5b8c\u6210';
            }else{
                me.model.gather_time_union_txt = '\u91c7\u96c6\u4e2d\u002d' + me.model.dig_format_time;
            }
        }
        me.model.pit_class = me.model.pitmark != 2 ? 'disable' : '';

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
            if(me.isFull()){
                me.stopCounter();
            }else{
                me.counter();
            }
            me.formateDigSeconds();
            me.caculateProgress();
            me.counterGatherCoin();
        }
    },
    stopCounter: function(){
        this.coinCounter&&clearTimeout(this.coinCounter);
        this.coinCounter = null;
    },
    /*
        收集满不再跑定时器
     */
    isFull: function(){
        var me = this,
            res = false,
            model = me.model,
            digseconds = model.digseconds,
            maxSeconds = model.digmaxtime * 60 * 60;
        //超过最大收集时间，收集满了
        if(digseconds >= maxSeconds ){
            //console.warn("stopCounter");
            this.model.digseconds = maxSeconds;
            res = true;
        }
        return res;
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
            var coin = me.model.total_gather_coin = Math.floor(digseconds / 60 / model.digtime)  * model.digbytecoin;
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
        me.stopCounter();
        me.coinCounter = setTimeout(function(){
            me.model.digseconds++;
            me.render();//更新采集界面
        }, UPDATE_COIN_COUNTER);
    },
    caculateProgress: function(){
        var maxSeconds = this.model.digmaxtime * 60 * 60;
        this.model.digprogress = (this.model.digseconds * 100 / maxSeconds ) + '%';
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
