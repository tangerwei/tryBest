window.onload = function () {
    init();
}
var _data = {
    aquaPassAddress: "http://172.16.20.131:8080",
    adItemAddress: "http://172.16.20.131:8080"
}
function init() {
    //创建广告播放器控件
    var adplayer = new AdPlayerSubtitle();
    adplayer.setContainer("display");
    //设置播放器回调
    adplayer.setCallbackListener(new IAdPlayerCallbackListener({
        onPrepared: function (v) {
            console.log("adplayer onPrepared callback");
            console.log(v.constructor);
        },
        onCompleted: function (v) {
            console.log("adplayer onCompleted callback");
            console.log(v.constructor);
        },
        onError: function (v, code, message) {
            console.log("adplayer onError");
        }
    }));

    //创建广告策略
    var adposition_id = "zmtestList";
    var ads = new AdStrategySubtitle(adposition_id);
    ads.setAquaPassAddress(_data.aquaPassAddress);//设置广告服务器地址
    ads.setAdItemAddress(_data.adItemAddress);//设置素材服务器地址
    //将广告策略设置到广告控件中
    adplayer.setAdStrategy(ads);
   //策略设置监听 
    var iAdStrategyResponseListener = new IAdStrategyResponseListener({
        onResponse: function (v, items) {
            if (items != null && items.size() > 0) {
                //广告控件准备广告内容,字幕prepare不做任何操作，仅仅触发onprepare事件
                // adplayer.prepare(items.get(0).ad_id);
                //广告控件播放广告内容，字幕play可以给定播放策略中的某个，或者全部
                //adplayer.play(items.get(0).ad_id);//播放某个
                adplayer.play();
                //adplayer.play();//播放全部
                //items.clear();
                // setTimeout(function(){
                //     adplayer.stop.call(adplayer,[]);
                // },2000);
            }
        },
        onError: function (v, code, message) {
            console('error:code=' + code + 'message:' + message);
        }
    });
    //给策略绑定回调
    ads.setOnResponseListener(iAdStrategyResponseListener);
    ads.request();

    //控件2
    //创建广告播放器控件
    var adplayer2 = new AdPlayerSubtitle();
    adplayer2.setContainer("display2");
    //设置播放器回调
    adplayer2.setCallbackListener(new IAdPlayerCallbackListener({
        onPrepared: function (v) {
            console.log("adplayer onPrepared callback");
            console.log(v.constructor);
        },
        onCompleted: function (v) {
            console.log("adplayer onCompleted callback");
            console.log(v.constructor);
        },
        onError: function (v, code, message) {
            console.log("adplayer onError");
        }
    }));

    //创建广告策略
    var adposition_id2 = "021";
    var ads2 = new AdStrategySubtitle(adposition_id2);
    ads2.setAquaPassAddress(_data.aquaPassAddress);//设置广告服务器地址
    ads2.setAdItemAddress(_data.adItemAddress);//设置素材服务器地址
    //将广告策略设置到广告控件中
    adplayer2.setAdStrategy(ads2);
   //策略设置监听 
    var iAdStrategyResponseListener2 = new IAdStrategyResponseListener({
        onResponse: function (v, items) {
            if (items != null && items.size() > 0) {
                //广告控件准备广告内容,字幕prepare不做任何操作，仅仅触发onprepare事件
                adplayer2.prepare(items.get(0).ad_id);
                //广告控件播放广告内容，字幕play可以给定播放策略中的某个，或者全部
                adplayer2.play(items.get(0).ad_id);//播放某个
                //adplayer.play();//播放全部
                //items.clear();
                // setTimeout(function(){
                //     adplayer.stop.call(adplayer,[]);
                // },2000);
            }
        },
        onError: function (v, code, message) {
            console('error:code=' + code + 'message:' + message);
        }
    });
    //给策略绑定回调
    ads2.setOnResponseListener(iAdStrategyResponseListener2);
    ads2.request();
}