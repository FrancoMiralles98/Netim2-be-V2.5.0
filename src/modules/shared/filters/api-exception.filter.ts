import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

/**
 * Filtro global encargado de estandarizar las respuestas de error de la API.
 *
 * Captura cualquier excepción lanzada durante el procesamiento de una request
 * HTTP y transforma la respuesta en un formato común para el frontend.
 *
 * Si la excepción es una instancia de `HttpException`, utiliza el status code
 * y la respuesta generada por NestJS. Si no lo es, responde con
 * `500 Internal Server Error`.
 *
 * También detecta errores de validación generados por `class-validator`,
 * donde `message` suele venir como un array de strings, y los asigna a la
 * propiedad `errors`.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>()

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR

        const exceptionResponse = exception instanceof HttpException
            ? exception.getResponse()
            : null;

        let message = 'Ha ocurrido un error interno, intente más tarde.'
        let errors: unknown = null

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse
        }

        if (
            exceptionResponse &&
            typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse
        ) {
            const responseBody = exceptionResponse as {
                message?: string | string[];
                error?: string;
            };

            if (Array.isArray(responseBody.message)) {
                message = 'Validation error';
                errors = responseBody.message;
            } else {
                message = responseBody.message ?? responseBody.error ?? message;
            }
        }

        response.status(status).json({
            success:false,
            message,
            errors
        })

    }
}