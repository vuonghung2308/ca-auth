import { INTERNAL_SERVER } from "../constants/HttpStatus.js";

const handleSuccess = (data) => {
    return {
        status: data.status,
        data: data.data
    }
}

const handleError = (error) => {
    if (error.response) {
        const path = error.request.path;
        return {
            status: error.response.status,
            data: error.response.data, path
        }
    } else {
        const path = error.request._options.path;
        return { status: INTERNAL_SERVER, path }
    }
}

export const common = {
    handleError,
    handleSuccess
}