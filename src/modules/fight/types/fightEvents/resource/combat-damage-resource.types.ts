import { StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";

export type CombatDamageSource =
    | {
          type: 'basic_attack';
          sourceFighterId: string;
      }
    | {
          type: 'skill';
          sourceFighterId: string;
          skillId: UNIQUE_ID_SKILLS;
          componentIndex?: number;
      }
    | {
          type: 'status_effect';
          sourceFighterId: string;
          effectId: StatusEffectsKeys;
          effectInstanceId: string;
      }
    | {
          type: 'reflected';
          sourceFighterId: string;
          originalAttackerId: string;
      };