//Para el manejo de la duraciond de las auras y de los efectos de estados
export interface createActiveDurationProps {
    type: 'turns' | 'until_no_mana';
    initialTurns?: number;
    remainingTurns?: number;
}