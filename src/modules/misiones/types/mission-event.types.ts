import type { IdItemList, IdMobList, MissionAction } from 'netim2-shared';
import type { EnemyType } from '../../mob/types/mobProps/enemie-type.type';
import type { UbicationNames } from '../../gameData/types/ubication-names.type';

export type MissionEvent =
    | { type: 'hunt'; mobId: IdMobList; enemyType?: EnemyType; zone?: UbicationNames; quantity: number }
    | { type: 'collect'; itemId: IdItemList; quantity: number }
    | { type: 'action'; action: MissionAction & { level?: number }; quantity?: number };
