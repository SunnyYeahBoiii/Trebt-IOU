import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { TokenService } from '@/services/token.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let configService: ConfigService;
  let tokenService: TokenService;
  let reflector: Reflector;

  const mockExecutionContext = (apiKeyHeader?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': apiKeyHeader },
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as any;

  let testModule: TestingModule;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'API_KEY') return 'hashed-api-key';
              return undefined;
            }),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(false),
          },
        },
        {
          provide: TokenService,
          useValue: {
            validate: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    guard = testModule.get(ApiKeyGuard);
    configService = testModule.get(ConfigService);
    tokenService = testModule.get(TokenService);
    reflector = testModule.get(Reflector);
  });

  it('should allow access to public routes', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(mockExecutionContext(undefined));
    expect(result).toBe(true);
  });

  it('should reject when API key is not configured', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    await expect(guard.canActivate(mockExecutionContext(undefined))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should reject when API key header is missing', async () => {
    await expect(guard.canActivate(mockExecutionContext(undefined))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should accept when token service validates the key', async () => {
    jest.spyOn(tokenService, 'validate').mockReturnValue(true);

    const result = await guard.canActivate(mockExecutionContext('some-api-key'));
    expect(result).toBe(true);
  });

  it('should reject when both token validation and bcrypt fail', async () => {
    jest.spyOn(tokenService, 'validate').mockReturnValue(false);

    await expect(guard.canActivate(mockExecutionContext('wrong-key'))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
