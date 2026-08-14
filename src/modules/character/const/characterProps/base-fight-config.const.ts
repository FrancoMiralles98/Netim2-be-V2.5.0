import { FightConfig } from "netim2-shared";

export const BASE_FIGHT_CONFIG: FightConfig = {
    allies: {},
    enemies: {
        focus: true,
        selector: 'less_max_hp'
    },
    self: {
        HealingSkillHpThresholdPercent: 60,
        priorityBassicAttack: false,
        reactiveAuras: true,
        skillPriority: [
            'more_damage',
            'more_cd',
            'less_damage',
            'control',
            'has_periodicDamage',
            'less_cd',
            'stat_modifier'
        ]
    }
}