import { binBodies } from "../../veriables";
import { postRequest, deleteRequest, getRequest, putRequest } from "../commonFunctions/commonFunctions";

export async function postBin(headerParams: object, binBody: object) {
    const res = await postRequest('b', headerParams, binBody);
    return res;
}
export async function deleteBin(headerParams: object, binId: string) {
    const res = await deleteRequest('b/' + binId, headerParams);
    return res;
}
export async function getBin(headerParams: object, binId: string) {
    const res = await getRequest('b/' + binId, headerParams);
    return res;
}
export async function putBin(headerParams: object, binId: string, binBody?: object) {
    const res = await putRequest('b/' + binId, headerParams, binBody);
    return res;
}
