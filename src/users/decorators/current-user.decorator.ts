import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return request.currentUser;
  },
);

// ExecutionContext refer to as request i.e request is only http request but ExecutionContext refer to as websocket incoming message , GRPC request
//an http request alot of different kind of request.
// data: never , argument is what ever provide to the current user parameter decorator


//why decorator and interceptor ?  => this custom decorator has access to session. But userservice is a part of dependency injection system 
//  and we can't make use of dependency injection with parameter decorator. This decorator can't reach in dependency injection and get access
// of any instance. ----> so to work with that we need both interceptor + decorator. As all interceptor we make is a part of dependency 
// injection system
//  => and at the interceptor we made lookup session id  and service instance to get the object in our case that is current user. 