export interface HitStatistics {
    attempted: number;
    successful: number;
    missed: number;
    dodged: number; //ataques que has esquivado

    critical: number;
    penetrating: number;

    doubleHitsTriggered: number;
}