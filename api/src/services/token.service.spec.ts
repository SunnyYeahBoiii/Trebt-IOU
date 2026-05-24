import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import * as fs from 'fs';
import * as path from 'path';

describe('TokenService', () => {
  let service: TokenService;
  const testTokenFile = path.resolve('./data/tokens.json');

  beforeEach(async () => {
    // Clean up test file before each test
    const dir = path.dirname(testTokenFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(testTokenFile)) fs.unlinkSync(testTokenFile);

    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get(TokenService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    service.onModuleDestroy();
    if (fs.existsSync(testTokenFile)) fs.unlinkSync(testTokenFile);
  });

  it('should generate a valid token', () => {
    const token = service.generate();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should validate a generated token', () => {
    const token = service.generate();
    expect(service.validate(token)).toBe(true);
  });

  it('should reject an unknown token', () => {
    expect(service.validate('invalid-token')).toBe(false);
  });

  it('should revoke a token', () => {
    const token = service.generate();
    expect(service.validate(token)).toBe(true);
    service.revoke(token);
    expect(service.validate(token)).toBe(false);
  });

  it('should persist tokens to disk', () => {
    service.generate();
    expect(fs.existsSync(testTokenFile)).toBe(true);
    const data = JSON.parse(fs.readFileSync(testTokenFile, 'utf-8'));
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });
});
