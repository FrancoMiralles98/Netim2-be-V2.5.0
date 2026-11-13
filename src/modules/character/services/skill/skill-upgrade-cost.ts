import type { CharacterPersistence, SkillType, SkillUpgradeCost } from 'netim2-shared';
import { SKILL_UPGRADE_BOOK_BY_ID, SKILL_UPGRADE_GRAND_MASTER_MATERIAL, SKILL_UPGRADE_QUANTITY_BY_MASTERY } from '../../config/skill-upgrade-cost.config';

export function resolveSkillUpgradeCost(skill: Pick<SkillType, 'id' | 'mastery' | 'lv'>): SkillUpgradeCost | null {
    if (skill.mastery === 'P') return null;
    if (skill.mastery === 'N') {
        return { type: 'skill_points', amount: SKILL_UPGRADE_QUANTITY_BY_MASTERY.N() };
    }
    const idItem = skill.mastery === 'M' ? SKILL_UPGRADE_BOOK_BY_ID[skill.id] : SKILL_UPGRADE_GRAND_MASTER_MATERIAL;
    const amount = SKILL_UPGRADE_QUANTITY_BY_MASTERY[skill.mastery](skill.lv);
    if (idItem === undefined || !Number.isSafeInteger(amount) || amount < 1) return null;
    return { type: 'materials', items: [{ idItem, amount }] };
}

export function hasSkillUpgradeResources(character: CharacterPersistence, cost: SkillUpgradeCost): boolean {
    if (cost.type === 'skill_points') return character.puntos_habilidad >= cost.amount;
    const required = new Map<CharacterPersistence['inventario'][number]['idItem'], number>();
    for (const item of cost.items) required.set(item.idItem, (required.get(item.idItem) ?? 0) + item.amount);
    return [...required].every(([idItem, amount]) => {
        const owned = character.inventario.filter(item => item.idItem === idItem)
            .reduce((sum, item) => sum + ('cantidad' in item ? item.cantidad : 1), 0);
        return owned >= amount;
    });
}
