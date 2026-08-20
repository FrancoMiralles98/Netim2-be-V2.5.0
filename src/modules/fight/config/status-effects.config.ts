import { StatusEffectsKeys } from "netim2-shared";
import { StatusEffectConfig } from "../services/resolvers/status-effect-application-resolver.types";

export const STATUS_EFFECTS_CONFIG: Record<StatusEffectsKeys | 'corta_curacion', StatusEffectConfig> = {
    veneno: {
        type: 'periodic_damage',
        effectId: 'veneno',
        baseDamageRatio: 0.10,
        resistible: false,
        duration: {
            baseTurns: 10,
            bonusTarget: ['bonus.daño.duracion_estado'],
            canStackDuration: true
        },
        healReduction: 0.3,
        damageBonusTarget: ['bonus.daño.bonus_veneno', 'bonus.daño.bonus_estado'],
    },
    incendio: { //balanceado
        type: 'periodic_damage',
        effectId: 'incendio',
        extraDamageRatioPerRefresh: 0.2,
        baseDamageRatio: 0.20,
        resistible: false,
        duration: {
            baseTurns: 7,
            canStackDuration: false,
            bonusTarget: ['bonus.daño.duracion_estado'],
        },
        damageBonusTarget: ['bonus.daño.bonus_fuego', 'bonus.daño.bonus_estado'],
    },
    sangrado: { //balanceado
        type: 'periodic_damage',
        effectId: 'sangrado',
        baseDamageRatio: 0.05,
        resistible: false,
        duration: {
            baseTurns: 7,
            canStackDuration: true,
            bonusTarget: ['bonus.daño.duracion_estado'],
        },
        damageBonusTarget: ['bonus.daño.bonus_sangrado', 'bonus.daño.bonus_estado'],
        damagePerMovementSpeedPoint: 1, //verificar para que se usa
        statsScaling: [{
            stat: 'vm',
            ratio: 0.3,
            target: 'general.vm',   
            power: 1.5
        }],
    },
    electrico: {
        type: 'periodic_damage',
        effectId: 'electrico',
        baseDamageRatio: 0.13,
        resistible: false,
        duration: {
            baseTurns: 13,
            canStackDuration: false,
            bonusTarget: ['bonus.daño.duracion_estado'],
        },
        damageBonusTarget: ['bonus.daño.bonus_estado','bonus.daño.bonus_electrico'],
        extraDamageRatioPerStackThreshold: 4.2,
        stacks: {
            initial: 1,
            max: 3,
            toApplyExtraDamage: 3
        }
    },
    desmayo: {
        type: 'control',
        resistible: true,
        duration: {
            baseTurns: 2,
            canStackDuration: false,
            bonusTarget: ['bonus.daño.duracion_estado'],
            maxTurns: 3
        }
    },
    retardo: {
        type: 'stat_modifier',
        resistible: true,
        duration: {
            baseTurns: 6,
            canStackDuration: false,
            bonusTarget: ['bonus.daño.duracion_estado'],
            maxTurns: 6
        },
        statsModifiers: [{
            bonusRefKey: 'vm',
            operation: 'flat',
            target: 'general.vm',
            value: -25
        },
        {
            bonusRefKey: 'vh',
            operation: 'flat',
            target: 'general.vh',
            value: -25
        },
        {
            bonusRefKey: 'va',
            operation: 'flat',
            target: 'general.va',
            value: -25
        }
        ]
    },
    corta_curacion: {
        resistible: false,
        duration: {
            baseTurns: 4,
            canStackDuration: false,
            bonusTarget: [],
        },
        type: 'healing_reduction',
        effectId: 'corta_curacion',
        reductionPercent: 0.5
    }
}