import { Injectable } from "@nestjs/common";
import { DmgMitigationResolverService } from "./dmg-mitigation-resolver.service";
import { DamageResolutionResult } from "./damage-resolver.types";
import { ResolveDmgMitigationInput } from "./dmg-mitigation-resolver.types";

@Injectable()
export class DamageResolverService {
    constructor(
        private mitigationResolverService: DmgMitigationResolverService,
    ) { }

    resolve(input: ResolveDmgMitigationInput): DamageResolutionResult {
        const mitigationResult = this.mitigationResolverService.resolve(input)
        console.log(mitigationResult);
        
        const applicationResult = input.target.receiveDamage(mitigationResult.damageAfterMitigation)

        return {
            damageAfterMitigation: mitigationResult.damageAfterMitigation,
            effectiveDamage: applicationResult.effectiveDamage,
            hpAfter: applicationResult.hpAfter,
            hpBefore: applicationResult.hpBefore,
            mitigatedAmount: mitigationResult.mitigatedAmount,
            overkillDamage: applicationResult.overkill,
            requestedDamage: mitigationResult.requestedDamage
        }

    }
}