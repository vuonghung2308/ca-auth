import { BAD_REQUEST, METHOD_NOT_ALLOWED }
    from "../constants/HttpStatus.js";
import appRootPath from "app-root-path";
import fs from "fs"
import { error } from "../utils/result.js"

var errorList = {};
fs.readFile(
    `${appRootPath}/errors.json`,
    'utf8', (err, data) => {
        if (err) throw err;
        errorList = JSON.parse(data);
    }
);

export function handleException(data, _, __, next) {
    if (data instanceof Error) {
        next(error.exception(data));
    } else next(data);
}

export function handleResult(data, req, res, _) {
    const environment = process.env.CA_AUTH_ENVIRONMENT;

    if (environment === "pro" &&
        data.status === METHOD_NOT_ALLOWED
    ) { data = error.urlNotFound(req.path); }

    let { lang } = req.headers; lang = lang || "vi";
    let statusCode = data.status || BAD_REQUEST;
    let errorCode = data.code || "UNKNOWN_ERROR";
    const err = errorList.find(value =>
        value.errorCode === errorCode
    )
    let result = {};
    if (statusCode > 299) {
        let description = undefined;
        if (err && err.description) {
            if (err.description.vi && lang === "vi") {
                description = err.description.vi;
            }
            if (err.description.en && lang === "en") {
                description = err.description.en;
            }
        }
        result = {
            code: errorCode,
            description: description
        };
        if (environment === "dev") {
            result["errors"] = data.errors;
        }
        if (errorCode === "UNKNOWN_ERROR") {
            console.error(data)
        }
    } else { result = data.data; }
    res.status(statusCode).send(result);
}

export function handleNotFound(req, _, next) {
    return next(error.urlNotFound(req.path))
}