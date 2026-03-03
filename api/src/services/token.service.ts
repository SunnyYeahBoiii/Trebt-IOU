import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  private readonly tokens = new Set<string>();

  generate(): string {
    const token = randomBytes(32).toString('hex');
    this.tokens.add(token);
    return token;
  }

  validate(token: string): boolean {
    return this.tokens.has(token);
  }

  revoke(token: string): void {
    this.tokens.delete(token);
  }
}
