
export interface DropDifficultyConfig {
    attempts: { min: number, max: number },
    resultChances: {
        nothing: number,
        yang: number,
        item: number
    },
    bonusItemLv: { min: number, max: number },
}