import axios from "axios";
import { common } from "./common.js";

const baseUrl = "http://127.0.0.1:60001/api/v1/in"

export async function getTenantByCode(tenantCode) {
    return axios.get(`${baseUrl}/tenants/${tenantCode}`)
        .then(common.handleSuccess)
        .catch(common.handleError)
}