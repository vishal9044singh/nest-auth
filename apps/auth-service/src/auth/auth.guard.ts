import { CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuardCommon implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('value of processenv secret key', process.env.JWT_SECRET);
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('value of token in authGuard is', token);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRET}`,
      }); 
      console.log('payload is', payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (error) {
      console.log('got error in auth guard is', error);
      throw new UnauthorizedException('Unauthorized', { cause: new Error(), description: 'Token Invalid or Expired' })
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
