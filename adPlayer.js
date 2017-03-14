function AdStrategySubtitle(adBannerId, param) {
    //
    this.adBannerId = adBannerId;
    if (typeof param !== undefined) {
        this.param = param;
    }
}
AdStrategySubtitle.prototype.setAquaPassAddress = function (ip) {
    this.aquaPassAddress = ip;
}
AdStrategySubtitle.prototype.setAdItemAddress = function (ip) {
    this.adItemAddress = ip;
}

function IAdStrategyResponseListener(obj) {
    this.onResponse = obj.onResponse;
    this.onError = obj.onError;
}

AdStrategySubtitle.prototype.setOnResponseListener = function (obj) {
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
AdStrategySubtitle.prototype.setParameter = function (key, value) {

}

AdStrategySubtitle.prototype.request = function () {
    //发起广告策略的请求
    var self = this;
    var url = this.aquaPassAddress + "/aquapaas_adv/rest/ads/decision";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {//请求成功
                var _items = JSON.parse(this.responseText);
                //转化下数组结构
                var items = {
                    _id: _items.id,
                    _adposition: _items.adpostion,
                    _value: _items.listOfPlacement,
                    length: _items.listOfPlacement.length
                };
                items.get = function (index) {
                    return this._value[index];
                }
                items.getAll = function () {
                    return this._value;
                }
                items.size = function () {
                    return this.length;
                }
                items.clear = function () {
                    // this._value = [];
                }
                self.requestData = items;
                if (typeof self.onResponse) {
                    self.onResponse(self, self.requestData);
                } else {
                    //未设置：获得广告策略结果的处理代码
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
    xhr.send(JSON.stringify(data));
}
AdStrategySubtitle.prototype.requestSelfPlay = function () {
    //自播放广告
}

function AdPlayerSubtitle(context) {
    this.context = context ? context : "";
    this.callback = {};
}
AdPlayerSubtitle.prototype.setContainer = function (id) {
    this.containerId = id;
}
function IAdPlayerCallbackListener(obj) {
    this.onPrepared = obj.onPrepared;
    this.onCompleted = obj.onCompleted;
    this.onError = obj.onError;
}
AdPlayerSubtitle.prototype.setAdStrategy = function (ads) {
    //判断ads是否为广告策略
    if (ads.constructor != AdStrategySubtitle) {
        return;
    }
    this._AdStrategy = ads;
}
AdPlayerSubtitle.prototype.setDefaultAd = function () {
    //指定播放器的默认播放内容
}
AdPlayerSubtitle.prototype.setCallbackListener = function (obj) {//重写回调
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
AdPlayerSubtitle.prototype.prepare = function () {
    if (this.callback.onPrepared) {
        this.callback.onPrepared(this);
    }
}

AdPlayerSubtitle.prototype.play = function (id) {
    var _data = [];
    var style = {//广告位提取样式
        colour: this._AdStrategy.requestData._adposition.colour,
        speed: this._AdStrategy.requestData._adposition.roll_speed,
        distance: this._AdStrategy.requestData._adposition.roll_distance,
        background_img: this._AdStrategy.requestData._adposition.background_image_url,
        disphaneity: this._AdStrategy.requestData._adposition.diaphaneity,
        fontSize:this._AdStrategy.requestData._adposition.font_size
    }
    if (id) {//播放给定Id，拼接参数
        var data = this._AdStrategy.requestData;
        for (var i = 0; i < data.length; i++) {
            if (data.get(i).ad_id == id) {
                _data.push(data.get(i));
            }
        }
    } else {//播放全部
        _data = this._AdStrategy.requestData.getAll();
    }
    this.playItems(style, _data);
}
AdPlayerSubtitle.prototype.playItems = function (style, context) {
    //根据内容播放
    //给当前播放绑定唯一标识
    this._playeRicon = "adplayer" + (new Date()).getTime();
    var div = document.createElement("div");
    div.id = this._playeRicon;
    div.style.position = "relative";
    div.style.height = "100%";
    div.style.width = "100%";
    div.style.lineHeight = document.getElementById(this.containerId).offsetHeight + "px";
    div.style.overflow = "hidden";
    //设置字体颜色
    if (style.colour) {
        div.style.color = style.colour;
    }
    //设置背景透明度
    if (style.disphaneity) {
        var _rgbao = parseInt(style.disphaneity)/100;
        div.style.background = "rgba(255,255,255,"+ _rgbao +")";
    }
    //设置背景图
    if (style.background_img) {
        var _str = style.background_img.split("/");
        if(_str[0] == ".."){
            _str[0] = "";
            style.background_img = _str.join("/");
        }
        div.style.backgroundImage = "url('" + style.background_img + "')";
        div.style.backgroundSize = "100% 100%";
    }
    //字体大小
    if(style.fontSize) {
        div.style.fontSize = style.fontSize + "px";
    }
    //轮播列表
    var ul = document.createElement("ul");
    ul.id = this._playeRicon + "-ul";
    ul.style.position = "absolute";
    ul.style.listStyle = "none";
    ul.style.margin = 0;
    ul.style.padding = 0;
    ul.style.left = document.getElementById(this.containerId).offsetWidth + "px";
    var liList = [];
    for (var i = 0; i < context.length; i++) {
        var loopitem = context[i].subtitle_content;
        liList.push("<li id='" + this._playeRicon + "-ul-" + i + "' style='display:inline-block;white-space:nowrap;padding-left:20px' data-id = '"+ context[i].ad_id +"'>" + loopitem + "</li>");
    }
    ul.innerHTML = liList.join("");
    div.appendChild(ul);
    document.getElementById(this.containerId).appendChild(div);
    var self = this;
    var initBoolean = true;
    var _timeInteval = setInterval(function () {
        var op = document.getElementById(self._playeRicon + "-ul");
        op.style.left = (op.offsetLeft - style.distance) + "px";
        var op_child = op.firstElementChild;
        //初始化屏幕显示
        if (initBoolean) {//op.offsetHeight < op.parentNode.offsetHeight
            var firstWidth = op.offsetWidth;
            while (op.offsetWidth < op.parentNode.offsetWidth) {
                //计算第一个的id
                var oplast_child = op.lastElementChild;
                var oldId = oplast_child.id.split("-");
                var newId_i = parseInt(oldId[oldId.length - 1]) + 1;
                for (var i = 0; i < context.length; i++) {
                    var loopitem = context[i].subtitle_content;
                    var li = document.createElement("li");
                    li.id = self._playeRicon + "-ul-" + (newId_i + i);
                    li.setAttribute("data-id",context[i].ad_id);
                    li.style.display = "inline-block";
                    li.style.whiteSpace = "nowrap";
                    li.style.paddingLeft = "20px";
                    li.innerHTML = loopitem;
                    op.style.width = (op.offsetWidth + firstWidth) + "px";
                    op.appendChild(li);
                }
            }
            op.style.right = "0px";
            initBoolean = false;
            return;
        }
        var oplast_child = op.lastElementChild;
        if (op.offsetLeft + op_child.offsetWidth < 0) {
            var _width = op_child.offsetWidth;
            var compelteId = op_child.getAttribute("data-id");
            op.removeChild(op_child);
            op.style.left = "0px";
            op.style.width = (op.offsetWidth - _width) + "px";//去掉长度
            // op.appendChild(spt);
            //调用播放完成回调
            if(self.onCompleted){
                self.onCompleted(self);
            }
            self.placementReport(compelteId);
        }
        //Math.abs是为了去掉边框的影响
        if(oplast_child.offsetLeft + op.offsetLeft + oplast_child.offsetWidth < op.parentNode.offsetWidth && Math.abs(op.offsetHeight - op.parentNode.offsetHeight) < 6){
            var _firstChild = op.firstElementChild;
            var newNode = _firstChild.cloneNode(true);
            op.style.width = (op.offsetWidth + _firstChild.offsetWidth) + "px";
            op.appendChild(newNode);
        }
    }, style.speed);
    //将定时器标识写入div的data-time属性
    document.getElementById(this._playeRicon).setAttribute("data-time", _timeInteval);
}

AdPlayerSubtitle.prototype.stop = function () {
    var _timeInteval = document.getElementById(this._playeRicon).getAttribute("data-time");
    clearInterval(_timeInteval);
}
AdPlayerSubtitle.prototype.placementReport = function (id,rptParams) {
    console.log(id);
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