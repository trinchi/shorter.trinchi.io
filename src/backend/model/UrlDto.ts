export class UrlDto {
    createDate: Date;
    modDate: Date;
    url: string;
    userId: string;

    constructor() {
        this.createDate = new Date();
        this.modDate = new Date();
    }
}
