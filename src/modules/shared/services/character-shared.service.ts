import { Injectable } from "@nestjs/common";
import { BonusRefKeys, CharacterStats } from "netim2-shared";

@Injectable()
export class CharacterSharedService {
    getCharacterStatValue(
        stats: CharacterStats,
        refKey: BonusRefKeys
    ): unknown {
        const groups: Record<string, unknown>[] = [
            stats.atributos,
            stats.general,
            stats.bonus.daño,
            stats.bonus.defensa,
            stats.bonus.cc,
            stats.bonus.miscs,
        ];

        for (const group of groups) {
            if (Object.prototype.hasOwnProperty.call(group, refKey)) {
                return group[refKey];
            }
        }

        throw new Error(`No existe una estadística con la referencia "${refKey}"`);
    }
}