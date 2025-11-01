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

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getUsageLimit(): number {
    return this.usageLimit;
  }

  public getUsageCount(): number {
    return this.usageCount;
  }

  public canUse(): boolean {
    return this.usageCount < this.usageLimit;
  }

  public use(): boolean {
    if (this.canUse()) {
      this.usageCount++;
      return true;
    }
    return false;
  }

  public resetUsage(): void {
    this.usageCount = 0;
  }

  public getInfo(): string {
    return `${this.name} - Dégâts: ${this.damage}, Usages: ${this.usageCount}/${this.usageLimit}`;
  }

  public toData(): AttackData {
    return {
      id: this.id,
      name: this.name,
      damage: this.damage,
      usageLimit: this.usageLimit,
      usageCount: this.usageCount
    };
  }
}
