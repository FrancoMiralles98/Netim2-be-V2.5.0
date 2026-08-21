import { FighterCombatStatisticsState } from "../types/statistics/fighter-combat-statistics.type";

export const createEmptyFighterCombatStatisticsState =
    (): FighterCombatStatisticsState => ({
        damage: {
            dealt: {
                byDamageType: { ad: 0, ap: 0, true: 0 },
                byDelivery: { direct: 0, periodic: 0, reflected: 0 },
                bySkill: {},
                bySource: { basicAttack: 0, reflected: 0, skills: 0, statusEffects: 0 },
                byStatusEffect: {},
                total: 0
            },
            mitigated: {
                byDamageType: { ad: 0, ap: 0, true: 0 },
                byStatusEffect: {},
                total: 0
            }
        },
        healing: {
            byBasicAttack: 0,
            bySkill: [],
            hpRegenerated: 0,
            prevented: 0,
        },
        resources: {
            manaSpent: 0,
            manaRegenerated: 0,
            manaDrained: 0,
            manaRestored: 0,
        },
        actions: {
            turnsPlayed: 0,
            basicAttacksUsed: 0,
            skillsUsed: 0,
            skippedTurns: 0,
            skippedByStun: 0
        },
        hits: {
            attempted: 0,
            successful: 0,
            missed: 0,
            blocked: 0,
            reflected: 0,
            critical: 0,
            penetrating: 0,
            doubleHitsTriggered: 0,
            dodged: 0
        },
        effects: {
            appliedByType: {},
            receivedByType: {},
            resistedByType: {}
        }
    });
