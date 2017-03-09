function AdStrategy(adBannerId, param) {
    //
    this.adBannerId = adBannerId;
    if (typeof param !== undefined) {
        this.param = param;
    }
}

function IAdStrategyResponseListener(obj) {
    this.onResponse = obj.onResponse;
    this.onError = obj.onError;
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
AdStrategy.prototype.setParameter = function (key, value) {

}
AdStrategy.prototype.onResponse = function () {

}
AdStrategy.prototype.request = function () {
    //发起广告策略的请求
    var self = this;
    var url = "";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {//请求成功
                var _items = JSON.parse(this.responseText);
                //转化下数组结构
                var items = {
                    _value: _items
                };
                items.get = function (index) {
                    return this._value[index];
                }
                items.clear = function () {
                    // this._value = [];
                }
                if (typeof self.onResponse) {
                    self.onResponse(self, items);
                } else {
                    //未设置：获得广告策略结果的处理代码
                }
            } else {//请求失败
                var mes = JSON.parse(this.responseText);
                self.onError(this.status, mes);
            }
        }
    }
    xhr.send();
}
AdStrategy.prototype.requestSelfPlay = function () {
    //自播放广告
}

function AdPlayer(context) {
    this.context = context;
    this.callback = {};
    this.playloop = 0;//设置播放次数
}
AdPlayer.prototype.setContainer = function (id) {
    this.container = document.getElementById(id);
}
function IAdPlayerCallbackListener(obj) {
    this.onPrepared = obj.onPrepared;
    this.onCompleted = obj.onCompleted;
    this.onError = obj.onError;
}
AdPlayer.prototype.setAdStrategy = function (ads) {
    //判断ads是否为广告策略
    if (ads.constructor != AdStrategy) {
        return;
    }
    this._AdStrategy = AdStrategy;
}
AdPlayer.prototype.setDefaultAd = function () {
    //指定播放器的默认播放内容
}
AdPlayer.prototype.setCallbackListener = function (obj) {//重写回调
    if (obj.constructor != IAdPlayerCallbackListener) {
        return;
    }
    if (typeof obj.onPrepared == "function") {
        // 广告控件中广告内容准备就绪后代码
        this.callback.onPrepared = obj.onPrepared;
    }
    if (typeof obj.onCompleted == "function") {
        // 广告控件中广告内容播放完毕后代码 
        this.callback.onCompleted = obj.onCompleted;
    }
    if (typeof obj.onError == "function") {
        //广告控件处理中发生错误抛出后处理代码
        this.callback.onError = obj.onError;
    }
}
//广告控件准备广告内容
AdPlayer.prototype.prepare = function () {
    if (this.callback.onPrepared) {
        this.callback.onPrepared();
    }
}

AdPlayer.prototype.play = function (id) {
    this.container.innerHtml = "";
    //广告控件播放广告内容
    var self = this;
    var marquee = document.createElement("marquee");
    marquee.appendChild(document.createTextNode(this.context.mes));
    marquee.id = "marquee_id";
    
    marquee.behavior = "slide";
    marquee.direction = "left";
    marquee.loop = "1";
    marquee.style.height = this.container.offsetHeight + "px";
    marquee.style.width = this.container.offsetWidth + "px";
    marquee.onfinish = function () {
        //完成一次，触发一次回调
        if (self.callback.onCompleted) {
            self.callback.onCompleted();
        }
        //每放完一次发送一次报告
        self.placementReport();
    }
}
AdPlayer.prototype.stop = function () {

}
AdPlayer.prototype.placementReport = function (rptParams) {
    //设置自播放报告
    if (rptParams) {

    } else {
        //默认发送
        var url = "";
        var xhr = new XMLHttpRequest();
        var data = {};
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {//请求成功

                } else {//请求失败

                }
            }
        }
        xhr.send(JSON.stringify(data));
    }
}