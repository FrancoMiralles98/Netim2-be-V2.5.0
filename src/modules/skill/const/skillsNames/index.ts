import { CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { CORPORAL_SKILLS_NAMES } from "./guerrero/corporal-skill-names.const";
import { DAGA_SKILLS_NAMES } from "./ninja/daga-skill-names.const";
import { DRAGON_SKILLS_NAMES } from "./chaman/dragon-skill-names.const";
import { ESPEJO_SKILL_NAMES } from "./sura/espejo-skill-names.const";
import { FLECHA_SKILLS_NAMES } from "./ninja/flecha-skill-names.const";
import { LUZ_SKILLS_NAMES } from "./chaman/luz-skill-names.const";
import { MAGIA_NEGRA_SKILLS_NAMES } from "./sura/magia-negra-skill-names.const";
import { MENTAL_SKILLS_NAMES } from "./guerrero/mental-skill-names.const";
import { SkillsNames } from "../../types/skills-names.type";

export const ALL_SKILLS_NAMES: Record<CharacterSpeciality, SkillsNames> = {
    Corporal: { ...CORPORAL_SKILLS_NAMES },
    Daga: { ...DAGA_SKILLS_NAMES },
    Dragon: { ...DRAGON_SKILLS_NAMES },
    Espejo: { ...ESPEJO_SKILL_NAMES },
    Flecha: { ...FLECHA_SKILLS_NAMES },
    Luz: { ...LUZ_SKILLS_NAMES },
    MagiaNegra: { ...MAGIA_NEGRA_SKILLS_NAMES },
    Mental: { ...MENTAL_SKILLS_NAMES }
}