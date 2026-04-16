import { CharacterAttribute } from "src/modules/character/types/character-statstype";
import { SkillBonusEffectKeys } from "./damage-skill.type";

export interface SkillDamageEscalado {
    escaladoMain: {min: number,max: number}; 
    escaladoLv: SkillScalingLv 
    escaladoAtributos: Partial<Record<CharacterAttribute,number>>;
    escaladoEfecto: Record<SkillBonusEffectKeys,SkillScalingEffect>
    escaladoBonusDamage: boolean;
}

export interface SkillScalingLv {
    perLv: number,
    basicMulti: number,
    masterMulti: number,
    granMasterMulti: number,
    perfectMulti: number
}

export interface SkillScalingEffect {
    base:number,perLv:number
}


export interface SkillAuraEscalado {
    escaladoAtributos: Partial<Record<CharacterAttribute,number>>; //es el % del atributo, es poco porque despues se usa como multiplicativo
    escaladoBuffos: EscaladoBuffos
}

export type EscaladoBuffos =  SkillScalingLv & {
    scaleWithAtribute: boolean;
}