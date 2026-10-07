import { IdMob } from "netim2-shared"

export interface FightVsMobInput {
    mobs: FightMobDetails[]
    characterId: string,
    userId: string
}

export interface FightMobDetails {
    mobId: IdMob,
    quantity: number;
}