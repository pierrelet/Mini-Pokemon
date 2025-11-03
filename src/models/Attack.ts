import { AttackData } from '../types';

export class Attack {
  private id: number;
  private name: string;
  private damage: number;
  private usageLimit: number;
  private usageCount: number;

  constructor(data: AttackData) {
    this.id = data.id;
    this.name = data.name;
    this.damage = data.damage;
    this.usageLimit = data.usageLimit;
    this.usageCount = data.usageCount;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDamage(): number {
    return this.damage;
  }

  getUsageLimit(): number {
    return this.usageLimit;
  }

  getUsageCount(): number {
    return this.usageCount;
  }

  canUse(): boolean {
    return this.usageCount < this.usageLimit;
  }

  use(): boolean {
    if (!this.canUse()) return false;
    this.usageCount++;
    return true;
  }

  resetUsage(): void {
    this.usageCount = 0;
  }

  toData(): AttackData {
    return {
      id: this.id,
      name: this.name,
      damage: this.damage,
      usageLimit: this.usageLimit,
      usageCount: this.usageCount
    };
  }
}