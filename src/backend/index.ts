import {Request, Response, Application} from "express";
import express from "express";
import dotenv from "dotenv";
import api from "./routes/api";
import {FirebaseInitializer} from "./services/FirebaseInitializer";
import {UrlDto} from "./model/UrlDto";
import {FirestoreService} from "./services/FirestoreService";

// load .env variables
dotenv.config();
const SERVER_PORT: string | number = process.env.SERVER_PORT || 8080;

// wait for firebase to be initialized
FirebaseInitializer.initialize().then(() => {

    // initialize express
    const APP: Application = express();

    // testing endpoint
    APP.get('/', (req: Request, res: Response) => {
        res.send("FOO");
    });

    APP.listen(SERVER_PORT, () => {
        // tslint:disable-next-line:no-console
        console.log(`server started at http://localhost:${SERVER_PORT}`);
    });

    APP.use('/api', api);

    // redirect to url behind shortUrl
    APP.get('/:shortUrl', async (req: Request, res: Response, next) => {
        const shortUrl: string = req.params.shortUrl;
        let urlDto: UrlDto;

        try {
            urlDto = await FirestoreService.getShortUrl(shortUrl);
        } catch (e) {
            return next(e);
        }

        const STATUS_CODE = 303;
        res.redirect(STATUS_CODE, urlDto.url);
    });
});

