/**
 * Created by linxiaojie on 2015/11/17.
 */


var event = require('./event');
View = require('./View'),
    _template = require('./tpl/signIn.html'),
    request = require('./request'),
    globalEvent = require('./global.event');

var SignIn = View.extends({
    template: _template,
    events:{
        'click .sigin-btn': 'sign'
    },
    model:{
        signnum: 0,//今日签到可获取流量币数
        tmrsignnum: 0,//明日签到可获取流量币数
        signmark: 0//是否签到标识，0未签到，1已签到
    },
    type: {
        render: globalEvent.signIn.render,
        sign: 'signIn.sign'
    },

    /*
        签到
     */
    sign: function(e){
        e.preventDefault();
        console.count('signin');
        if(this.model.signmark){
            return ;
        }
        if(!!this.sign_click && this.sign_click == 'lock'){
            return ;
        }
        this.sign_click = 'lock';

        var cb = function(res){
            this.sign_click = 'unlock';
            //console.log(res);
            //更新赚流量界面
            if(res.retcode == '1'){
                event.trigger(globalEvent.bytecoin.render);//触发赚流量更新
            }
        };
        request.post(request.sign.signIn).done($.proxy(cb, this));
    },
    render: function (e, data){
        console.count('signIn.render');
        var me = this;
        me.model = $.extend({}, me.model, data || {});
        me.$el.html(this.template(me.model));
    },
    addEvent: function (){
        var me = this;
        event.on(me.type.render, $.proxy(me.render, me));
        event.on(me.type.sign, $.proxy(me.render, me));
    },
    destroy: function(){
        event.off('sigIn');
    },
    init: function(){
        var me = this;
        me.addEvent();
        event.trigger(me.type.render);
    }
});

module.exports = SignIn;