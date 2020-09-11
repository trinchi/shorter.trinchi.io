import * as admin from "firebase-admin";
import {FirestoreService} from "./FirestoreService";

export class FirebaseInitializer {

    private static firestore: admin.firestore.Firestore;

    static async initialize() {
        const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const DATABASE_URL = process.env.DATABASE_URL;

        // check if firebase credentials are set in enviroment
        if (!GOOGLE_APPLICATION_CREDENTIALS || !DATABASE_URL) {
            throw new Error("Google Firebase credentials missing");
        }

        const GOOGLE_APP_CREDENTIALS = await this.importGoogleAppCredentials(GOOGLE_APPLICATION_CREDENTIALS);

        admin.initializeApp({
            credential: admin.credential.cert(GOOGLE_APP_CREDENTIALS),
            databaseURL: DATABASE_URL
        });

        this.firestore = admin.firestore();
        FirestoreService.initialize();
    }

    private static async importGoogleAppCredentials(path: string): Promise<object> {
        return await import(path);
    }

    static getFirestore(): admin.firestore.Firestore {
        return this.firestore;
    }

}
