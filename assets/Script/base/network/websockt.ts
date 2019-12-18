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
        let that=this;
        function cc() {
            if (this.ws.readyState === WebSocket.OPEN) {
                if (connected) {
                    connected.exec(that);
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
        let v=function(...params) {
             fun.exec(params);
         };
        this.addEventListener(event, v);
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
    // private Uint8ArrayToString(fileData){
    //     var dataString = "";
    //     for (var i = 0; i < fileData.length; i++) {
    //         dataString += String.fromCharCode(fileData[i]);
    //     }
    //
    //     return dataString
    // }
    private decode(d:ArrayBuffer){
        var dv= new DataView(d);
        return this.Utf8ArrayToStr( new Uint8Array(d.slice(2)));
        // return String.fromCharCode.apply(null, new Uint8Array(d.slice(2)));
    }
    private Utf8ArrayToStr(array) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while(i < len) {
            c = array[i++];
            switch(c >> 4)
            {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
// 0xxxxxxx
                out += String.fromCharCode(c);
                break;
                case 12: case 13:
// 110x xxxx 10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
                case 14:
// 1110 xxxx 10xx xxxx 10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    }
}