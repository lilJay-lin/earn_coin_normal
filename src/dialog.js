/**
 * Created by linxiaojie on 2015/11/19.
 */

var event = require('./event');
View = require('./View'),
    _template = require('./tpl/dialog.html'),
    Dialog = require('./dialog'),
    globalEvent = require('./global.event');
var Dialog = View.extends({
    template: _template,
    model: {
        type1: 0, //抢购二次提示框
    },
    events:{
        'click .coin-dialog-btn-cancel': 'onDialogCancel',
        'click .coin-dialog-btn-success': 'onDialogSuccess',
        'click .coin-dialog-btn-close' : 'onDialogSuccess'
    },
    onDialogCancel: function(){
        this.destroy();
    },
    onDialogSuccess: function(){
        this.options.success.apply(this, this.slice(arguments));
    },
    onDialogClick: function(e){
        var me = this,
            model = this.model,
            curDialog = null;
        if(e.originalEvent) {
            e = e.originalEvent;
        }
        var tag = e.target;
        var $btn = $(tag);
        var id = $(tag).parent('.Dialog').data('id');
        curDialog = model.Dialogs[id];
        if(curDialog){
            if(curDialog.price > model.coinnum){

            }
        }

    },
    render: function(e, data){
        var me = this;
        console.count('dialog.render');
        me.model = $.extend({}, me.model, data || {});
        me.$cnt = $(me.template(me.model));
        me.$el.append(me.$cnt);
    },
    init: function(){
        var me = this;
        this.render();
    },
    destroy: function(){
        this.undelegateEvents();
        this.$cnt && this.$cnt.remove();
    }
});

module.exports = Dialog;