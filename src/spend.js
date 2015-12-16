/**
 * Created by linxiaojie on 2015/11/19.
 */

var event = require('./event');
View = require('./View'),
    Dialog = require('./dialog'),
    _template = require('./tpl/spend.html'),
    globalEvent = require('./global.event'),
    request = require('./request'),
    Toast = require('./toast'),
    Hint = require('./hint');
var toast = new Toast({
    el: document.body
});

var maxDelayTime = 1000 * 60 * 60 * 24;

var Spend = View.extends({
    template: _template,
    model: {
        coinnum: 0.0,//用户流量币数
        activity_start_time: '',
        activity_end_time: '',
        disable: 'disable',//是否可以抢购
        activitylist:[
            /*{
             id: 1,//		商品id
             goods_name: '4G单模流量',	//商品名称
             flow_limit: '50', //流量额度
             price: 50,		//价格
             convertible_number:	1000,//可兑换次数
             exchange_number: 0,//	已兑换次数
             pic_url: 'http://mmdm.aspire-tech.com/fx/demo/guifang/assets/image/5.png',//	配图
             activity_start_time: '20151118172021',//	活动开始时间
             activity_end_time: '20151118212021',//	活动结束时间
             retcode: 0//		抢购按钮显示状态 0 可抢购 1 已抢购 2 已抢光
             }*/
        ]
    },
    type: {
        render: globalEvent.spend.render,
    },
    events:{
        'click .spend-btn': 'onSpendClick'
    },
    onSpendClick: function(e){
        var me = this,
            model = this.model,
            curSpend = null;
        if(e.originalEvent) {
            e = e.originalEvent;
        }
        var tag = e.target;
        if($(tag).hasClass('disable')){
            return;
        }
        var $spend =$(tag).parent('.spend');
        var id = $spend.data('id'),
            price = $spend.data('price'),
            flow_limit = $spend.data("flow_limit"),
            goods_name = $spend.data("goods_name");
        new Dialog({
            el: '.coin-dialog-box',
            success: function(){
                this.destroy();
                me.spendOrder(id, price, flow_limit, goods_name);
            },
            model:{
                type1: 1,
                flow_limit: flow_limit,
                goods_name: goods_name,
                price: price
            }
        });
    },
    spendOrder: function(flowid, price, flow_limit, goods_name){
        var me = this,
            model = this.model;
/*        if(model.coinnum < price){
            me.earnMoreCoin(price);
        }else {*/
            var url = request.spend.bytecoin_flow + '&flowid=' + flowid;
            request.post(url).done(function(res){
                /* 0 抢购失败
                 1 抢购成功
                 2 已抢购
                 3 抢光了
                 4 该抢购产品不存在或已下架
                 5 流量币余额不足
                 6 已过抢购时间了*/
                if(res.retcode == "0" || res.retcode == "" ){
                    toast.show(Hint.ERROR_MSG);
                }else if(res.retcode == "1"){
                    new Dialog({
                        el: '.coin-dialog-box',
                        success: function(){
                            event.trigger(globalEvent.bytecoin.render);
                            this.destroy();
                        },
                        model:{
                            type3: 1,
                            flow_limit: flow_limit,
                            goods_name: goods_name
                        }
                    });
                }else if(res.retcode == "2"){
                    toast.show('\u5df2\u7ecf\u62a2\u8d2d\u8fc7\u4e86');//已经抢购过了
                }else if(res.retcode == "3"){
                    new Dialog({
                        el: '.coin-dialog-box',
                        success: function(){
                            this.destroy();
                        },
                        model:{
                            type4: 1,
                            flow_limit: flow_limit,
                            goods_name: goods_name
                        }
                    });
                }else if(res.retcode == "4" || res.retcode == "6"){
                    new Dialog({
                        el: '.coin-dialog-box',
                        success: function(){
                            this.destroy();
                        },
                        model:{
                            type5: 1
                        }
                    });
                }else if(res.retcode == "5"){
                    me.earnMoreCoin(price);
                }

                me.render();
            }).fail(function(){
                toast.show(Hint.ERROR_MSG);
            });
        //}
    },
    earnMoreCoin: function(price){
        new Dialog({
            el: '.coin-dialog-box',
            model:{
                type2: 1,
                price: price
            },
            success: function(){
                event.trigger(globalEvent.tabs.switch, [0]);
                this.destroy();
            }
        })
    },
    /*    findSpend: function(id){
     if(!!id){
     $.each(this.model.activitylist, function(){
     var spend = this;
     console.log(spend);
     console.log(id)
     if((spend.id + '') === (id + '')){
     return spend;
     }
     });
     }
     },*/
    render: function(e){
        var me = this;
        console.count('sepnd.render');
        request.get(request.spend.bytecoin_spend).done(function(res){
            me.model = $.extend({}, me.model, res || {});
            me.doFormat();
            me.renderFn(res);
        }).fail(function(){
            toast.show(Hint.ERROR_MSG);
        });
    },
    renderFn: function(){
        var me = this;
        me.$el.html(me.template(me.model));
    },
    doFormat: function(){
        var b = function(date){
            var res = {time: '', time_formate: 0}, reg = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
            var matcher = (date + '').match(reg);
            if(matcher && matcher.length > 6){
                res.time =  matcher[2] + '月' + matcher[3] + '日-'
                    + matcher[4] + ':' + matcher[5];

                var d = new Date(matcher[1], (matcher[2] - 1), matcher[3], matcher[4], matcher[5]
                    , matcher[6]);
                res.time_formate = d.valueOf();
            }
            return res;
        };

        var activitylist = [];
        $.each(this.model.activitylist, function(){
            var spend = this;

            spend.retcode = spend.retcode === "" ? 0 : parseInt(spend.retcode, 10);

            if(spend.retcode == 0){
                spend['spend_btn_txt'] = '马上抢';
            }else if(spend.retcode == 1){
                spend['spend_btn_txt'] = '抢过了';
            }else if(spend.retcode == 2){
                spend['spend_btn_txt'] = '抢完了';
            }

            //剩余份数
            var a = parseInt(spend['convertible_number'], 10) - parseInt(spend['exchange_number'], 10);
            spend['can_exchange_number'] = a < 0 ? 0 : a;

            activitylist.push(spend);
        });
        var res = b(this.model.activity_start_time);
        var activity_start_time = res.time;
        var activity_end_time = (b(this.model.activity_end_time)).time;



        this.model = $.extend({}, this.model, {
            activity_start_time: activity_start_time,
            activity_end_time: activity_end_time,
            activitylist : activitylist,
            //start_time_formate: res.time_formate //开始抢购时间
        });

        this.checkSpend(res.time_formate);

    },
    checkSpend: function(start){
        var me = this,
            duration = start - Date.now();
        if(duration > 0){
            me.model.disable = '';
            me.renderFn();
            if(duration < maxDelayTime){
                setTimeout(function(){
                    me.model.disable = 'disable';
                    me.renderFn();
                }, duration);
            }
        }
    },
    addEvent: function(){
        var me = this;
        event.on(me.type.render, $.proxy(me.render, me));
    },
    init: function(){
        var me = this;
        me.addEvent();
        event.trigger(me.type.render);
    },
    destroy: function(){
    }
});

module.exports = Spend;