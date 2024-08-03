import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

//클래스면 만족
interface ClassConstructor {
    new (...args: any[]): {}
}

//우리의 데코레이터 !!
export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any) {}

    intercept(context:ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {excludeExtraneousValues: true,});
            })
        );
    }

}