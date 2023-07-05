import { _decorator, Component, Label, assert } from 'cc';
import { NATIVE } from 'cc/env';

const { ccclass, property } = _decorator;

 // declare var WebSocketServer : any
// declare var require : any

@ccclass('NetworkWebSocketServerOnly')
export class NetworkWebSocketServerOnly extends Component {

    @property({type: Label})
    public wsStatus: Label = null!;

    @property({type: Label})
    public ws: Label = null!;
    
    @property({type: Label})
    public wsServerStatus: Label = null!;

    @property({type: Label})
    public wsServerStatusSecond: Label = null!;

    @property({type: Label})
    public wsServerClientCountStatus: Label = null!;

    @property({type: Label})
    public wsServerDebugLogStatus: Label = null!;



    @property({type: Label})
    public wsServer: Label = null!;


    private  _wsiSendBinary: WebSocket | null = null;
    // @ts-expect-error
    private  _wsServer: WebSocketServer | null = null; // only for native usage

    // @ts-expect-error
    private _currentClientCount: WebSocketServerConnection[] | null =null;

    
    start() {
        
        // @ts-expect-error
        if ( NATIVE &&  typeof WebSocketServer !== "undefined") 
        {
            console.log("inside of if condition");
            // this.wsServerStatus.string = 'waiting..';
            // this.prepareWebSocketServer();
            this.wsServerStatus.string = 'waiting..';
            this.scheduleOnce(
                ()=>
                {
                    this.prepareWebSocketServer();
                },
            2);

            // this._wsiSendBinary = null;
            // this.wsStatus.string = 'waiting..';
            // this.scheduleOnce(
            //     ()=>
            //     {
            //         this.prepareWebSocket();
            //     },
            // 3);

            // this._wsiSendBinary = null;
            // this.wsStatus.string = 'waiting..';
            // this.prepareWebSocket();
        }
        else
        {
            if(NATIVE)
            {
                console.log("it' s Native!");
            }
            else
            {
                console.error("it' s not Native!");
            }
            // @ts-expect-error
            if(typeof WebSocketServer !== "undefined")
            {
                console.log("WebSocketServer is enabled");    
            }
            else
            {
                console.error("WebSocketServer is not enabled!");
            }
            console.log("Out of if condition");
        }

         this.onTestTextButton();
         this.onStartTest();

    }


    onDestroy () {
        // @ts-expect-error
        if (NATIVE && typeof WebSocketServer !== "undefined") {
            let wsiSendBinary = this._wsiSendBinary;
            if (wsiSendBinary) {
                wsiSendBinary.onopen = null;
                wsiSendBinary.onmessage = null;
                wsiSendBinary.onerror = null;
                // wsiSendBinary.onclose = null;
                wsiSendBinary.close();
            }
            let wsServer = this._wsServer;
            if (wsServer) {
                // wsServer.onconnection = null;
                // wsServer.onclose = null;
                wsServer.close();
            }
        }

    }

    prepareWebSocket () {
        const self = this;
        const websocketLabel = this.ws;
        const respLabel = this.wsStatus;
        // let url = this.wssCacert.nativeUrl;
        // if (assetManager.cacheManager) {
        //     url = assetManager.cacheManager.getCache(url) || assetManager.cacheManager.getTemp(url) || url;
        // }
        // We should pass the cacert to libwebsockets used in native platform, otherwise the wss connection would be closed.
        // @ts-ignore
        // this._wsiSendBinary = new WebSocket('wss://echo.websocket.events', []);
        this._wsiSendBinary = new WebSocket('ws://localhost:8080', []);
        this._wsiSendBinary.binaryType = 'arraybuffer';
        this._wsiSendBinary.onopen = function (evt) {
            respLabel.string = 'Opened!';
            websocketLabel.string = 'WebSocket: onopen'
        };

        this._wsiSendBinary.onmessage = function (evt) {
            const binary = new Uint8Array(evt.data);
            let binaryStr = 'response bin msg: ';

            let str = '0x';
            const hexMap = '0123456789ABCDEF'.split('');
            assert(hexMap.length == 16);

            for (let i = 0; i < binary.length; i++) {
               str += hexMap[binary[i] >> 4];
               str += hexMap[binary[i] & 0x0F];
               // str += String.fromCharCode(parseInt(,16) );
               // str +=  String.fromCharCode(binary[i]);
            }
            

            binaryStr += str;
            respLabel.string = binaryStr;
            websocketLabel.string = 'WebSocket: onmessage'
        };

        this._wsiSendBinary.onerror = function (evt) {
           websocketLabel.string = 'WebSocket: onerror'
            respLabel.string = 'Error!';
        };
         
        this._wsiSendBinary.onclose = function (evt) {
            websocketLabel.string = 'WebSocket: onclose'
            // After close, it's no longer possible to use it again,
            // if you want to send another request, you need to create a new websocket instance
            self._wsiSendBinary = null;
            respLabel.string = 'client is closed!';
        };

        this.scheduleOnce(this.sendWebSocketBinary, 1);
    }

    sendWebSocketBinary () {
        let websocketLabel = this.wsStatus.node.getParent()!.getComponent(Label)!;
        if (!this._wsiSendBinary) { return; }
        if (this._wsiSendBinary.readyState === WebSocket.OPEN){
            websocketLabel.string = 'WebSocket: send binary';
            let buf = 'Hello WebSocket中文,\0 I\'m\0 a\0 binary\0 message\0.';

            let arrData = new Uint16Array(buf.length);
            for (let i = 0; i < buf.length; i++) {
                arrData[i] = buf.charCodeAt(i);
            }

            this._wsiSendBinary.send(arrData.buffer);
        }
        else{
            let warningStr = 'send binary websocket instance wasn\'t ready...';
            websocketLabel.string = 'WebSocket: not ready';
            this.wsStatus.string = warningStr;
            this.scheduleOnce(()=> {
                this.sendWebSocketBinary();
            }, 1);
        }
    }

    prepareWebSocketServer() {
            const self = this;
            const wsServerLabel = this.wsServer;
            const respLabel = this.wsServerStatus;
            const respLabelSecond = this.wsServerStatusSecond;

            const respLabelDebug = this.wsServerDebugLogStatus;
            const respLabelClientCount = this.wsServerClientCountStatus;
            
            

            let wsServerForInside:any = this._wsServer;
            // @ts-expect-error
            this._wsServer = new WebSocketServer();
            //// @ts-expect-error
            //var wsServerForInside:WebSocketServer = this._wsServer;
            this.scheduleOnce(()=> wsServerForInside = this._wsServer,1);

            // @ts-expect-error
            this._wsServer.listen(8080, (err) => {
                 if (!err) {
                    console.log("server booted!");
                    respLabel.string = 'server booted!'
                 } else {
                    wsServerLabel.string = 'WebSocketServer: listen error'
                    respLabel.string = 'error when listen!'
                    console.log("error when listen:", err);
                 }
            });
            // @ts-expect-error
            this._wsServer.onconnection = function (conn) {
                
                
                // var arrayOfClients = this.wsServer.connections();
                // let tempVariable:unknown = arrayOfClients.length;
                // this.wsServerClientCountStatus.string = tempVariable as string;

                wsServerLabel.string = 'WebSocketServer: onconnection'
                
                respLabel.string = 'server is connected!';
                // @ts-expect-error
                conn.onmessage = function (data) {
                    wsServerLabel.string = 'WebSocketServer: onmessage'
                    // @ts-expect-error
                    conn.send(data, (err) => {
                        if (!err) {
                            console.log("server send success!");
                         } else {
                            console.log("error when send:", err);
                         }
                    });

                    const binary = new Uint8Array(data);
                    let binaryStr = 'response bin msg: ';

                    // console.log( " binary length is "+ binary.length);
                    let binaryLengthIndicateStr = ' binary length is ' + binary.length;
                    respLabelClientCount.string = binaryLengthIndicateStr;
        
                    let str = '0x';
                    let binaryStr_2 = 'response string msg of binary: ';
                    let str_2 = '  ';
                    const hexMap = '0123456789ABCDEF'.split('');
                    assert(hexMap.length == 16);
                    // for (let i = 0; i < binary.length; i++) 
                    // {
                    //     if(i==0)
                    //     {
                    //         console.log("str_2 adding start");
                    //     }
                    //     str_2 += String.fromCharCode(binary[i]);
                    // }

                    respLabelDebug.string = 'before hexmap binary processing';
                    for (let i = 0; i < binary.length; i++) 
                    {
                        if(i==0)
                        {
                            console.log("str adding start");
                        }
                        str += hexMap[binary[i] >> 4];
                        str += hexMap[binary[i] & 0x0F];
                        str_2 += String.fromCharCode(binary[i]);
                    }
        
                    binaryStr_2 += str_2;
                    respLabelSecond.string = binaryStr_2;

                    binaryStr += str;
                    respLabel.string = binaryStr;
                    
                    console.log(data, " data send!");

                    respLabelDebug.string = 'start get connection, is wsserverforinside null? ' + (wsServerForInside === null);
                    // respLabelDebug.string = 'start get connection, is wsserverforinside null? ' + (wsServerForInside ===  );
                    // any ..?
                    //var arrayOfClients = [1,2];
                    
                    // @ts-expect-error
                    respLabelDebug.string = 'is wsserverforinside type websocket?? ' + (wsServerForInside instanceof WebSocketServer) + '\n is wsserverforinside any? ' + (typeof wsServerForInside === "any");
                    // @ts-expect-error
                    var arrayOfClients :WebSocketServerConnection  = wsServerForInside.connections();
                    respLabelDebug.string = 'get connection no error';
                    var tempVariable: any = arrayOfClients.length;
                    respLabelDebug.string = 'set temp variable no error';
                    respLabelClientCount.string = tempVariable as string;
                    respLabelDebug.string = 'set client count status changed no error';
                }
                conn.onclose = function () {
                    console.log("connection gone!");
                };
            };

            this._wsServer.onclose = function () {
                wsServerLabel.string = 'WebSocketServer: onclose'
                respLabel.string = 'server is closed!';
                self._wsServer = null;
                console.log("server is closed!");
            }

            // setTimeout(() => {
            //     if (this._wsServer){
            //         this._wsServer.close();
            //     }
            // }, 25000); // 25 sec
    }

    onSendAnyTextButtonClickedToServer()
    {
        let websocketLabel = this.wsStatus.node.getParent()!.getComponent(Label)!;
        if (!this._wsiSendBinary) { return; }
        if (this._wsiSendBinary.readyState === WebSocket.OPEN){
            websocketLabel.string = 'WebSocket: send binary';
            // let buf = 'Hello WebSocket中文,\0 I\'m\0 a\0 binary\0 message\0.';
            let buf = 'Hello WebSocket, message from sending button';

            let arrData = new Uint16Array(buf.length);
            for (let i = 0; i < buf.length; i++) {
                arrData[i] = buf.charCodeAt(i);
            }

            this._wsiSendBinary.send(arrData.buffer);
        }
        else{
            let warningStr = 'send binary websocket instance wasn\'t ready...';
            websocketLabel.string = 'WebSocket: not ready';
            this.wsStatus.string = warningStr;
            // this.scheduleOnce(()=> {
            //     this.sendWebSocketBinary();
            // }, 1);
        }
    }
    onSendAnyTextButtonClickedToClient()
    {
        let websocketLabel = this.wsServerStatusSecond;
        if (!this.wsServer) { return; }
        // this.wsServer.


    }
    onTestTextButton()
    {

        const respLabelClientCount = this.wsServerClientCountStatus;
        

        let buf = 'Hello WebSocket, message from sending button';
        // [PreviewInEditor] 43 's state 
        // 0x48656C6C6F20576562536F636B65742C206D6573736167652066726F6D2073656E64696E6720627574746F6E
            let arrData = new Uint16Array(buf.length);
            for (let i = 0; i < buf.length; i++) {
                arrData[i] = buf.charCodeAt(i);
                console.log(arrData[i]);
            }
            const hexMap = '0123456789ABCDEF'.split('');
            console.log("hexmap is " + hexMap);
            assert(hexMap.length == 16);
            const binary = new Uint8Array(arrData);

            let str = '0x';
            let str_2 = ' ';

            console.log( " binary length is "+ binary.length);
            respLabelClientCount.string = 'asdf fdsa length ' + binary.length ;

            for (let i = 0; i < binary.length; i++) {
                console.log( i + " 's binary state " + binary[i]);
                str += hexMap[binary[i] >> 4];
                str += hexMap[binary[i] & 0x0F];
                console.log( i + " 's state " + str);
                str_2 += String.fromCharCode(binary[i]);
                // str += String.fromCharCode(parseInt(,16) );
                // str +=  String.fromCharCode(binary[i]);
             }
             // 16bit                                   72 101 108... 
             // right shift 4 + and operator with 0x0f  48 55 6C...
             // which means take only rightmost 4 bit after erase

             console.log("str_2 is " + str_2);
             this.wsServerStatusSecond.string = str_2;
    }


    onStartTest()
    {
        var arrayOfWebs: number[] = new Array();
        arrayOfWebs.push(1);
        arrayOfWebs.push(2);
        arrayOfWebs.push(3);
        var score1 = arrayOfWebs.length;
        let tempX: unknown = score1;
        let tempY: any = score1;
        
        if (typeof tempX ==="number")
        {
            console.log("temp x is number");
        }
        else
        {
            console.log("temp x is not number");
        }

        if (typeof tempY ==="number")
        {
            console.log("temp y is number");
        }
        else
        {
            console.log("temp y is not number");
        }
        if (typeof tempY ==="string")
        {
            console.log("temp y is string");
        }
        else
        {
            console.log("temp y is not string");
        }

        console.log("score 1 is " + score1);
        this.wsServerStatusSecond.string = tempX as string;

        var arrayOfName: string[] = ["1","2","3"];
        console.log(arrayOfName[0]);

    }




}

