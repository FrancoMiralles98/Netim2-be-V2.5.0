export interface FightEventBase<TType extends string> {
    type: TType;

    /**
     * Identificador único del evento.
     */
    eventId: string;

    fightId: string;

    /**
     * Turno global en el que ocurrió.
     * Para fight_started puede valer 0.
     */
    turnNumber: number;
}