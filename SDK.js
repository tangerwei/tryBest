/*
 * 
 * IAdStrategyResponseListener 广告策略请求回调函数.
 * 
 * onResponse(AdStrategy v, ArrayList<AdItem> items)
 * 发出广告策略请求后，获得请求结果回调，v为发出请求的AdStrategy对象, items为获取到的广告策略（广告项列表）.
 * onError(AdStrategy v, int errorCode, String errorMsg)
 * 广告策略请求发生错误回调，v为发出请求的AdStrategy对象, errorCode为错误代码，errorMsg为错误信息.
 * 
 */

function IAdStrategyResponseListener(obj) {
    this.onResponse = obj.onResponse;
    this.onError = obj.onError;
}


IAdStrategyResponseListener.prototype.onResponse = function() {
    alert("onResponse");
}

IAdStrategyResponseListener.prototype.onError = function() {
    alert("onError");
}


/*
 * 
 * IAdPlayerCallbackListener 广告播放器回调函数.
 * 
 * onPrepared(AdPlayer v)
 * 广告播放器所用的广告准备就绪回调.
 * onCompleted(AdPlayer v)
 * 广告播放器所用的广告播放结束回调.
 * 
 */

function IAdPlayerCallbackListener(obj) {
    this.onPrepared = obj.onPrepared;
    this.onCompleted = obj.onCompleted;
    // this.onError = obj.onError;
}

IAdPlayerCallbackListener.prototype.onPrepared = function(v) {
    alert("onPrepared");
}
IAdPlayerCallbackListener.prototype.onCompleted = function(v) {
    alert("onCompleted");
}
// IAdPlayerCallbackListener.prototype.onError = function(v) {
//     alert("onError");
// }

/*
 * 
 * AdStrategy 创建广告策略实例.
 * 
 * adBannerId 广告位ID
 * reqParams 请求参数
 * 
 * setOnResponseListener(IAdStrategyResponseListener obj)
 * 广告策略绑定回调
 * 
 * setAquaPassAddress(string host)设置广告服务器地址，格式为http://[ip]:[port].
 * 
 * setAdItemAddress(String adItemAddress)设置素材服务器地址，格式为http://[ip]:[port].
 * 
 * setParameter(String key, String value) 添加广告策略的请求参数.（广告策略请求参数属性key和参数值value所支持的类型，另文说明）
 * 
 * clearParameter(String key) 清除广告策略请求中的属性名为key的参数.
 * 
 * request()按所设置的参数请求广告策略.
 */
function AdStrategy(adBannerId,reqParams) {
    this.AquaPassAddress = "";
    this.AdItemAddress =  "";
    if(reqParams){
        this.reqParams = reqParams;
    }else{
        this.reqParams = {}
    }
}

AdStrategy.prototype.setOnResponseListener = function (obj) {
    if (obj.constructor != IAdStrategyResponseListener) {
        return;
    }
    if (typeof obj.onResponse == "function") {
        // 获得广告策略结果后处理代码
        this.onResponse = obj.onResponse;
    }
    if (typeof obj.onError == "function") {
        // 获得广告策略结果出错
        this.onError = obj.onError;
    }
}
AdStrategy.prototype.setAquaPassAddress = function(_host) {
    this.AquaPassAddress = _host;
};

AdStrategy.prototype.setAdItemAddress = function(_host) {
    this.AdItemAddress = _host;
};

AdStrategy.prototype.setParameter =function(key,value){
    this.reqParams[key] = value;
}

AdStrategy.prototype.clearParameter = function(_key$){
    var _param = {};
    var _obj = this.reqParams;
    for(key in _obj){
        if(key != _key$){
            _param[key] = _obj[key];
        }
    }
    this.reqParams = _param;
}

//用来分配实际类型
AdStrategy.prototype.__assignType = function(type){
    if(type == "image"){
        this.__assignObj = new AdStrategyImage();
    }
    if(type == "video"){
        this.__assignObj = new AdStrategyVideo();
    }
    if(type == "subtitle"){
        this.__assignObj = new AdStrategySubtitle();
    }
}

AdStrategy.prototype.request = function() {
    //检查广告服务器是否设置
    if(this.aquaPassAddress){
        return;
    }
    this.__assignType();
    //发起广告策略的请求
    var self = this;
    var xmlhttp;
    var url = this.aquaPassAddress + "/aquapaas_adv/rest/ads/decision";
    if(window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {//请求成功
                var _items = JSON.parse(this.responseText);
                if(_items.adpostion.metadata.type){
                    //根据请求实例化
                    self.__assignType(_items.adpostion.metadata.type);
                }
            } else {//请求失败
                var mes = JSON.parse(this.responseText);
                self.onError(this.status, mes);
            }
        }
    }
    var data = {
        adposition_id: this.adBannerId
    }
    xmlhttp.send(JSON.stringify(data));
};

AdStrategy.prototype.placementReport = function(_host) {
    //AJAX
    IAdStrategyResponseListener.onResponse("ads_placement",xmlhttp);
};

//实际用法 定义
//AdStrategy.setAquaPassAddress（"http://10.0.14.70:8080"）；
//AdStrategy.setAdItemAddress（"http://10.0.14.80:8080"）；

//使用
//URL= AdStrategy. AquaPassAddress + “/aquapaas_adv/rest/ads/placement”