import {handler} from "../util";
import {debugEnable} from "../../const";
import {EventTool} from "../event/event_tool";
import isNumber = cc.js.isNumber;

export class websocket extends EventTool {
    private ws: WebSocket;
    private hostport: string;
    private ssl: boolean = false;
    private cb?: Function;

    private url;
    private bin:boolean=true;
    constructor() {
        super();
    }
    public setBinary(b){
        this.bin= b;
    }
    public init(host?: string, connected?: handler):websocket {
        let prot = this.ssl ? "wss://" : "ws://";
        if (!host) {
            host = this.hostport;
        }
        function cc() {
            if (this.ws.readyState === WebSocket.OPEN) {
                if (connected) {
                    connected.exec(this.ws);
                }
                ;
            }
        }
        this.cb = cc.bind(this);
        this.url = prot + host;
        return this;
    };

    public connect() {
        this.ws = new WebSocket(this.url);
        if(this.bin){
            this.ws.binaryType='arraybuffer';
        }

        this.ws.onopen = this.onopen.bind(this);
        this.ws.onmessage = this.onmessage.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onclose = this.onclose.bind(this);
    }

    protected onopen(e) {

        cc.jpn.jlog("response onopen msg: ", e);

        if (this.cb) {
            this.cb();
        }
    }

    protected onerror(e) {

        cc.jpn.jlog("WebSocket instance wasn't ready...");

    }

    protected onclose(e) {
        cc.jpn.jlog("response onclose msg: " + e);
    }
    public close() {
        this.ws.close();
     }
     public isopen():boolean{
       return  this.ws.readyState == 1;
     }
    protected onmessage(e) {
        var jdata;
        if(typeof e.data == "string"){
            jdata  = JSON.parse(e.data);
        }else{
            var blob:ArrayBuffer=e.data;
            jdata = JSON.parse(this.decode(blob));
        }

        cc.jpn.jlog("response msg ", jdata);
        if (jdata.code) {

            var e = jdata.code;
            if (isNumber(e)) {
                e = e + "";
            }
            if (jdata.data) {
                this.fireEvent(e, jdata.data, jdata);
            } else {
                this.fireEvent(e, jdata);
            }
        }
    }

    public send(e: string, data: any) {
        if(!this.bin){
            this.ws.send(JSON.stringify({code: e, data: data}));
        }{
            this.ws.send(this.encode({code: e, data: data}));
        }
    }

    public sendNative(data: any) {
        this.ws.send(data);
    }

    public addListener(event: string, fun: handler) {
        this.addEventListener(event, (...params) => {
            fun.exec(params);
        });
    }
    private str2ab(str) {
         var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;



    }

    private encode(d:any){
        let js=JSON.stringify(d);
        var ab=new ArrayBuffer(2+js.length*2);
        var dv=new DataView(ab);
        dv.setInt16(0,js.length*2);
        let dbuf:ArrayBuffer=this.str2ab(js);

        var bytes = new Uint8Array(dbuf);
         var outputBytes = new Uint8Array(ab);
         for (var i = 0; i < bytes.length; i++)
            outputBytes[2+i] = bytes[i];

        return ab;
    }
    private decode(d:ArrayBuffer){
        var dv= new DataView(d);
         return String.fromCharCode.apply(null, new Uint8Array(d.slice(2)));
    }
}