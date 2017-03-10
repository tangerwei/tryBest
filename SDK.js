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

var IAdStrategyResponseListener = new Object;

IAdStrategyResponseListener.onResponse = function() {}

IAdStrategyResponseListener.onError = function() {}


//用户使用实例

IAdStrategyResponseListener.onResponse = function() {
    alert("onResponse");
}

IAdStrategyResponseListener.onError = function() {
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

var IAdPlayerCallbackListener = new Object;

IAdPlayerCallbackListener.onPrepared = function() {}

IAdPlayerCallbackListener.onCompleted = function() {}




function AdStrategy() {
    this.AquaPassAddress = "";
    this.AdItemAddress =  "";
}

AdStrategy.prototype.setAquaPassAddress = function(_host) {
    this.AquaPassAddress = _host;
};

AdStrategy.prototype.setAdItemAddress = function(_host) {
    this.AdItemAddress = _host;
};

AdStrategy.prototype.request = function(_host) {
    var xmlhttp;
    
    if(window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          IAdStrategyResponseListener.onResponse("ads_decision",xmlhttp);   
          //document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
      }else{
          IAdStrategyResponseListener.onError("ads_decision",xmlhttp);
      }
    }
    xmlhttp.open("POST","http://192.168.7.143:8080/aquapaas_adv/rest/ads/decision",true);
    //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send('{"adposition_id":"XYZD_STB_004"}');
    
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