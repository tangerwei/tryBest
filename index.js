window.onload = function () {
    init();
}
var _data = {
    aquaPassAddress: "http://172.16.20.131:8080",
    adItemAddress: "http://172.16.20.131:8080"
}
function init() {
    //创建广告播放器控件
    var adplayer = new AdPlayer();
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
    var adposition_id = "20170119";
    var ads = new AdStrategy(adposition_id);
    ads.setAquaPassAddress(_data.aquaPassAddress);//设置广告服务器地址
    ads.setAdItemAddress(_data.adItemAddress);//设置素材服务器地址
    //将广告策略设置到广告控件中
    adplayer.setAdStrategy(ads);
   //策略设置监听 
    var iAdStrategyResponseListener = new IAdStrategyResponseListener({
        onResponse: function (v, items) {
            if (items != null && items.size() > 0) {
                //广告控件准备广告内容,字幕prepare不做任何操作，仅仅触发onprepare事件
                adplayer.prepare(items.get(0).ad_id);
                //广告控件播放广告内容，字幕play可以给定播放策略中的某个，或者全部
                adplayer.play(items.get(0).ad_id);//播放某个
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
}