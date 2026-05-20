export const DAMAGE_EFFECTS_CONFIG = {
    veneno: {
        porcent_base_damage: 13,
        corta_cura: 30,
        turns: 10
    },
    incendio: {
        porcent_base_damage: 20,
        extra_porcent_base_dmg: 10,
        turns: 5,
    },
    sangrado: {
        porcent_base_damage: 8,
        extra_porcent_base_dmg_per_vm: 0.3,
        turns: 7
    },
}

export const CC_EFFECTS_CONFIG = {
    retardo: {
        va: 25,
        vm: 50,
        vh: 25,
        turns: 6
    },
    desmayo: {
        turns: 2
    },
}

export const BONUS_EEFECTS_CONFIG = {
    penetracion: {
        reduction_bonus_def: 50,
        reduction_flat_def: 50
    }
}