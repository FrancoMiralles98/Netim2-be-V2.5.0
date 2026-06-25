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
