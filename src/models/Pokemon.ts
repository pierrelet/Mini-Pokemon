import { Attack } from './Attack';
import { PokemonData, AttackData } from '../types';

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
    this.attacks = data.attacks.map(attackData => new Attack(attackData));
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLifePoints(): number {
    return this.lifePoints;
  }

  public getMaxLifePoints(): number {
    return this.maxLifePoints;
  }

  public getAttacks(): Attack[] {
    return this.attacks;
  }

  public isAlive(): boolean {
    return this.lifePoints > 0;
  }

  public takeDamage(damage: number): void {
    this.lifePoints = Math.max(0, this.lifePoints - damage);
  }

  public heal(): void {
    this.lifePoints = this.maxLifePoints;
    this.attacks.forEach(attack => attack.resetUsage());
  }

  public learnAttack(attack: Attack): boolean {
    if (this.attacks.length >= 4) {
      return false;
    }

    const existingAttack = this.attacks.find(a => a.getId() === attack.getId());
    if (existingAttack) {
      return false;
    }

    this.attacks.push(attack);
    return true;
  }

  public getAvailableAttacks(): Attack[] {
    return this.attacks.filter(attack => attack.canUse());
  }

  public attackRandom(): Attack | null {
    const availableAttacks = this.getAvailableAttacks();
    if (availableAttacks.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableAttacks.length);
    const selectedAttack = availableAttacks[randomIndex];
    selectedAttack.use();
    return selectedAttack;
  }

  public attackTarget(target: Pokemon): boolean {
    const attack = this.attackRandom();
    if (!attack) {
      return false;
    }

    target.takeDamage(attack.getDamage());
    return true;
  }

  public getStrongestAttack(): Attack | null {
    if (this.attacks.length === 0) {
      return null;
    }

    return this.attacks.reduce((strongest, current) => 
      current.getDamage() > strongest.getDamage() ? current : strongest
    );
  }

  public toData(): PokemonData {
    return {
      id: this.id,
      name: this.name,
      lifePoints: this.lifePoints,
      maxLifePoints: this.maxLifePoints,
      attacks: this.attacks.map(attack => attack.toData())
    };
  }
}
