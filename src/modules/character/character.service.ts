import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CharacterRepository } from './repository/character-repository';
import { CreateCharacterDto } from './dto/create-character.dto';
import { CharacterMapper } from './mapper/character-mapper';
import { CharacterDocument } from './schema/character.schema';
import { AppliedBuffos, Atributos, CharacterPersistence, CharacterPersistenceWithId, CharacterRace, CharacterSpeciality, CharacterSummary, EquipType, IdItem, Stats } from 'netim2-shared';
import { UserService } from '../user/user.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UpdatedStatsResult, UpdateStatsService } from './services/stats/update-stats.service';
import { CharacterBuffService } from './services/buffos/character-buff.service';
import { ATTRIBUTE_BASE_BY_RACE } from './const/statsProgress/attribute-base-by-race.const';
import { ITEM_LIST } from '../item/const/items.const';
import { ItemService } from '../item/item.service';

@Injectable()
export class CharacterService {
    constructor(
        private characterRepository: CharacterRepository,
        private characterMapper: CharacterMapper,
        private userService: UserService,
        private characterBuffService: CharacterBuffService,
        private itemService: ItemService,
        private updateStatsService: UpdateStatsService,
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    updateStatsAndAtributtes(
        stats: Stats,
        race: CharacterRace,
        equipment: EquipType[],
        attributes: Atributos,
        buffs: AppliedBuffos[],
        level: number,
        speciality?: CharacterSpeciality): UpdatedStatsResult {
        const updatedBuffos = this.characterBuffService.removeExpiredBuffs(buffs)
        return this.updateStatsService.updateStats(stats, race, equipment, attributes, updatedBuffos, level, speciality)
    }

    async validateCharacterOwnership(characterId: string, accountId: string): Promise<boolean> {
        const character = await this.characterRepository.getCharacterById(characterId)
        return character.user_owner === accountId
    }

    async getCharacterById(characterId: string, userId: string): Promise<CharacterPersistenceWithId> {
        try {

            const character = await this.characterRepository.getCharacterById(characterId)

            if (character.user_owner !== userId) {
                throw new ConflictException('No puedes conectarte con este personaje.')
            }

            const equipSelected = this.selecteEquip(character.equipo_1,
                character.equipo_2,
                character.equipo_3,
                character.equipo_selected)

            const { attributes, stats } = this.updateStatsAndAtributtes(
                character.stats,
                character.raza,
                equipSelected,
                character.atributos,
                character.buffos,
                character.lv,
                character.especialidad
            )

            character.inventario = character.inventario.map(i => this.itemService.getUpdatedInventoryItem(i))


            character.stats = stats
            character.atributos = attributes

            return { ...this.characterMapper.fromDb(character), id: character._id.toString() }
        } catch (error) {
            console.log('error al seleccionar', error);
            throw new Error('error')
        }
    }

    async getCharactersByUserId(userId: string): Promise<CharacterDocument[]> {
        return await this.characterRepository.getCharacterByUserId(userId)
    }

    async deleteCharacter(userId: string, characterId: string) {
        const character = await this.characterRepository.getCharacterById(characterId)
        if (!character) {
            throw new NotFoundException('No se encuentra el personaje a eliminar.')
        }
        if (character.user_owner !== userId) {
            throw new ConflictException('No tienes permiso para eliminar este personaje.')
        }
        await this.characterRepository.deleteCharacterById(characterId)
    }

    /**
    * Crea un personaje para una cuenta autenticada.
    *
    * Si la cuenta todavía no tiene un reino asignado, utiliza el reino recibido
    * en el DTO y lo asigna a la cuenta antes de crear el personaje.
    *
    * Si la cuenta ya tiene un reino, valida que el reino recibido coincida con el
    * reino de la cuenta y crea el personaje usando siempre el reino final de la
    * cuenta.
    *
    * @param dto Datos necesarios para crear el personaje.
    * @param userId Identificador de la cuenta propietaria del personaje.
    *
    * @returns Objeto con el resumen del personaje creado.
    *
    */
    async createCharacter(
        dto: CreateCharacterDto,
        userId: string,
    ): Promise<{ character: CharacterSummary }> {
        try {
            const user = (await this.userService.getUserById(userId)).toPrimitives();

            const reinoFinal = user.reino ?? dto.reino;

            if (!reinoFinal) {
                throw new BadRequestException('Debes seleccionar un reino para crear el personaje.');
            }

            if (user.reino && dto.reino && user.reino !== dto.reino) {
                throw new BadRequestException('El reino seleccionado no coincide con el reino de la cuenta.');
            }

            if (!user.reino) {
                await this.userService.asignReinoToAccount(userId, reinoFinal);
            }

            const baseCharacter = this.characterMapper.createCharacterToPersistence({
                ...dto,
                reino: reinoFinal,
            });

            const espada = ITEM_LIST.find(i => i.idItem === IdItem.ESPADA) as EquipType
            const daga = ITEM_LIST.find(i => i.idItem === IdItem.DAGA)
            const armor = ITEM_LIST.find(i => i.idItem === IdItem.ARMADURA_DE_MONJE)
            const c = ITEM_LIST.find(i => i.idItem === IdItem.CASCO_TRADICIONAL)
            const e = ITEM_LIST.find(i => i.idItem === IdItem.ESCUDO_DE_BATALLA)
            const b = ITEM_LIST.find(i => i.idItem === IdItem.BRAZALETE_DE_MADERA)
            const bo = ITEM_LIST.find(i => i.idItem === IdItem.ZAPATILLAS_DE_CUERO)
            const p = ITEM_LIST.find(i => i.idItem === IdItem.PENDIENTES_DE_MADERA)
            const co = ITEM_LIST.find(i => i.idItem === IdItem.COLLAR_DE_MADERA)

            if (!espada || !daga || !armor || !c || !e || !b || !bo || !p || !co) {
                throw new BadRequestException('arma no existe')
            }


            const entity = this.characterMapper.toDomain(baseCharacter)
            entity.addItemToInventory(espada)
            entity.addItemToInventory(daga)
            entity.addItemToInventory(c)
            entity.addItemToInventory(co)
            entity.addItemToInventory(armor)
            entity.addItemToInventory(p)
            entity.addItemToInventory(b)
            entity.addItemToInventory(e)
            entity.addItemToInventory(bo)
            const newCharacter = this.characterMapper.toPersistence(entity)

            this.InicializateBaseValues(newCharacter)

            const characterCreated = await this.characterRepository.createCharacter(
                newCharacter,
                userId,
            );

            return {
                character: this.characterMapper.toSummary(characterCreated),
            };
        } catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new ConflictException('Ya existe un personaje con ese nombre.');
            }

            throw error;
        }
    }

    private selecteEquip(
        equipo1: EquipType[],
        equipo2: EquipType[],
        equipo3: EquipType[],
        equipo_selected: 1 | 2 | 3
    ): EquipType[] {
        if (equipo_selected === 1) {
            return equipo1
        }
        if (equipo_selected === 2) {
            return equipo2
        }
        return equipo3
    }

    private InicializateBaseValues(baseCharacter: CharacterPersistence) {
        const equipSelected = this.selecteEquip(baseCharacter.equipo_1,
            baseCharacter.equipo_2,
            baseCharacter.equipo_3,
            baseCharacter.equipo_selected)

        const baseAtributes = ATTRIBUTE_BASE_BY_RACE[baseCharacter.raza]

        baseCharacter.atributos = {
            DEX: { lvPoints: baseAtributes.DEX, bonusPoints: 0 },
            INT: { lvPoints: baseAtributes.INT, bonusPoints: 0 },
            STR: { lvPoints: baseAtributes.STR, bonusPoints: 0 },
            VIT: { lvPoints: baseAtributes.VIT, bonusPoints: 0 }
        }

        const { attributes, stats } = this.updateStatsAndAtributtes(
            baseCharacter.stats,
            baseCharacter.raza,
            equipSelected,
            baseCharacter.atributos,
            baseCharacter.buffos,
            baseCharacter.lv,
            baseCharacter.especialidad
        )

        baseCharacter.stats = stats
        baseCharacter.atributos = attributes

        baseCharacter.stats.general.hp.actual = baseCharacter.stats.general.hp.max
        baseCharacter.stats.general.mana.actual = baseCharacter.stats.general.mana.max
    }


    private isDuplicateKeyError(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000
        )
    }
}
