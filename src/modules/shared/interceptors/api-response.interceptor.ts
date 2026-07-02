import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResonpse, ControllerResponse } from "../types/api-response.types";
import { map, Observable } from 'rxjs'

/**
 * Interceptor global encargado de estandarizar las respuestas exitosas de la API.
 *
 * Este interceptor envuelve automáticamente la respuesta devuelta por los
 * controllers dentro de una estructura común
 *
 * Si el controller devuelve un objeto con la propiedad `data`, se interpreta
 * que la respuesta ya tiene una estructura parcial personalizada y se respeta
 * su `message` si existe.
 *
 * Ejemplo de respuesta desde un controller:
 *
 * return {
 *     message: 'Usuario creado correctamente',
 *     data: user,
 * }
 *
 * Respuesta final enviada al cliente:
 *
 * {
 *     success: true,
 *     message: 'Usuario creado correctamente',
 *     data: user,
 * }
 *
 * Si el controller devuelve directamente cualquier otro valor, ese valor se
 * asigna automáticamente a la propiedad `data` con el mensaje por defecto `Ok`.
 *
 * @template T Tipo de dato devuelto por el controller.
 */
@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResonpse<T>> {

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<ApiResonpse<T>> {
        return next.handle().pipe(
            map((response: T | ControllerResponse<T>) => {

                if (
                    response &&
                    typeof response === 'object' &&
                    'data' in response
                ) {
                    return {
                        success: true,
                        message: response.message ?? 'Ok',
                        data: response.data as T
                    }
                }

                return {
                    success: true,
                    message: 'Ok',
                    data: response as T,
                };


            })
        )
    }
}