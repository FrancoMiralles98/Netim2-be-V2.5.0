export interface HitStatistics {
    attempted: number;
    successful: number;
    missed: number;
    dodged: number; //ataques que has esquivado
    blocked: number; //ataques que has bloqueado
    reflected: number; //ataques que has reflectado
    critical: number;
    penetrating: number;

    doubleHitsTriggered: number;
}