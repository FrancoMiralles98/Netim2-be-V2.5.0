import { Injectable } from "@nestjs/common";
import { CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { SharedSkillService } from "./shared-skill.service";

@Injectable()
export class AuraSkillService {

    constructor(
        private sharedSkillService: SharedSkillService
    ) { }

    
}