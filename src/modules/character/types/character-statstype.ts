import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"

/**
 * @description - Nombre de todas las especialidades de las razas
 */
export type CharacterSpeciality =
    'MagiaNegra' |
    'Espejo' |
    'Corporal' |
    'Mental' |
    'Daga' |
    'Flecha' |
    'Luz' |
    'Dragon' |
    ''

export type CharacterRace =
    'chaman' |
    'ninja' |
    'guerrero' |
    'sura'

export type CharacterAttribute = Extract<BonusRefKeys, 'VIT'| 'INT'| 'STR'| 'DEX'>
