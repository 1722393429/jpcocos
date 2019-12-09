import {websocket} from "./base/network/websockt";
import {gen_handler} from "./base/util";
import {Consts} from "./const";

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
        this.label.string = "xxxxxx";
        let c =  (new websocket).init("localhost:4006",gen_handler((ws)=>{
            cc.log("连接成功");
        }));
        //console.log(Consts.TTT); console.log(Constsx.TTT);
        c.addListener(Consts.TTT,gen_handler((d)=>{
            cc.log(d);
        }));
    },

    // called every frame
    update: function (dt) {

    },
});
