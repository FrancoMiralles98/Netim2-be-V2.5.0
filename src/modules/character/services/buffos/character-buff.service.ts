import { Injectable } from "@nestjs/common";
import { AppliedBuffos } from "netim2-shared";

@Injectable()
export class CharacterBuffService {
    /** buff_duration está en segundos; buff_inicialization es un timestamp en milisegundos. */
    removeExpiredBuffs(buffos: AppliedBuffos[]): AppliedBuffos[] {
        const now = Date.now();
        return buffos.filter(buff => now < buff.buff_inicialization + buff.buff_duration * 1000);
    }
}
