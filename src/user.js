/**
 * Created by linxiaojie on 2015/11/17.
 */

var event = require('./event');
    View = require('./View'),
    _template = require('./tpl/user.html'),
    globalEvent = require('./global.event');

var User = View.extends({
    template: _template,
    model:{
        logo: '',
        name: '',
        coinnum: 0
    },
    type: {
        render: globalEvent.user.render
    },
    render: function (e, user){
        console.count('user.render');
        this.model = $.extend({}, this.model, user);
        this.$el.html(this.template(this.model));
    },
    addEvent: function (){
        var me = this;
        event.on(me.type.render, $.proxy(me.render, me));
    },
    destroy: function(){
        event.off('user');
    },
    init: function(){
        var me = this;
        me.addEvent();
        //初始化渲染
        event.trigger(me.type.render);
    }
});

module.exports = User;
