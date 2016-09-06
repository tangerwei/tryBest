var config = {
    protocol: "http",
    ip: "172.16.20.131",
    port: "8080",
    userName: "clouduser_999",
    password: "clouduser_999"
}
config.init = function() {
    this.internetAddress = this.protocol + "://" + this.ip + ":" + this.port;
    console.log(this.internetAddress);
}
config.init();