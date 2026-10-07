import { CORPORAL_SKILLS } from "./guerrero/corporal-skills.const";
import { DAGA_SKILLS } from "./ninja/daga-skills.const";
import { DRAGON_SKILLS } from "./chaman/dragon-skills.const";
import { ESPEJO_SKILLS } from "./sura/espejo-skills.const";
import { FLECHA_SKILLS } from "./ninja/flecha-skills.const";
import { LUZ_SKILLS } from "./chaman/luz-skills.const";
import { MAGIA_NEGRA_SKILLS } from "./sura/magia-negra-skills.const";
import { MENTAL_SKILLS } from "./guerrero/mental-skills.const";
import { SkillSummary } from "../../types/summary-skills.types";
import { CharacterSpeciality } from "netim2-shared";

export const ALL_SKILLS: Record<CharacterSpeciality, SkillSummary[]> = {
    Corporal: { ...CORPORAL_SKILLS },
    Daga: { ...DAGA_SKILLS },
    Dragon: { ...DRAGON_SKILLS },
    Espejo: { ...ESPEJO_SKILLS },
    Flecha: { ...FLECHA_SKILLS },
    Luz: { ...LUZ_SKILLS },
    MagiaNegra: { ...MAGIA_NEGRA_SKILLS },
    Mental: { ...MENTAL_SKILLS },
}