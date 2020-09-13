import { send } from "process";
import { agent as request } from "supertest";
import { environment, headerUpdateBin } from "../../veriables/";

const baseUrl = environment.baseUrl;

export async function postRequest(apiUrl: string, headerParams: object, body?: object) {
    const res = await request(baseUrl)
        .post(apiUrl)
        .set(headerParams)
        .send(body);
    return res;
}

export async function deleteRequest(apiUrl: string, headerParams: object) {
    const res = await request(baseUrl)
        .delete(apiUrl)
        .set(headerParams);
    return res;
}

export async function getRequest(apiUrl: string, headerParams: object, body?: object) {
    const res = await request(baseUrl)
        .get(apiUrl)
        .set(headerParams)
        .send(body);
    return res
}

export async function putRequest(apiUrl: string, headerParams: object, body?: object) {
    const res = await request(baseUrl)
        .put(apiUrl)
        .set(headerParams)
        .send(body);
    return res
}