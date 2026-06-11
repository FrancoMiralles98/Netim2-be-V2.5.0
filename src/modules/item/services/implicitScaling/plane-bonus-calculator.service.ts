import { Injectable } from "@nestjs/common";
import { PatternScaleType, UpgradeLv } from "../../types/config/general-implicit.type";
import { PATTERN_SCALE_CONFIG } from "../../config/scaling/general-pattern-scale.config";

@Injectable()
export class PlaneBonusCalculator {

    calculatePlaneBonus(
        upgradeLv: UpgradeLv,
        patternScale: PatternScaleType,
    ): number {
        let value = PATTERN_SCALE_CONFIG[patternScale][upgradeLv]
        if (value === undefined) {
            throw new Error(`No se encuentra el patron para ${patternScale} del upgrade ${upgradeLv}`)
        }

        return value
    }
}