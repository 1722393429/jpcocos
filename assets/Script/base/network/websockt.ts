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

    constructor() {
        super();
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
        let jdata = JSON.parse(e.data);
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
        this.ws.send(JSON.stringify({code: e, data: data}));
    }

    public sendNative(data: any) {
        this.ws.send(data);
    }

    public addListener(event: string, fun: handler) {
        this.addEventListener(event, (...params) => {
            fun.exec(params);
        });
    }
}