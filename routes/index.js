var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*赚流量币页面：
请求id：bytecoin_get
参数：无
返回：
coinnum:		用户流量币数
Signnum		今日签到可获取流量币数
TmrSignnum	明日签到可获取流量币数
Signmark	是否签到标识，0未签到，1已签到
Pitmark		矿井标识 0未从未挖过 1不可领取 2可以领取
digseconds	挖掘的时间 秒

digtime:
    digmaxtime
digbytecoin*/
var data ={
  bytecoin: {//赚流量币
    logo: 'http://mmdm.aspire-tech.com/fx/demo/guifang/assets/image/5.png',
    name: 'liljay',
    coinnum: 48,//用户流量币数
    signnum: 2,//今日签到可获取流量币数
    tmrsignnum: 3,//明日签到可获取流量币数
    signmark: 0,//是否签到标识，0未签到，1已签到
    pitmark: 0,//矿井标识 0未从未挖过 1不可领取 2可以领取
    digseconds: 0,//	挖掘的时间 秒
    digtime: 0.5, //每N分钟计算一次
    digmaxtime:0.02, //最多累计N小时
    digbytecoin: 0.25 //每digtime分钟收集N个流量币
  },
  bytecoin_spend:{//花流量币
    coinnum: 48.0,//用户流量币数
    activity_start_time: '20151215122621',
    activity_end_time: '20151218212021',
    activitylist:[
      {
        id: 1,//		商品id
        goods_name: '4G单模流量',	//商品名称
        flow_limit: '50', //流量额度
        price: 5,		//价格
        convertible_number:	1000,//可兑换次数
        exchange_number: 0,//	已兑换次数
        pic_url: 'http://mmdm.aspire-tech.com/fx/demo/guifang/assets/image/5.png',//	配图
        activity_start_time: '20151118172021',//	活动开始时间
        activity_end_time: '20151118212021',//	活动结束时间
        retcode: 0//		抢购按钮显示状态 0 可抢购 1 已抢购 2 已抢光
      },
      {
        id: 2,//		商品id
        goods_name: '4G单模流量',	//商品名称
        flow_limit: '500', //流量额度
        price: 3,		//价格
        convertible_number:	1000,//可兑换次数
        exchange_number: 800,//	已兑换次数
        pic_url: 'http://mmdm.aspire-tech.com/fx/demo/guifang/assets/image/5.png',//	配图
        activity_start_time: '20151118172021',//	活动开始时间
        activity_end_time: '20151118212021',//	活动结束时间
        retcode: 0//		抢购按钮显示状态 0 可抢购 1 已抢购 2 已抢光
      },
      {
        id: 3,//		商品id
        goods_name: '4G单模流量',	//商品名称
        flow_limit: '1024', //流量额度
        price: 1024,		//价格
        convertible_number:	200,//可兑换次数
        exchange_number: 100,//	已兑换次数
        pic_url: 'http://mmdm.aspire-tech.com/fx/demo/guifang/assets/image/5.png',//	配图
        activity_start_time: '20151118172021',//	活动开始时间
        activity_end_time: '20151118212021',//	活动结束时间
        retcode: 1//		抢购按钮显示状态 0 可抢购 1 已抢购 2 已抢光
      },
      {
        id: 4,//		商品id
        goods_name: '4G单模流量',	//商品名称
        flow_limit: '50', //流量额度
        price: 50,		//价格
        convertible_number:	100,//可兑换次数
        exchange_number: 100,//	已兑换次数
        pic_url: 'http://mmdm.aspire-tech.com/fx/demo/guifang/assets/image/5.png',//	配图
        activity_start_time: '20151118172021',//	活动开始时间
        activity_end_time: '20151118212021',//	活动结束时间
        retcode: 2//		抢购按钮显示状态 0 可抢购 1 已抢购 2 已抢光
      }
    ]
  }
};



router.get('/bytecoin_get', function(req, res, next) {
  //res.send({data: data});
  res.json(data.bytecoin);
});

router.get('/bytecoin_spend', function(req, res, next) {
  //res.send({data: data});
  res.json(data.bytecoin_spend);
});


router.post('/bytecoin_signin', function(req, res, next) {
  var resData = {retcode: 1};
  data.bytecoin.signmark = 1;
  data.bytecoin.coinnum +=data.bytecoin.signnum;
  res.json(resData);
});

router.post('/bytecoin_pit', function(req, res, next) {
  var resData = {retcode: 0};
  //是否可领取
  var addCoin = Math.floor(data.bytecoin.digseconds / 60 / data.bytecoin.digtime)  * data.bytecoin.digbytecoin;

  if(data.bytecoin.pitmark == 0){
    data.bytecoin.digseconds = 0;
    data.bytecoin.pitmark = 1;
    setCounter();
    resData.retcode = 1;
  }else if(addCoin > 0){
    resData.retcode = 1;
/*    var duration = data.bytecoin.digseconds / 60;
    if( (duration / 60) > data.bytecoin.digmaxtime){
        duration = data.bytecoin.digmaxtime * 60;
    }*/
    data.bytecoin.coinnum += addCoin;
    data.bytecoin.digseconds = 0;
    data.bytecoin.pitmark = 1; //不可领取
    //setCounter();
    //increment();
  }else{
    resData.retcode = 2;
  }

  //data.bytecoin.signmark = 1;
  res.json(resData);
});

var counter = null;
function setCounter(){
  if(counter){
    clearTimeout(counter);
    counter = null;
  }

  increment();
}

function increment(){
  data.bytecoin.digseconds += 1;  //是否可领取
  var digseconds = data.bytecoin.digseconds;
  var maxSeconds = data.bytecoin.digmaxtime * 60 * 60;
  var addCoin = Math.floor(digseconds / 60 / data.bytecoin.digtime)  * data.bytecoin.digbytecoin;
  addCoin > 0 && (data.bytecoin.pitmark = 2);
  console.log(JSON.stringify({
    pitmark: data.bytecoin.pitmark ,
    digseconds: data.bytecoin.digseconds,
    gatherCoin: addCoin,
    coinsum: data.bytecoin.coinnum
  }));
  if(digseconds >= maxSeconds ){
    data.bytecoin.digseconds = maxSeconds;
    //counter&&clearTimeout(counter);
    //counter = null;
  }
  counter = null;
  counter = setTimeout(function(){
    increment();
  }, 1000);
}
/*0 抢购失败
1 抢购成功
2 已抢购
3 抢光了
4 该抢购产品不存在或已下架
5 流量币余额不足
6 已过抢购时间了*/
router.post('/bytecoin_flow&flowid=:flowid', function(req, res, next) {
  var resData = {retcode: 0};
  var flowid  = req.params.flowid  || 0;
  var spends = data.bytecoin_spend.activitylist;
  var i = 0, l = spends.length, spend= null;
  for(;i< l;i++){
    spend = spends[i];
    if(spend.id == flowid){
      break;
    }
    spend = null;
  }
  var bytecoin = data.bytecoin;
  if(spend){
    if(spend.price > bytecoin.coinnum){
      resData.retcode = 5;
    }else if(spend.exchange_number == spend.convertible_number){
      resData.retcode = 3;
    }else if(spend.retcode == 1){
      resData.retcode = 2;
    }
    //else if(spend.activity_end_time > )//时间超过
    else {
      data.bytecoin.coinnum -=spend.price;
      spend.exchange_number --;
      spend.retcode = 1;
      resData.retcode = 1;
    }
  }else{
    resData.retcode = 4;
  }
  res.json(resData);
});



module.exports = router;
