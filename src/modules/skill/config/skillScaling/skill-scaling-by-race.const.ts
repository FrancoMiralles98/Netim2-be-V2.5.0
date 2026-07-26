import { CharacterRace } from "src/modules/character/types/baseCharacterProps/character-stats.type"
import { CHAMAN_SKILLS_SCALING } from "./chaman-skills-scaling.const"
import { GUERRERO_SKILLS_SCALING } from "./guerrero-skills-scaling.const"
import { NINJA_SKILLS_SCALING } from "./ninja-skills-scaling.const"
import { SURA_SKILLS_SCALING } from "./sura-skills-scaling.const"
import { StructureSkillScaling } from "../../types/structureSkillScaling.types"

export const SKILL_SCALING_BY_RACE_CONFIG: Record<CharacterRace, StructureSkillScaling> = {
    chaman: CHAMAN_SKILLS_SCALING,
    guerrero: GUERRERO_SKILLS_SCALING,
    ninja: NINJA_SKILLS_SCALING,
    sura: SURA_SKILLS_SCALING
}