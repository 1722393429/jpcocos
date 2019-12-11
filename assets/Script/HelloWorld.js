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
           cc.jp.ws.sendNative(JSON.stringify({code:101,nick:"xxx"}));
           // cc.jp.ws.send(101,{nick:"x"});
        }));
        cc.jp.ws.connect();
    },

    // called every frame
    update: function (dt) {

    },
});
