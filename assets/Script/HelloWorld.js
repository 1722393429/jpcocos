import {gen_handler} from "./base/util";
import {Consts, nethost} from "./const";
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string ="xxxxxxx";

        //console.log(Consts.TTT); console.log(Constsx.TTT);
        cc.jp.ws.addListener(Consts.RESP_TTT,gen_handler((d)=>{
          //  console.log(d,"xx1",this);
           cc.jp.ws.send("1699",{d:"双方都"});
        },cc.jp.ws));
        cc.jp.ws.addListener(Consts.RESP_TTTT,gen_handler(this.f,cc.jp.ws));
        cc.jp.ws.addListener("1700",gen_handler(this.f,cc.jp.ws));
        cc.jp.ws.connect();
    },
    f:function(d){
      //  console.log(d,"xx2",this);
       this.send("1600",{chip:"1"});
        // cc.jp.ws.sendNative(JSON.stringify({code:101,nick:"十多个"}));
        // cc.jp.ws.send(101,{nick:"x"});
    },
    // called every frame
    update: function (dt) {

    },
});
