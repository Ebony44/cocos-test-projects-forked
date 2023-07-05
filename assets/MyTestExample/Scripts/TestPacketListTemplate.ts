import { _decorator, Component, Node, sys, log } from 'cc';
import { stUserBase, stCardBase } from './PacketListTemplate';


 const { ccclass, property } = _decorator;
 // const { sys, __private._pal_system_info_enum_type_feature__Feature } = _decorator;

// interface stUserTemplate
// {
//     // public nSerial: number = 0;
//     // Interfaces are by their nature public, and therefore can only have public members, so they are not accepting private/protected etc. 

//     "nSerial": number;
//     "szID": string;
// }

// declare var stUserTemplate: {
//     prototype: stUserTemplate;
//     new(): stUserTemplate;
// };


export interface stUserTemplate
{
    // public nSerial: number = 0;
    // Interfaces are by their nature public, and therefore can only have public members, so they are not accepting private/protected etc. 

    nSerial: number,
    szID: string
}

// declare var stUserTemplate: 
// {
//     prototype: stUserTemplate;
//     new(): stUserTemplate;
// };



var Person = { 
    FirstName:"Tom", 
    LastName:"Hanks", 
    sayHi: ()=>{ return "Hi"} 
 };

@ccclass('TestPacketListTemplate')
export class TestPacketListTemplate extends Component {
    
    public stUserInstance: stUserTemplate | null = null;

    start() 
    {
        console.log("[TestPacketListTemplate][start]");

        // var serverkey = "defaultkey";
        // var host = "127.0.0.1";
        // var port = "7350";
        // var useSSL = false;
        // var timeout = 7000; // ms

        // const email = "hello@example.com";
        // const password = "somesupersecretpassword";
        // if (typeof stUserTemplate !== "undefined") 
        // {
        //     console.log("[stUserTemplate] is defined");
        // }
        // else 
        // {
        //     console.error("[stUserTemplate] is undefined");
        // }

        // if (typeof Person !== "undefined") 
        // {
        //     console.log("[Person] is defined");
        // }
        // else 
        // {
        //     console.error("[Person] is undefined");
        // }



        // var tempUser:stUserTemplate = new stUserTemplate();
        var tempUser:stUserTemplate ={nSerial:1,szID:"draste03"};
        //tempUser.nSerial = 1;
        //tempUser.szID = "draste03";

        console.log("current user serial " + tempUser.nSerial
        + " and user id " + tempUser.szID
        );
        this.modifyPassedParameter(tempUser);

        console.log("current user serial " + tempUser.nSerial
        + " and user id " + tempUser.szID
        );


        // this.stUserInstance = new stUserTemplate();
        // this.stUserInstance.nSerial = 0;
        // this.stUserInstance.szID = "draste02";
        

        // console.log("current user serial " + this.stUserInstance.nSerial
        // + " and user id " + this.stUserInstance.szID
        // );

    
    }

    update(deltaTime: number) {
        
    }

    modifyPassedParameter(paramUser:stUserTemplate) : stUserTemplate
    {
        // let result : stUserTemplate = {nSerial:2,szID:"asdf"};
        let result : stUserTemplate = paramUser;
        result.nSerial = 999;
        // paramUser.nSerial = 999;

        return result;
    }

}

