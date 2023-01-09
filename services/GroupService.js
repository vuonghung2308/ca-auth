import axios from "axios";
import { common } from "./common.js";

const baseUrl = "http://127.0.0.1:30001/api/v1/in"

export async function findUserWithKey(tenant, key) {
    return axios.get(
        `${baseUrl}/groups/find-user`,
        { params: { tenant, key } }
    ).then(common.handleSuccess)
        .catch(common.handleError)
}

// not used
export async function getGroupOfUsers(tenant, ids) {
    return axios.post(
        `${baseUrl}/groups/group-of`,
        { ids: ids },
        { params: { tenant: tenant } }
    ).then(common.handleSuccess)
        .catch(common.handleError)
}