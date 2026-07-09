export const USER_VALIDATION_CONFIG = {
    username: {
        minLength: 3,
        maxLength: 13
    },
    password: {
        minLength: 5,
        maxLength: 30
    },
    codigo: {
        minLength: 8,
        maxLength: 8
    }
} as const