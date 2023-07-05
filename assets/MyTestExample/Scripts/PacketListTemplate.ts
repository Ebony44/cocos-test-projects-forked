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


    public static CutOffSize(adjustedSize: number, paramBuffer: ByteBuffer)
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


}


export class PKMaker
{
    public static GetString(paramBuffer :ByteBuffer) : [number,string]
    {
        let result:[number,string] = [0,''];
        return result;
    }
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
