import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashSharedService {
    private SALT_ROUNDS = 10

    async hashText(text: string): Promise<string> {
        return bcrypt.hash(text, this.SALT_ROUNDS)
    }

    async compareText(plainText: string, hashedText:string): Promise<boolean> {
        return bcrypt.compare(plainText,hashedText)
    }
}