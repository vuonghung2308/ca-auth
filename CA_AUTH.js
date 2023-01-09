import express, { urlencoded } from 'express';
import mongoose from "mongoose";
import myLogger from "./winstonLog/winston.js";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/external/AuthRoutes.js'
import UserRoutes from './routes/external/UserRoutes.js'
import InternalServiceRoutes from './routes/internal/InternalRoutes.js'
import { handleException, handleNotFound, handleResult } from "./middleware/ResultHandler.js"
import { verifyToken } from "./middleware/Authentication.js"

function setupRouters(app) {
    app.use("/api/v1/in/users", InternalServiceRoutes);
    app.use("/api/v1/auth", AuthRoutes);
    app.use("/api/v1/users", verifyToken, UserRoutes);
}

function createApplication() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser());
    setupRouters(app);
    app.use(handleNotFound);
    app.use(handleException);
    app.use(handleResult);
    return app
}

function connectMongoDb(onSuccess) {
    const host1 = process.env.CA_AUTH_MONGO_HOST_1;
    const port1 = process.env.CA_AUTH_MONGO_PORT_1;
    const host2 = process.env.CA_AUTH_MONGO_HOST_2;
    const port2 = process.env.CA_AUTH_MONGO_PORT_2;
    const host3 = process.env.CA_AUTH_MONGO_HOST_3;
    const port3 = process.env.CA_AUTH_MONGO_PORT_3;

    const username = process.env.CA_AUTH_MONGO_USERNAME;
    const password = process.env.CA_AUTH_MONGO_PASSWORD;
    const authSource = process.env.CA_AUTH_MONGO_AUTHOR_SOURCE;
    const dbName = process.env.CA_AUTH_MONGO_DB_NAME;

    const url = `${host1}:${port1},${host2}:${port2},${host3}:${port3}`
    const uri = `mongodb://${username}:${password}@${url}/${dbName}`
        + `?retryWrites=false&w=majority&authSource=${authSource}`
        + `&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`
        + `&authMechanism=SCRAM-SHA-256`;

    mongoose.connect(
        uri, { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                myLogger.info("%o", err)
            } else {
                myLogger.info("Connected to database")
                onSuccess()
            }
        }
    )
}

function main() {
    dotenv.config();
    const host = process.env.CA_AUTH_HOST_NAME;
    const port = process.env.CA_AUTH_PORT_NUMBER;

    const callback = () => {
        myLogger.info('Listening on: %s:%d', host, port);
    }
    connectMongoDb(() => {
        const app = createApplication()
        app.listen(port, host, callback)
    })
}

main()