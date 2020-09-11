import {UrlDto} from "../model/UrlDto";

export function requestToUrlDto(req: any): UrlDto {
    const urlDto: UrlDto = new UrlDto();
    urlDto.url = req.body.url;

    return urlDto;
}

export function getHttpHostFromRequest(req: any): string {
    return req.protocol + '://' + req.get('host');
}
