/**
 * Created by linxiaojie on 2015/11/17.
 */

/*
    封装请求url和请求方法
 */
module.exports = {
    bytecoin: {//赚流量页面请求数据
        get: 'http://localhost:8080/bytecoin_get'
    },

    user: {
        get: 'http://localhost:8080/bytecoin_get'
    },
    sign: {//签到组件请求数据
        signIn: 'http://localhost:8080/bytecoin_signin'
    },
    gather: {//流量矿井请求数据
        bytecoin_pit: 'http://localhost:8080/bytecoin_pit'//
    },
    cost:{//花流量模块请求数据
        bytecoin_flow: 'http://localhost:8080/bytecoin_flow'
    },
    get: function(url,data){
        data = data == undefined ? null : data;
        return $.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            cache: false,
            data: data
        });
    },
    post: function(url, data){
        data = data == undefined ? null : data;
        return $.ajax({
            url: url,
            method: 'post',
            dataType: 'json',
            contentType: 'application/json',
            cache: false,
            data: data
        });
    }
};