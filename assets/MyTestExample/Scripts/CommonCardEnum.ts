import { SpriteFrame } from "cc";

export interface CardInfo{
    cardType : ECardType,
    cardNumber : number,
}

export interface CardFrontVisualSet{
    cardNumber : SpriteFrame,
    cardSmallType : SpriteFrame,
    cardBigType : SpriteFrame,
}

export enum ECardType {
    Back = 0,
    Clover = 1,
    Diamond = 2,
    Heart = 3,
    Spade = 4
}

//




