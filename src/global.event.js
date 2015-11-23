/**
 * Created by linxiaojie on 2015/11/17.
 */

/*
    全局注册的事件，外部可通过此事件通知组件重绘
    value :　moduleName + '.' + action
 */

module.exports = {
    bytecoin:{//赚流量界面更新：包括user\signIn\gather模块
        render: 'bytecoin.render'
    },
    user: {
      render : 'user.render'
    },
    signIn: {
        render: 'signIn.render'
    },
    gather: {
        render: 'gather.render'
    },
    spend: {
        render: 'spend.render'
    },
    tabs: {
        switch: 'tabs.switch'
    }
};