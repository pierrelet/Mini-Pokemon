import { Attack } from './Attack';
import { PokemonData } from '../types';

export class Pokemon {
  private id: number;
  private name: string;
  private lifePoints: number;
  private maxLifePoints: number;
  private attacks: Attack[];

  constructor(data: PokemonData) {
    this.id = data.id;
    this.name = data.name;
    this.lifePoints = data.lifePoints;
    this.maxLifePoints = data.maxLifePoints;
    this.attacks = data.attacks.map(a => new Attack(a));
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getLifePoints(): number {
    return this.lifePoints;
  }

  getMaxLifePoints(): number {
    return this.maxLifePoints;
  }

  getAttacks(): Attack[] {
    return this.attacks;
  }

  isAlive(): boolean {
    return this.lifePoints > 0;
  }

  takeDamage(damage: number): void {
    this.lifePoints = Math.max(0, this.lifePoints - damage);
  }

  heal(): void {
    this.lifePoints = this.maxLifePoints;
    this.attacks.forEach(a => a.resetUsage());
  }

  learnAttack(attack: Attack): boolean {
    if (this.attacks.length >= 4) return false;
    if (this.attacks.some(a => a.getId() === attack.getId())) return false;
    this.attacks.push(attack);
    return true;
  }

  getAvailableAttacks(): Attack[] {
    return this.attacks.filter(a => a.canUse());
  }

  attackRandom(): Attack | null {
    const available = this.getAvailableAttacks();
    if (available.length === 0) return null;
    const attack = available[Math.floor(Math.random() * available.length)];
    attack.use();
    return attack;
  }

  attackTarget(target: Pokemon): boolean {
    const attack = this.attackRandom();
    if (!attack) return false;
    target.takeDamage(attack.getDamage());
    return true;
  }

  getStrongestAttack(): Attack | null {
    if (this.attacks.length === 0) return null;
    return this.attacks.reduce((best, current) => 
      current.getDamage() > best.getDamage() ? current : best
    );
  }

  toData(): PokemonData {
    return {
      id: this.id,
      name: this.name,
      lifePoints: this.lifePoints,
      maxLifePoints: this.maxLifePoints,
      attacks: this.attacks.map(a => a.toData())
    };
  }
}