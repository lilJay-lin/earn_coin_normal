/**
 * Created by linxiaojie on 2015/11/17.
 */

var idCounter = 0;

var _ = {};
_.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};



module.exports = _;