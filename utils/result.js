import { BAD_REQUEST, CREATED, INTERNAL_SERVER, METHOD_NOT_ALLOWED, NOT_FOUND, OK, UNAUTHORIZED }
    from "../constants/HttpStatus.js"

const actionNotAllowed = () => {
    return {
        status: UNAUTHORIZED,
        code: "NOT_ALLOWED",
        errors: [{
            param: "token.role",
            location: "header",
        }]
    }
};

const methodNotAllowed = () => {
    return {
        status: METHOD_NOT_ALLOWED,
        code: "METHOD_NOT_ALLOWED",
        errors: [{
            location: "method",
            value: method,
            msg: `method not allowed`
        }],
    };
}

const urlNotFound = (path) => {
    return {
        status: NOT_FOUND,
        code: "URL_NOT_FOUND",
        errors: [{
            location: "path",
            value: path,
            msg: "the url was not found"
        }]
    }
}

const notFound = (
    { location, param, value, msg }
) => {
    const _location = location || "param"
    const _param = param || "id"
    return {
        status: NOT_FOUND, code: "NOT_FOUND",
        errors: [{
            location: _location, param: _param,
            value: value, msg: msg
        }],
    }
}

const invalidData = (
    { location, param, value, msg }
) => {
    const _location = location || "body"
    return {
        status: BAD_REQUEST, code: "INVALID_DATA",
        errors: [{
            location: _location, param: param,
            value: value, msg: msg
        }],
    }
}

const exception = (error) => {
    let stack = error.stack.split("\n");
    stack = stack.map(s => s.trim());
    return {
        status: INTERNAL_SERVER,
        code: "INTERNAL_SERVER_ERROR",
        errors: [{
            location: error.name,
            msg: error.message,
            value: stack
        }],
    }
}

const service = (path) => {
    return {
        status: INTERNAL_SERVER,
        code: "INTERNAL_SERVER_ERROR",
        errors: [{
            location: "url", value: path,
            msg: "there was a problem with internal service"
        }],
    }
}

const created = (data) => ({ status: CREATED, data })
const ok = (data) => ({ status: OK, data })

export const error = {
    notFound, invalidData,
    exception, urlNotFound,
    service, methodNotAllowed,
    actionNotAllowed
}

export const success = {
    ok, created
}