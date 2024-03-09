import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor{
    new (...args: any[]): {}
}

// Behind the scene decorator are plain function
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}
    
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled, by the request handler
        // console.log('Im running before the handler', context)

        return next.handle().pipe(
            map((data) => {
                // Run something before the response is sent out
                // console.log('Im running before response is sent out', data)

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true // this setting ensures that whenever we have an instance of user (or of any entity ) and try to turn it into plain JSON
                    //,it is only going to shaare or expose the properties that are specially marked with that exposed directive
                })

            })
        )
    }
}