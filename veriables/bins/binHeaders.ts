import { nameGen } from "../../utilities";

export function headerCreateBin(secretKey: string, collectionId?: string, binName?: string, privateStatus: boolean = true) {
    let newBinName = nameGen(binName);
    let header = {
        "Content-Type": "application/json",
        "secret-key": secretKey,
        "collection-id": collectionId,
        "private": privateStatus,
        "name": newBinName
    }
    return header;
}

export function headerUpdateBin(secretKey: string, versioning?: boolean){
    let header = {
        "Content-Type": "application/json",
        "secret-key": secretKey,
        "versioning": versioning        
    }
    return header;
}