import { _decorator, Component, Label, assert,EditBox } from 'cc';
import { NATIVE } from 'cc/env';
import { ByteBuffer, PKMaker } from './PacketListTemplate';
import { Editbox } from '../../auto-test-case/dynamic/ui/editbox.test';
const { ccclass, property } = _decorator;

 // declare var WebSocketServer : any
// declare var require : any

@ccclass('NetworkWebSocketClientOnly')
export class NetworkWebSocketClientOnly extends Component {

    @property({type: Label})
    public wsStatus: Label = null!;

    @property({type: Label})
    public ws: Label = null!;
    
    @property({type: Label})
    public wsStatusString: Label = null!;

    @property({type: Label})
    public wsServerStatusString: Label = null!;

    @property({type: Label})
    public wsTargetIPAndPort: Label = null!;



    // @property({type: Label})
    // public wsServer: Label = null!;




    private  _wsiSendBinary: WebSocket | null = null;
    // @ts-expect-error
    private  _wsServer: WebSocketServer | null = null; // only for native usage
    
    start() {
        
        // if ( NATIVE &&  typeof WebSocketServer !== "undefined") 
        if ( true) 
        {
            console.log("inside of if condition");

            this._wsiSendBinary = null;
            this.wsStatus.string = 'waiting..';
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

         // this.onTestTextButton();

         //let tempBuffer = new ByteBuffer(0,0,new Uint8Array(32768),32768);
         //this.makeString(tempBuffer,'draste02');
         this.testIntConverting();

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

    onClickWebSocket()
    {
        let paramURL = '';
        if(this.wsTargetIPAndPort.string === '')
        {
            console.log('ip and port are empty');
            // ws://61.38.80.78:51234/ws
            paramURL = 'ws://61.38.80.78:51234/ws';
            // return;
        }
        this.prepareWebSocket(paramURL);
    }

    prepareWebSocket (paramString:string) {
        const self = this;
        const websocketLabel = this.ws;
        const respLabel = this.wsStatus;
        const respToStringLabel = this.wsStatusString;
        const respServerStatus = this.wsServerStatusString;

        

        //let domainOfConnection = 'ws://localhost:9090/ws';
        //this._wsiSendBinary = new WebSocket('ws://localhost:9090/ws', []);
        
        // ws://61.38.80.78:51234
        // let domainOfConnection = 'ws://61.38.80.78:51234/ws';
        // this._wsiSendBinary = new WebSocket('ws://61.38.80.78:51234/ws', []);

        let domainOfConnection = this.wsTargetIPAndPort.string;
        if(paramString != '')
        {
            domainOfConnection = paramString;
        }
        else
        {
            console.log('param url is empty');
        }
        this._wsiSendBinary = new WebSocket(domainOfConnection, []);
        const tempWebSocketClient = this._wsiSendBinary;

        respServerStatus.string = domainOfConnection;
        console.log('domain is ' + domainOfConnection);

        // const tempWebSocket = this._wsiSendBinary;
        // console.log("is assigned websocket loose null? " + (tempWebSocket == null));
        // console.log("is assigned websocket strict null? " + (tempWebSocket === null));

        this._wsiSendBinary.binaryType = 'arraybuffer';
        this._wsiSendBinary.onopen = function (evt) {
            respLabel.string = 'Opened!';
            websocketLabel.string = 'WebSocket: onopen'
        };

        this._wsiSendBinary.onmessage = function (evt) {
            console.log('[onmessage] message received from server');
            // MessageEvent
            let receiveMessageAsAB = evt.data as ArrayBuffer;
            let tempVariable = evt.data as string;
            // let tempVariable = evt.data as string;
            
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
            // let createdBuffer = new Uint8Array(receiveMessage.byteLength);

            let createdBufferFromAB = new Uint8Array(receiveMessageAsAB);
            console.log(createdBufferFromAB);
            let createdBuffer = new Int8Array(tempVariable.length);
            
            for (let i = 0; i < createdBuffer.length; i++)
            {

                // createdBuffer[i] = ByteBuffer.FromByte(tempVariable.charCodeAt(i));
                createdBuffer[i] = tempVariable.charCodeAt(i);
                
                // COMMENT for data........
                // console.log(i + ' item value ' + createdBuffer[i]);
                // console.log(tempVariable.charAt(i));

                // tempVariable[i]
            }

            // process packet with bytebuffer
            createdBufferFromAB = new Uint8Array(createdBuffer);
            let testByteBuffer: ByteBuffer = new ByteBuffer(0,0,createdBufferFromAB,tempVariable.length);
            let currentPacketNumber = self.testProcessPacket(testByteBuffer,tempVariable.length);
            respToStringLabel.string = currentPacketNumber.toString();


            // receiveMessage
            // console.log('event data string is ' + evt.data as string);
            
            // encrypt number + total length + packet number(protocol)
            let headerAndTotalLengthInfo:[number,number,number] = ByteBuffer.GetBasicInfoFromServer(createdBuffer);


            console.log('event data string is ' + receiveMessageAsAB
            + ' buffer length is ' + createdBuffer.length);

        };

        //#region add listener
        // Event
        this._wsiSendBinary.addEventListener("error",
        (event) => 
        {
            // console.error("WebSocket error:", event.);
        });
        //#endregion
        this._wsiSendBinary.onerror = function (evt) {
        console.log('there is error, ' + evt.bubbles
        +  ' evt is  ' + evt);
WebSocket
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

        // this.scheduleOnce(this.sendWebSocketBinary, 1);
    }

    testProcessPacket(paramBuffer:ByteBuffer, packetTotalLength:number) : number
    {
        // int -> int -> int
        // byte -> byte -> string -> string
        paramBuffer._nAddPos += packetTotalLength;
        let encryptNumber = PKMaker.GetInt(paramBuffer);
        let totalLength = PKMaker.GetInt(paramBuffer);
        let packetNumber = PKMaker.GetInt(paramBuffer);

        let byMessageForm = PKMaker.GetByte(paramBuffer);
        let bySkip = PKMaker.GetByte(paramBuffer);
        let szTitle = PKMaker.GetString(paramBuffer);
        let szMessage = PKMaker.GetString(paramBuffer);


        // after that, every data are zero... yet
        // byte -> string -> string -> byte -> byte -> string -> string
        let byokButtonAction = PKMaker.GetByte(paramBuffer);
        let szNextScene = PKMaker.GetString(paramBuffer);
        let szOpenUrl = PKMaker.GetString(paramBuffer);
        let byDisconnect = PKMaker.GetByte(paramBuffer);
        let byCloseSec = PKMaker.GetByte(paramBuffer);
        let szJackpot_Photo = PKMaker.GetString(paramBuffer);
        let szJackpot_Message = PKMaker.GetString(paramBuffer);

        return packetNumber;


    }


    // sendWebSocketBinary () {
    //     let websocketLabel = this.wsStatus.node.getParent()!.getComponent(Label)!;
    //     if (!this._wsiSendBinary) { return; }
    //     if (this._wsiSendBinary.readyState === WebSocket.OPEN)
    //     {
    //         websocketLabel.string = 'WebSocket: send binary';
    //         let buf = 'Hello WebSocket...!,\0 I\'m\0 a\0 binary\0 message\0.';
    //         // utf-16 16 byte
    //         // ascii 4 byte
    //         // unicode 8 byte
            

    //         //let arrData = new Uint16Array(buf.length);
    //         // let arrData = new Uint8Array(buf.length + 8);
    //         let arrData = new Uint8Array(buf.length);
            
    //         // for (let i = 8; i < buf.length; i++) 
    //         for (let i = 0; i < buf.length; i++) 
    //         {
    //             arrData[i] = buf.charCodeAt(i);
    //         }

    //         // for (let i = 0; i < 4; i++) 
    //         // {
    //         //     arrData[i] = 0;
    //         // }
    //         // for (let i = 4; i < 8; i++) 
    //         // {
    //         //     // arrData[i] = buf.length;
    //         // }
            
    //         //#region 
    //         // let sendingBuffer:ByteBuffer = new ByteBuffer(0,0,new Uint8Array(ByteBuffer.MAX_BUFFER_SIZE),ByteBuffer.MAX_BUFFER_SIZE);
    //         let sendingBuffer:ByteBuffer = 
    //             new ByteBuffer(0,0,new Uint8Array(buf.length),buf.length);
    //         this.makeString(sendingBuffer,buf);
    //         //#endregion
    //         // this._wsiSendBinary.send(sendingBuffer._ArrayByte.buffer);
    //         this._wsiSendBinary.send(sendingBuffer._ArrayByte);


    //         // this._wsiSendBinary.send(arrData.buffer);

    //     }
    //     else{
    //         let warningStr = 'send binary websocket instance wasn\'t ready...';
    //         websocketLabel.string = 'WebSocket: not ready';
    //         this.wsStatus.string = warningStr;
    //         this.scheduleOnce(()=> {
    //             this.sendWebSocketBinary();
    //         }, 1);
    //     }
    // }

    onSendAnyTextButtonClicked()
    {
        
        let websocketLabel = this.wsStatus.node.getParent()!.getComponent(Label)!;
        if (!this._wsiSendBinary) { return; }
        if (this._wsiSendBinary.readyState === WebSocket.OPEN)
        {
            websocketLabel.string = 'WebSocket: send binary';
            // let buf = 'Hello WebSocket中文,\0 I\'m\0 a\0 binary\0 message\0.';
            let buf = 'Hello WebSocketServer, message from sending button';

            let totalLength = 8 + 2 + buf.length;
            let arrData = new Uint8Array(buf.length);
            
            let sendingByteBuffer = new ByteBuffer(0,0,new Uint8Array(totalLength),totalLength);

            let currentBuffer = sendingByteBuffer._ArrayByte;

            // for (let i = 0; i < buf.length; i++) 
            // {
            //     arrData[i] = buf.charCodeAt(i);
            // }

            for (let i = 0; i < 4; i++) 
            {
                currentBuffer[i] = 0;
                sendingByteBuffer._nAddPos++;

            }
            sendingByteBuffer._nPos = sendingByteBuffer._nAddPos;
            this.makeFullLength(sendingByteBuffer,totalLength);
            this.makeString(sendingByteBuffer,buf);
            // for (let i = 4; i < 8; i++) 
            // {
                
            // }


            // this._wsiSendBinary.send(arrData.buffer);
            // this._wsiSendBinary.send(sendingByteBuffer._ArrayByte.buffer);
            this._wsiSendBinary.send(sendingByteBuffer._ArrayByte);
            // this._wsiSendBinary.send(buf);
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

    onSendAnyNumberAndStringClicked()
    {
        let websocketLabel = this.wsStatus.node.getParent()!.getComponent(Label)!;
        if (!this._wsiSendBinary) { return; }
        if (this._wsiSendBinary.readyState === WebSocket.OPEN)
        {
            websocketLabel.string = 'WebSocket: send binary';
            // let buf = 'Hello WebSocket中文,\0 I\'m\0 a\0 binary\0 message\0.';
            let buf = 'User ID';

            let firstData = 3000; // price
            let secondData = 'item desc'; // description
            let thirdData = 50; // sale value

            
            // header length = 8

            // first data length = 4
            // second data length = secondData.length + 2
            // third data length = 4
            let totalLength = 8 + 4 + (secondData.length + 2) + 4;
            let arrData = new Uint8Array(buf.length);
            
            let sendingByteBuffer = new ByteBuffer(0,0,new Uint8Array(totalLength),totalLength);
            
            PKMaker.MakeHeader(sendingByteBuffer,0,totalLength);
            PKMaker.MakeInt(sendingByteBuffer, firstData);
            PKMaker.MakeString(sendingByteBuffer,secondData);
            PKMaker.MakeInt(sendingByteBuffer, thirdData);

            // sendingByteBuffer._nPos = sendingByteBuffer._nAddPos;
            // this.makeFullLength(sendingByteBuffer,totalLength);
            // this.makeString(sendingByteBuffer,buf);
            
            this._wsiSendBinary.send(sendingByteBuffer._ArrayByte);

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

    onTestTextButton()
    {
        // let buf = 'Hello WebSocket, message from sending button';

        let buf = 'draste02';

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
            console.log('buf is ' + buf);
            for (let i = 0; i < binary.length; i++) 
            {
                console.log( i + " 's binary state " + binary[i]);
                str += hexMap[binary[i] >> 4];
                str += hexMap[binary[i] & 0x0F];
                console.log( i + " 's state " + str);
                str_2 += String.fromCharCode(binary[i]);
                // str += String.fromCharCode(parseInt(,16) );
                // str +=  String.fromCharCode(binary[i]);
             }
             
             // console.log(str_2);

             // this.wsServerStatusSecond.string = str_2;

             // uint8 which from client, send to server testing

             let arrData_2 = new Uint8Array(buf.length + 8);
             for (let i = 0; i < buf.length; i++) 
             {
                

             }



    }

    onClickPrepare()
    {
        // this.prepareWebSocket();
    }

    makeString(bBuffer: ByteBuffer, szText: string )
    {
        // write into bBuffer
        // size of 
        // let tempBinary = new Uint8Array(szText.length + 2);

        let stringLength: number = szText.length;
        let [byte1,byte2]:[number,number] = ByteBuffer.FromShort(stringLength);

        // write down length of data to buffer
        bBuffer._ArrayByte[bBuffer._nAddPos] = byte1;
        bBuffer._nAddPos++;
        bBuffer._ArrayByte[bBuffer._nAddPos] = byte2;
        bBuffer._nAddPos++;
        // write down end

        let tempBinary = new Uint8Array(szText.length + 2);
        for (let i = 0; i < szText.length; i++) 
        {
            tempBinary[i] = szText.charCodeAt(i);
            console.log( '[makeString] data length of ' +i+ ' \'s value is ' + tempBinary[i]);
        }
        // write down data to buffer
        // for (let i = bBuffer._nAddPos; i < endLength; i++) 
        for (let i = 0; i < szText.length; i++) 
        {
            bBuffer._ArrayByte[bBuffer._nAddPos] = szText.charCodeAt(i);
            console.log('[makeString] data of ' + i + ' \'s value is ' + bBuffer._ArrayByte[i]
            + ' sztext is ' + szText[i] );
            bBuffer._nAddPos++;
        }
        // write down end

        console.log('[makeString] data of buffer ' + bBuffer._ArrayByte.buffer);
        // for (let i = 0; i < tempBinary.length; i++) 
        // {
        //     console.log('[makeString] data of ' + i + ' \'s value is ' + bBuffer._ArrayByte[i]);

        //     // console.log('[makeString] data of buffer ' + i + ' \'s value is ' + bBuffer._ArrayByte.buffer);

        //     //bBuffer._ArrayByte[bBuffer._nAddPos] = szText.charCodeAt(i);
        //     //bBuffer._nAddPos++;
        // }

        console.log('[makeString] addpos is ' + bBuffer._nAddPos);

    }

    makeFullLength(bBuffer: ByteBuffer, dataFullLength: number)
    {

        // write into bBuffer
        
        // let dataFullLength: number = szText.length;
        let [byte1,byte2,byte3,byte4]:[number,number,number,number] = ByteBuffer.FromInt(dataFullLength);

        // write down length of data to buffer
        bBuffer._ArrayByte[bBuffer._nAddPos] = byte1;
        bBuffer._nAddPos++;
        bBuffer._ArrayByte[bBuffer._nAddPos] = byte2;
        bBuffer._nAddPos++;
        bBuffer._ArrayByte[bBuffer._nAddPos] = byte3;
        bBuffer._nAddPos++;
        bBuffer._ArrayByte[bBuffer._nAddPos] = byte4;
        bBuffer._nAddPos++;
        // write down end

        let tempBinary = new Uint8Array(4);
        // for (let i = 0; i < tempBinary.length; i++) 
        // {
        //     // tempBinary[i] = szText.charCodeAt(i);
        //     console.log( '[makeString] data length of ' +i+ ' \'s value is ' + tempBinary[i]);
        // }

        for (let i = bBuffer._nAddPos - 4; i < bBuffer._ArrayByte.length; i++) 
        {
            // tempBinary[i] = szText.charCodeAt(i);
            console.log( '[makeString] data length of ' +i+ ' \'s value is ' + bBuffer._ArrayByte[i]);
        }

        console.log('[makeString] addpos is ' + bBuffer._nAddPos);
    }

    testIntConverting()
    {
        let tempByte = ByteBuffer.FromInt(1234);
        for (let index = 0; index < tempByte.length; index++) {

            console.log('temp byte ' + index + ' \'s value ' + tempByte[index]);
        }

        let tempInt = ByteBuffer.ToInt(tempByte[0],
            tempByte[1],
            tempByte[2],
            tempByte[3]
        );

        console.log('temp int is ' + tempInt);

        let tempInt_2 = ByteBuffer.ToInt(209,
            90,
            2,
            0
        );
        console.log('temp int 2 is ' + tempInt_2);

        let tempInt_3 = ByteBuffer.ToInt(
            184,
            11,
            0,
            0
        );
        console.log('temp int 3 is ' + tempInt_3);



    }

    getStringFromServer(paramBuffer: Uint8Array): string
    {
        let resultString = '';
        let stringLength = ByteBuffer.ToShort(paramBuffer[0],paramBuffer[1]);
        // for (let i = 2; i < stringLength; i++) {
        //     resultString[i] = String.fromCharCode(paramBuffer[i]);
            
        // }




        return resultString;
    }
    getIntFromServer()
    {

    }

    onClickCloseClient()
    {
        this._wsiSendBinary?.close();
    }


}

