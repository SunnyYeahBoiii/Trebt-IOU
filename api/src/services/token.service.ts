import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

interface TokenEntry {
  expiresAt: number;
}

@Injectable()
export class TokenService implements OnModuleInit, OnModuleDestroy {
  private tokens = new Map<string, TokenEntry>();
  private readonly TOKEN_FILE = path.resolve(process.env.TOKEN_STORE_PATH ?? "./data/tokens.json");
  private readonly TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h
  private readonly CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6h
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  async onModuleInit() {
    await this.loadTokens();
    this.cleanupExpired();
    this.cleanupInterval = setInterval(() => this.cleanupExpired(), this.CLEANUP_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    this.saveTokens();
  }

  generate(): string {
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens.set(token, { expiresAt: Date.now() + this.TOKEN_EXPIRY_MS });
    this.saveTokens();
    return token;
  }

  validate(token: string): boolean {
    const entry = this.tokens.get(token);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.tokens.delete(token);
      this.saveTokens();
      return false;
    }
    return true;
  }

  revoke(token: string): void {
    this.tokens.delete(token);
    this.saveTokens();
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [token, entry] of this.tokens.entries()) {
      if (now > entry.expiresAt) this.tokens.delete(token);
    }
  }

  private async loadTokens(): Promise<void> {
    try {
      const dir = path.dirname(this.TOKEN_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(this.TOKEN_FILE)) {
        const data = JSON.parse(fs.readFileSync(this.TOKEN_FILE, "utf-8"));
        this.tokens = new Map(Object.entries(data) as [string, TokenEntry][]);
      }
    } catch {
      this.tokens = new Map();
    }
  }

  private saveTokens(): void {
    try {
      const dir = path.dirname(this.TOKEN_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const data = Object.fromEntries(this.tokens);
      fs.writeFileSync(this.TOKEN_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Failed to save tokens:", err);
    }
  }
}
