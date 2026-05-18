import { Injectable } from "@nestjs/common";
import { FightSkillService } from "./fight-skill.service";

@Injectable()
export class DamageService {
    constructor(
        private skillService: FightSkillService
    ){}

}