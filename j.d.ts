import {websocket} from "./assets/Script/base/network/websockt";
//import {debugEnable} from "./assets/Script/const";

interface JP{
    ws?:websocket;
}
declare global {
       namespace cc{
          var jp:JP;
        //export function jlog(msg,...msg:any[]):void;
         namespace jpn{
               function jlog(msg,...c:any[]):void;
        }
    }

}


