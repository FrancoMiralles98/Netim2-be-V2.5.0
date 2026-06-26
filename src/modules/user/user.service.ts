import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user-repository';
import { UserModel } from './schema/user-schema';
import { UserRole } from './types/user-roles.enum';
import { HashSharedService } from '../shared/services/hash-shared.service';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private hashSharedService: HashSharedService,
    ) { }

    /**
    * Crea un nuevo usuario en el sistema.
    *
    * Normaliza los datos principales antes de persistirlos
    *
    * La validación de duplicados se apoya en los índices únicos de la base de datos.
    * Si MongoDB detecta un email o username repetido, se captura el error de clave
    * duplicada y se transforma en un `ConflictException`.
    *
    * @param data Datos necesarios para crear el usuario.
    *
    * @returns Usuario creado y persistido.
    *
    * @throws ConflictException Si ya existe un usuario con el mismo email o username.
    * @throws Si ocurre cualquier otro error durante el hasheo o la persistencia.
    */
    async createUser(data: CreateUserDto): Promise<UserModel> {
        try {
            const email = data.email.trim().toLowerCase()
            const username = data.username.trim()

            const hashedPassword = await this.hashSharedService.hashText(data.password)

            return await this.userRepository.createUser({
                username,
                email,
                password: hashedPassword,
                codigo: data.codigo,
                role: UserRole.USER,
                md: 0,
                yang: 0,
                almacen: [],
                almacenItemShop: [],
            })
        } catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new ConflictException('Ya existe un usuario con ese email o username')
            }

            throw error
        }
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
