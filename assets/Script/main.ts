import {websocket} from "./base/network/websockt";
import {debugEnable, nethost} from "./const";
import {gen_handler} from "./base/util";
if (!cc.jpn) {
    cc.jpn = {};
}
cc.jpn.jlog=function(msg, ...c) {};
if(debugEnable){
    cc.jpn.jlog=function(msg, ...c) {
             cc.log(msg, c);
     };
}
class start {
    constructor() {
        var jp = cc.jp;
        if (!jp) {
            jp = {};
            cc.jp = jp;
        }
        this.i();
    }

    //初始化
    private i() {
        cc.jp.ws = (new websocket).init(nethost, gen_handler((ws:websocket) => {
            cc.jpn.jlog("连接成功" + nethost,this);
        },cc));
    }
}

new start();
