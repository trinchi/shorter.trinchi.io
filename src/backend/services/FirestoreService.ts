import {FirebaseInitializer} from "./FirebaseInitializer";
import {UrlDto} from "../model/UrlDto";
import * as admin from "firebase-admin";

export class FirestoreService {

    private static db: admin.firestore.Firestore;
    private static urlsCollection: admin.firestore.CollectionReference;

    // initialize firestore
    static initialize() {
        this.db = FirebaseInitializer.getFirestore();
        this.urlsCollection = FirestoreService.db.collection('urls');
    }

    static async getUrlsCollections(): Promise<any> {
        const snapshot = await this.urlsCollection.get();
        return snapshot.docs.reduce((map, doc) => {
            map[doc.id] = doc.data();
            return map
        }, {});
    }

    static async getShortUrl(shortUrl: string): Promise<UrlDto> {
        const doc = await this.urlsCollection.doc(shortUrl).get();
        if (!doc.exists) {
            throw new Error("Short URL does not exist")
        } else {
            return this.documentToUrlDto(doc);
        }
    }

    static async addShortUrl(shortUrl: string, data: UrlDto): Promise<void> {
        const doc = await this.urlsCollection.doc(shortUrl);
        await doc.create({
            createDate: admin.firestore.FieldValue.serverTimestamp(),
            modDate: admin.firestore.FieldValue.serverTimestamp(),
            url: data.url
        });
    }

    static async updateShortUrl(shortUrl: string, data: UrlDto): Promise<void> {
        const doc = await this.urlsCollection.doc(shortUrl);
        await doc.update({
            modDate: admin.firestore.FieldValue.serverTimestamp(),
            url: data.url
        });
    }

    static async shortIsUnique(shortUrl: string) {
        const doc = await this.urlsCollection.doc(shortUrl).get();
        return doc.exists
    }

    private static documentToUrlDto(doc: admin.firestore.DocumentSnapshot): UrlDto {
        const urlDto: UrlDto = new UrlDto();
        const docData = doc.data();
        urlDto.createDate = docData.createDate;
        urlDto.modDate = docData.modDate;
        urlDto.url = docData.url;

        return urlDto;
    }
}
