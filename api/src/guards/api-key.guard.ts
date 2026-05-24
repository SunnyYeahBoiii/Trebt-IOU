import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { TokenService } from '@/services/token.service';
import bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const hashedKey = this.configService.get<string>('API_KEY');
    if (!hashedKey) {
      this.logger.error('API_KEY not configured - rejecting request');
      throw new ForbiddenException('API key not configured');
    }

    const request = context.switchToHttp().getRequest();
    const apiKey: string | undefined = request.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('Missing API key');

    if (this.tokenService.validate(apiKey)) return true;

    const isValid = await bcrypt.compare(apiKey, hashedKey);
    if (isValid) return true;

    throw new UnauthorizedException('Invalid API key');
  }
}
