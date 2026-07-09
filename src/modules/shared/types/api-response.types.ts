export interface ApiResonpse<T> {
    success: boolean;
    message: string;
    data: T
}

export interface ControllerResponse<T> {
    message?: string;
    data?: T;
}