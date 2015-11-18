/**
 * Created by linxiaojie on 2015/11/17.
 */
var o = $({}),
    slice = [].slice;
var event = {
    on: function(){
        o.on.apply(o, slice.call(arguments));
    },
    off: function(){
        o.off.apply(o, slice.call(arguments));
    },
    trigger: function(){
        o.trigger.apply(o, slice.call(arguments));
    },
    one: function() {
        o.one.apply(o, slice.call(arguments));
    }
};


module.exports = event;