import { _decorator, Component, Node, sys, log } from 'cc';
 //import {Client, Session, Socket} from '../../../assets/libs/nakama/nakama';
 // import {Client, Session, Socket} from '../../libs/nakama/nakama';

// import {Client} from "../libs/nakama/client";
// import {Session} from "../libs/nakama/session";

// import {Client} from "../../libs/nakama/client";
// import {Session} from "../../libs/nakama/session";


 const { ccclass, property } = _decorator;
 // const { sys, __private._pal_system_info_enum_type_feature__Feature } = _decorator;

@ccclass('TempNetworkTestScript')
export class TempNetworkTestScript extends Component {
    async start() {
        var serverkey = "defaultkey";
        var host = "127.0.0.1";
        var port = "7350";
        var useSSL = false;
        var timeout = 7000; // ms

        // var client = new Client(serverkey,host,port,useSSL,timeout);



    const email = "hello@example.com";
    const password = "somesupersecretpassword";
    
    // var session = await client.authenticateEmail(email,password);
    // client.authenticateEmail(email, password).then(function(session) {
    //     log("Authenticated successfully. User id:", session.user_id);
    //     // Store session token for quick reconnects.
    //     sys.localStorage.setItem("nakamaToken", session.token);
    // },
    // function(error) {
    //     error("authenticate failed:", JSON.stringify(error));
    // });


    }

    update(deltaTime: number) {
        
    }
}


