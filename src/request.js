/**
 * Created by linxiaojie on 2015/11/17.
 */

/*
    封装请求url和请求方法
 */
module.exports = {
    bytecoin: {//赚流量页面请求数据
        get: '/t.do?requestid=bytecoin_get'
    },

    user: {
        get: '/t.do?requestid=bytecoin_get'
    },
    sign: {//签到组件请求数据
        signIn: '/t.do?requestid=bytecoin_signin' //签到
    },
    gather: {//流量矿井请求数据
        bytecoin_pit: '/t.do?requestid=bytecoin_pit' //开始采集 or 领取
    },
    spend:{//花流量模块请求数据
        bytecoin_spend: '/t.do?requestid=bytecoin_spend',
        bytecoin_flow: '/t.do?requestid=bytecoin_flow'
    },
    get: function(url,data){
        data = data == undefined ? null : data;
        return $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
           // timeout: 5000, //请求超时，看平台需不要设就设吧
            cache: false,
            data: data,
            success: function(data){//请求成功

            },
            error: function(xml, status, thrown){//请求失败

            }
        });
    },
    post: function(url, data){
        data = data == undefined ? null : data;
        return $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            cache: false,
            data: data,
            // timeout: 5000, //请求超时，看平台需不要设就设吧
            success: function(data){//请求成功

            },
            error: function(xml, status, thrown){//请求失败

            }
        });
    }
};