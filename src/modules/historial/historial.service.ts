import { Injectable } from '@nestjs/common';
import { HistorialRepository } from './repository/historial-respository';
import { HistorialDetalle, PartialHistorialDetalle } from './types/historial-detalle.type';
import { HistorialModel } from './schema/historial.schema';
import { DeleteResult } from 'mongoose';

@Injectable()
export class HistorialService {
    constructor(
        private historialRepository: HistorialRepository
    ) { }

    async getPartialsHistoriales(characterId: string): Promise<PartialHistorialDetalle[]> {
        const historiales = await this.historialRepository.getHistorialByCharacterId(characterId)
        return historiales.map(h => ({
            filtro: h.detalles.filtro,
            numeroDeBatalla: h.detalles.numeroDeBatalla,
            enemigo: h.detalles.enemigo,
            fecha: h.detalles.fecha,
            remainingReward: h.detalles.remainingReward,
        }))
    }

   /*  async saveHistorial(
        fightResult: any,
        filtro: HistorialDetalle['filtro'],
        characterId: string
    ): Promise<HistorialModel> {
        const historialDetails = this.createHistorialDetalle(fightResult, filtro)
        return await this.historialRepository.saveHistorial(historialDetails, characterId)
    } */

    async getHistorialesByCharacterId(characterId: string): Promise<HistorialModel[]> {
        return await this.historialRepository.getHistorialByCharacterId(characterId)
    }

    async getHistorialById(historialId: string): Promise<HistorialModel> {
        return await this.historialRepository.getHistorialById(historialId)
    }

    async getHistorialByFiltro(filtro: HistorialDetalle['filtro'], characterId: string): Promise<HistorialModel[]> {
        return await this.historialRepository.getHistorialByFiltro(filtro, characterId)
    }


    async deleteHistorialsByCharacterId(characterId: string): Promise<DeleteResult> {
        return await this.historialRepository.deleteHistorialByCharacterId(characterId)
    }

    async deleteHistorialById(historialId: string): Promise<HistorialModel> {
        return await this.historialRepository.deleteHistorialById(historialId)
    }

    /**
    * Crea una entrada de historial a partir del resultado de una pelea.
    *
    * Genera la información base necesaria para almacenar un combate en el
    * historial del personaje, incluyendo la fecha, el enemigo enfrentado,
    * el tipo de combate y el resultado completo de la batalla.
    *
    * Se asume que `initialAttacker` corresponde al personaje propietario
    * del historial, por lo que el enemigo se obtiene buscando el combatiente
    * cuyo nombre sea distinto al atacante inicial.
    *
    * @param fightResult Resultado completo de la pelea.
    * @param filtro Tipo de combate que se registrará en el historial (`pvm` o `pvp`).
    *
    * @returns Objeto de historial listo para ser persistido.
    *
    * @throws Si no es posible determinar quién fue el enemigo de la pelea.
    
    createHistorialDetalle(fightResult: FightResult, filtro: HistorialDetalle['filtro']): HistorialDetalle {
        //Se busca en los fighter el nombre del enemigo, sabiendo que el initialAttacker sera siempre el character
        const enemie = fightResult.fighters.find(fighter => fighter.nombre !== fightResult.initialAttacker)
    
        if (!enemie) {
            throw new Error('No se encuentra el nombre del enemigo para guardar en el historial')
        }
    
        return {
            fecha: Date.now(),
            enemigo: enemie.nombre,
            numeroDeBatalla: 1,
            remainingReward: false,
            fightResult,
            filtro
        }
    }
        */
}