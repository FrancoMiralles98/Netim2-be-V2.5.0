import { IsIn, IsString } from 'class-validator';
import type { GetMobsByUbicationRequest, UbicationNames } from 'netim2-shared';

// El contrato compartido es un union type; este mapa permite validarlo en ejecución.
const UBICATIONS: Record<UbicationNames, true> = {
    city1: true, city2: true, valle: true, desierto: true, montaña: true,
    templo: true, mazmorra_monos: true, cueva_araña: true, torre_demoniaca: true,
};

export class GetMobsByUbicationDto implements GetMobsByUbicationRequest {
    @IsString()
    @IsIn(Object.keys(UBICATIONS))
    ubication!: UbicationNames;
}
