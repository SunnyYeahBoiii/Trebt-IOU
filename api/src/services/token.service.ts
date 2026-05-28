import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

@Injectable()
export class TokenService implements OnModuleInit, OnModuleDestroy {
  private tokens = new Map<string, object>();
  private readonly TOKEN_FILE = path.resolve(process.env.TOKEN_STORE_PATH ?? "./data/tokens.json");

  async onModuleInit() {
    await this.loadTokens();
  }

  onModuleDestroy() {
    this.saveTokens();
  }

  generate(): string {
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens.set(token, {});
    this.saveTokens();
    return token;
  }

  validate(token: string): boolean {
    return this.tokens.has(token);
  }

  revoke(token: string): void {
    this.tokens.delete(token);
    this.saveTokens();
  }

  private async loadTokens(): Promise<void> {
    try {
      const dir = path.dirname(this.TOKEN_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(this.TOKEN_FILE)) {
        const data = JSON.parse(fs.readFileSync(this.TOKEN_FILE, "utf-8"));
        this.tokens = new Map(Object.entries(data) as [string, object][]);
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
