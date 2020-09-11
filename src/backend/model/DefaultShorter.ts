export class DefaultShorter implements Shorter {
    private _characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private readonly _DEFAULT_LENGTH = 5;

    shorten(input: string): string {
        return this.createRandomString();
    }

    private createRandomString(stringLength: number = this._DEFAULT_LENGTH): string {
        let output = "";

        for (let i = 0; i < stringLength; i++) {
            output += this._characters.charAt(Math.floor(Math.random() * this._characters.length));
        }

        return output;
    }
}
