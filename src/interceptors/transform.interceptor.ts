// src/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<unknown>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<unknown>> {
    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((rawPayload: unknown): Response<unknown> => {
        const payload = rawPayload as
          | Record<string, unknown>
          | null
          | undefined;

        const customMessage =
          payload && 'message' in payload
            ? (payload.message as string)
            : undefined;
        const message: string =
          customMessage || 'Request processed successfully';

        if (
          payload &&
          'message' in payload &&
          Object.keys(payload).length === 1
        ) {
          return {
            success: true,
            statusCode,
            message,
            data: null,
          };
        }

        if (payload && 'message' in payload) {
          const { message: payloadMessage, ...rest } = payload;
          return {
            success: true,
            statusCode,
            message: payloadMessage as string,
            data: rest,
          };
        }

        return {
          success: true,
          statusCode,
          message,
          data: rawPayload,
        };
      }),
    );
  }
}
