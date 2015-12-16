/**
 * Created by linxiaojie on 2015/11/17.
 */

//var setOptions = ['configMap'];

var _ = require('./util');
var View = function(options){
    var me = this;
    /*$.each(setOptions, function(option){
        me[option] = options[option];
    });*/
    this.cid = _.uniqueId('c');
    this.el = options['el'];
    this.options = $.extend({}, this.options, options);
    this.model = $.extend({}, this.model, options.model || {});
    this._ensureElement();
    this.init.apply(this, arguments);
};
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

$.extend(View.prototype, {
    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    delegateEvents: function(events) {
        if (!(events || (events = this.events))) return this;
        //console.count('delegateEvents');
        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!$.isFunction(method)) method = this[events[key]];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            this.delegate(match[1], match[2], $.proxy(method, this));
        }
        return this;
    },
    delegate: function(eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
    },
    _ensureElement: function() {
        if (!this.el) {
            this.setElement($('<div/>'));
        } else {
            this.setElement(this.el);
        }
    },
    setElement: function(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    },
    _setElement: function(el) {
        this.$el = el instanceof $ ? el : $(el);
        this.el = this.$el[0];
    },
    undelegateEvents: function() {
        if (this.$el) this.$el.off('.delegateEvents' + this.cid);
        return this;
    },
    remove: function(){
        this.undelegateEvents();
        this.$el && this.$el.remove();
        return this;
    },
    slice: function(cxt){
        return [].slice.call(cxt);
    },
    $: function(selector){
        return this.$el.find(selector);
    },
    init: function(){},
    destroy: function(){}
});

/*
   暂不做继承
 */
View.extends = function(protoProps, staticProps){
    var parent = this;
    var child = function(){
        return parent.apply(this, arguments);
    };

    $.extend(child, parent, staticProps);

    var Surrogate = function(){this.constructor = child};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if(protoProps){
        $.extend(child.prototype, protoProps);
    }

    child.__super__ = parent.prototype;

    return child;
};
/*$.extend(View.prototype, {
    template: _
    init: function(){},
    destroy: function(){},
    render: function(){},
    addEvent: function(){}
});*/

module.exports = View;