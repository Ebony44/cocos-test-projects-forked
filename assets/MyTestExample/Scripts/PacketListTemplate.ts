export class ByteBuffer
{
    // public int _nPos;
    // public int _nAddPos;
    // public byte[] _ArrayByte;
    // public int MAX_BUFFER_SIZE = NETWORK_DEFINE.MAX_BUFFER_LENGTH;

    _nPos: number; 
    _nAddPos: number;
    _ArrayByte: Uint8Array;
    static MAX_BUFFER_SIZE: number = 32768; // 32768

    constructor(_nPos:number, _nAddPos: number, _ArrayByte: Uint8Array,MAX_BUFFER_SIZE: number)
    {
        this._nPos = _nPos;
        this._nAddPos = _nAddPos;
        this._ArrayByte = _ArrayByte;
        // this.MAX_BUFFER_SIZE = MAX_BUFFER_SIZE;
    }

    public static ToByte(byte1: number) : number
    {
        return +byte1;
    }
    public static FromByte(paramNumber: number) : number
    {
        return paramNumber;
    }

    public static ToShort(byte1: number, byte2: number) : number
    {
        return (byte2 << 8) + byte1;
    }
    public static FromShort(paramNumber: number) : [number,number]
    {
        // return [paramNumber >> 8, paramNumber & 255];
        return [paramNumber & 255,paramNumber >> 8];
        // return (byte2 << 8) + byte1;
        
    }
    // public static FromByte(paramNumber: number) : number
    // {
    //     // return paramString.toint >> 4;
    //     return paramNumber >> 4;
    // }

    public static ToInt(byte1: number, byte2: number, byte3: number, byte4: number) : number
    {
        // return (byte2 << 8) + byte1;
        // return (byte4 << 24)+ (byte3 << 16)+ (byte2 << 8) + byte1;
        return (byte4 << 24)+ (byte3 << 16)+ (byte2 << 8) + byte1;
        
    }

    public static ToIntWithBytes(paramBytes:Uint8Array, startIndex:number):number
    {
        if(startIndex+3 >= paramBytes.length)
        {
            console.log('length is less than or equal to your parameter index, length ' + paramBytes.length);
            return -1;
        }
        return this.ToInt(paramBytes[startIndex+0],
            paramBytes[startIndex+1],
            paramBytes[startIndex+2],
            paramBytes[startIndex+3]);
    }

    public static FromInt(paramNumber: number) : [number,number,number,number]
    {
        
        // return [paramNumber & 255,paramNumber >> 8];
        let first = paramNumber & 255;
        let second = (paramNumber >> 8) & 255;
        let third = (paramNumber >> 16) & 255;
        let fourth = paramNumber >> 24;

        //  return [paramNumber & 16777215,
        //     paramNumber & 65535,
        //     paramNumber & 255 ,
        //     paramNumber >> 24];

        return [first,
            second,
            third,
            fourth];
        // return [fourth,
        //     third,
        //     second,
        //     first];

        
        
    }

    public static toString(paramArray:Uint8Array,startIndex:number, stringLength:number) : string
    {
        let result:string = '';
        if(paramArray.length < stringLength)
        {
            console.log('error, string length exceed param array length');
        }
        for (let i = startIndex; i < stringLength; i++) 
        {
            result += String.fromCharCode(paramArray[i]);
        }
        return result;
    }
    public static fromString(paramString:string) : Uint8Array
    {
        let currentLength = paramString.length;
        // let tempArray : Array<number> = new Array(currentLength);
        let tempArray : Uint8Array = new Uint8Array(currentLength);
        for (let i = 0; i < currentLength; i++) 
        {
            tempArray[i] = paramString.charCodeAt(i);
        }
        return tempArray;
    }


    public static AdjustSize(adjustedSize: number, paramBuffer: ByteBuffer)
    {
        let tempArray = new Uint8Array(adjustedSize);
        for (let i = 0; i < tempArray.length; i++) 
        {
            tempArray[i] = paramBuffer._ArrayByte[i];
        }
        paramBuffer._ArrayByte = tempArray;
    }

    public static GetBasicInfoFromServer(paramArray :Int8Array ) : [number,number,number]
    {
        let result:[number,number,number] = [0,0,0];
        if(paramArray.length != 12)
        {
            console.log('[GetBasicInfoFromServer], param array length is not 12');
        }
        let periodIndex: number = 0;
        
        for (let i = 0; i < 12; i+=4) 
        {
            // let periodIndexMod:number = periodIndex*4;
            let first = paramArray[i];
            let second = paramArray[i + 1];
            let third = paramArray[i + 2];
            let fourth = paramArray[i + 3];
            result[periodIndex] = this.ToInt(first,second,third,fourth);
            periodIndex++;
            //let first:number = paramArray[i+periodIndexMod];
            //let first:number = paramArray[i+periodIndexMod];
            //let first:number = paramArray[i+periodIndexMod];
            //let first:number = paramArray[i+periodIndexMod];

            //this.ToInt()
        }
        // result = [12,12,12];
        return result;
    }
    // public static GetInt
    public static GetString(paramArray :Uint8Array) : [number,string]
    {
        // short(string length info)
        // string(contents)
        let result:[number,string] = [0,''];
        if(paramArray.length != 12)
        {
            console.log('[GetBasicInfoFromServer], param array length is not 12');
        }
        let periodIndex: number = 0;
        

        for (let i = 0; i < 2; ++i)
        {
            // get first info(string length)
            paramArray[i]
        }

        for (let i = 0; i < 8; i+=4)
        {
            // let periodIndexMod:number = periodIndex*4;
            let first = paramArray[i];
            let second = paramArray[i + 1];
            let third = paramArray[i + 2];
            let fourth = paramArray[i + 3];
            result[periodIndex] = this.ToInt(first,second,third,fourth);
            periodIndex++;
            //let first:number = paramArray[i+periodIndexMod];
            //let first:number = paramArray[i+periodIndexMod];
            //let first:number = paramArray[i+periodIndexMod];
            //let first:number = paramArray[i+periodIndexMod];

            //this.ToInt()
        }
        // result = [12,12,12];
        return result;

    }

    //#region get methods for external uses
    public getInt():number
    {
        let nValue:number = 0;
        if(this._nAddPos < this._nPos + 4)
        {
            return nValue;
        }
        let first = this._ArrayByte[this._nPos];
        let second = this._ArrayByte[this._nPos + 1];
        let third = this._ArrayByte[this._nPos + 2];
        let fourth = this._ArrayByte[this._nPos + 3];
        nValue = ByteBuffer.ToInt(first,second,third,fourth);
        

        this._nPos += 4;
        return nValue;
    }
    public getShort():number
    {
        let nValue:number = 0;
        if(this._nAddPos < this._nPos + 2)
        {
            return nValue;
        }
        let first = this._ArrayByte[this._nPos];
        let second = this._ArrayByte[this._nPos + 1];
        nValue = ByteBuffer.ToShort(first,second);
        

        this._nPos += 2;
        return nValue;
    }
    public getByte():number
    {
        let nValue:number = 0;
        if(this._nAddPos < this._nPos + 2)
        {
            return nValue;
        }
        let first = this._ArrayByte[this._nPos];
        // let second = this._ArrayByte[this._nPos + 1];
        nValue = ByteBuffer.ToByte(first);
        

        this._nPos += 1;
        return nValue;
    }

    public get(paramArray:Uint8Array, offset:number, arrayLength:number ) : void
    {
        // let result:string = '';
        if ( this._nAddPos < this._nPos + offset + arrayLength )
        {
            // console.log('error, string length exceed param array length');
        }
        for (let i = 0; i < arrayLength; i++) 
        {
            paramArray[i] = this._ArrayByte[this._nPos];
            this._nPos++;
        }
        // return result;
    }

    //

    // src is byte
    public putByte(src:number) 
    {
        if(this._nAddPos + 1 > ByteBuffer.MAX_BUFFER_SIZE)
        {
            return;
        }
        this._ArrayByte[this._nAddPos] = src;
        this._nAddPos++;
    }

    // src is short
    public putShort(src:number) 
    {
        if(this._nAddPos + 2 > ByteBuffer.MAX_BUFFER_SIZE)
        {
            return;
        }
        let tempBuffer = ByteBuffer.FromShort(src);
        this._ArrayByte[this._nAddPos] = tempBuffer[0];
        this._nAddPos++;

        this._ArrayByte[this._nAddPos] = tempBuffer[1];
        this._nAddPos++;
    }

    // src is int
    public putInt(src:number) 
    {
        if(this._nAddPos + 4 > ByteBuffer.MAX_BUFFER_SIZE)
        {
            return;
        }
        let tempBuffer = ByteBuffer.FromInt(src);
        this._ArrayByte[this._nAddPos] = tempBuffer[0];
        this._nAddPos++;

        this._ArrayByte[this._nAddPos] = tempBuffer[1];
        this._nAddPos++;
        
        this._ArrayByte[this._nAddPos] = tempBuffer[2];
        this._nAddPos++;

        this._ArrayByte[this._nAddPos] = tempBuffer[3];
        this._nAddPos++;
    }

    // src is string, list(vector)...etc which need size as parameter
    public putStringOrList(paramArray:Array<any>, offset: number, length: number)
    {
        let currentLength = paramArray.length;
        if(currentLength == 0)
        {
            return;
        }
        if(currentLength < offset+length)
        {
            return;
        }
        if(length+this._nAddPos > ByteBuffer.MAX_BUFFER_SIZE)
        {
            return;
        }

    }

    public put(paramArray:Uint8Array)
    {
        let currentLength = paramArray.length;
        // if()
        for (let i = 0; i < currentLength; i++) 
        {
            this._ArrayByte[this._nAddPos] = paramArray[i];
            this._nAddPos++;
        }

    }

    //#endregion

}


export class PKMaker
{
    public static GetByte(paramBuffer :ByteBuffer) : number
    {
        let nValue:number = 0;
        nValue = paramBuffer.getByte();
        return nValue;
    }

    public static GetShort(paramBuffer :ByteBuffer) : number
    {
        let nValue:number = 0;
        nValue = paramBuffer.getShort();
        return nValue;
    }

    public static GetInt(paramBuffer :ByteBuffer) : number
    {
        let nValue:number = 0;
        nValue = paramBuffer.getInt();
        return nValue;
    }


    public static GetStringWithLength(paramBuffer :ByteBuffer) : [number,string]
    {
        let result:[number,string] = [0,''];

        let stringLength = paramBuffer.getShort(); // +2 addnpos
        let tempArray = new Uint8Array(stringLength);
        paramBuffer.get(tempArray,0,stringLength); // + stringlength addnpos

        result[0] = stringLength;
        result[1] = ByteBuffer.toString(tempArray,0,stringLength);

        // ByteBuffer.toString(tempArray,0,)


        return result;
    }
    public static GetString(paramBuffer :ByteBuffer) : string
    {
        return this.GetStringWithLength(paramBuffer)[1];
    }

    public static GetList(paramBuffer:ByteBuffer)
    {

    }

    public static GetTotalSizeFromBytes(paramBytes:Uint8Array) : number
    {
        // from header bytes
        let totalSize:number = 0;
        // totalSize =  ByteBuffer.ToIntWithByes(paramBytes);
        totalSize =  ByteBuffer.ToInt(paramBytes[4],paramBytes[5],paramBytes[6],paramBytes[7]);
        return totalSize;
    }

    //

    public static MakeByte(paramBuffer:ByteBuffer, nByte:number) : void
    {
        paramBuffer.putByte(nByte);
    }
    public static MakeShort(paramBuffer:ByteBuffer, nShort:number) : void
    {
        paramBuffer.putShort(nShort);
        // paramBuffer.
    }
    public static MakeInt(paramBuffer:ByteBuffer, nInt:number) : void
    {
        paramBuffer.putInt(nInt);
    }
    public static MakeString(paramBuffer:ByteBuffer, szText:string) : void
    {
        //length is 2 + stringLength
        // length of string + string length
        let tempArray = ByteBuffer.fromString(szText);
        let currentSize = szText.length;
        paramBuffer.putShort(currentSize);
        paramBuffer.put(tempArray);

        // ByteBuffer.GetString()
        // paramBuffer.putInt(nInt);
    }

    public static MakeHeader(paramBuffer:ByteBuffer, encryptNumber:number, totalLength:number) : void
    {
        // length is 4 + 4
        // encryptnumber + total length of packets
        paramBuffer.putInt(encryptNumber);
        paramBuffer.putInt(totalLength);
    }

    public static SetAddPos(paramBuffer:ByteBuffer, setValue: number)
    {
        paramBuffer._nAddPos = setValue;
    }
    // public static setNPos(paramBuffer:ByteBuffer, setValue: number)
    // {
    //     paramBuffer._nPos = setValue;
    // }


}


export class stUserBase
{
    nSerial: number;
    szID: string;
    
    constructor(nSerial:number, szID: string)
    {
        this.nSerial = nSerial;
        this.szID = szID;
    }

    public set(paramBuffer:ByteBuffer): void
    {
        this.nSerial = PKMaker.GetByte(paramBuffer);
        this.szID = PKMaker.GetString(paramBuffer);
    }
    public get(paramBuffer:ByteBuffer) : void
    {
        PKMaker.MakeByte(paramBuffer,this.nSerial);
        PKMaker.MakeString(paramBuffer,this.szID);
    }
    public clear() : void
    {
        this.nSerial = 0;
        this.szID = '';
    }

}

export class stCardBase
{
    // public nSerial: number = 0;
    // Interfaces are by their nature public, and therefore can only have public members, so they are not accepting private/protected etc. 

    // public int		nNO;
	// 	public int		nTYPE;
	// 	public int		nIDX;
	// 	public int		nHIGHLIGHT;

    nNo:number;
    nType:number;
    nIDX:number;
    nHIGHLIGHT:number

    constructor(nNo:number, nType:number,nIDX:number,nHIGHLIGHT:number)
    {
        this.nNo = nNo;
        this.nType = nType;
        this.nIDX = nIDX;
        this.nHIGHLIGHT = nHIGHLIGHT;
    }
    
}
