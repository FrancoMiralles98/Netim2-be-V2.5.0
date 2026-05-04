export const randomNumberInRange = (min: number, max: number, decimal?:boolean): number => {
    const value = Math.random() * (max - min + 1) + min
    return decimal ? value : Math.floor(value)
}