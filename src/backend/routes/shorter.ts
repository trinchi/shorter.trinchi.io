import {Request, Response, Router} from "express";
import express from "express";
import bodyParser from "body-parser";
import createError from "http-errors";
import {body, validationResult} from "express-validator";
import {NextHandleFunction} from "connect";
import * as helper from "./helper";
import {UrlDto} from "../model/UrlDto";
import {ShorterResponseJson} from "../model/ShorterResponseJson";
import {DefaultShorter} from "../model/DefaultShorter";
import {FirestoreService} from "../services/FirestoreService";

const ROUTER: Router = express.Router();
const JSON_PARSER: NextHandleFunction = bodyParser.json();
const SHORTER: Shorter = new DefaultShorter();

// POST body validator
function validatePost(): any[] {
    return [
        body('url').exists({checkNull: true}).isString()
    ]
}

ROUTER.post('/', JSON_PARSER, validatePost(), async (req: Request, res: Response, next) => {
    if (!validationResult(req).isEmpty()) {
        return next(createError(400));
    }

    let urlDto: UrlDto = helper.requestToUrlDto(req);

    let shortUrl: string;
    do {
        shortUrl = SHORTER.shorten(urlDto.url);
    } while (!FirestoreService.shortIsUnique(shortUrl));

    await FirestoreService.addShortUrl(shortUrl, urlDto);
    urlDto = await FirestoreService.getShortUrl(shortUrl);

    const STATUS_CODE = 201;
    const HTTP_HOST = helper.getHttpHostFromRequest(req) + "/" + shortUrl;

    const response = new ShorterResponseJson();
    response.status = STATUS_CODE;
    response.message = {
        "shortUrl": shortUrl,
        "data": urlDto
    };

    res.status(STATUS_CODE).location(HTTP_HOST).json(response);
});

ROUTER.get('/:shortUrl', async (req: Request, res: Response, next) => {
    const shortUrl: string = req.params.shortUrl;
    let urlDto: UrlDto;

    try {
        urlDto = await FirestoreService.getShortUrl(shortUrl);
    } catch (e) {
        return next(e);
    }

    const STATUS_CODE = 201;

    const response = new ShorterResponseJson();
    response.status = STATUS_CODE;
    response.message = {
        "shortUrl": shortUrl,
        "data": urlDto
    };

    res.json(response);
});

export default ROUTER;
