import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import type { HistorialDetalle } from 'netim2-shared';

export class HistorialCharacterParamsDto {
    @IsMongoId()
    characterId!: string;
}

export class HistorialDetailParamsDto extends HistorialCharacterParamsDto {
    @IsMongoId()
    historialId!: string;
}

export class GetPartialsHistorialesQueryDto {
    @IsOptional()
    @IsIn(['pvm', 'pvp'])
    filtro?: HistorialDetalle['filtro'];
}
