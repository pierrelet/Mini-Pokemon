import { Pokemon } from './Pokemon';
import { TrainerData } from '../types';

export class Trainer {
  private id: number;
  private name: string;
  private level: number;
  private experience: number;
  private pokemon: Pokemon[];

  constructor(data: TrainerData) {
    this.id = data.id;
    this.name = data.name;
    this.level = data.level;
    this.experience = data.experience;
    this.pokemon = data.pokemon.map(p => new Pokemon(p));
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getLevel(): number {
    return this.level;
  }

  getExperience(): number {
    return this.experience;
  }

  getPokemon(): Pokemon[] {
    return this.pokemon;
  }

  addPokemon(pokemon: Pokemon): void {
    this.pokemon.push(pokemon);
  }

  healAllPokemon(): void {
    this.pokemon.forEach(p => p.heal());
  }

  gainExperience(amount: number): void {
    this.experience += amount;
    while (this.experience >= 10) {
      this.experience -= 10;
      this.level++;
    }
  }

  getRandomPokemon(): Pokemon | null {
    const alive = this.pokemon.filter(p => p.isAlive());
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  getStrongestPokemon(): Pokemon | null {
    const alive = this.pokemon.filter(p => p.isAlive());
    if (alive.length === 0) return null;
    return alive.reduce((best, current) => 
      current.getLifePoints() > best.getLifePoints() ? current : best
    );
  }

  hasAlivePokemon(): boolean {
    return this.pokemon.some(p => p.isAlive());
  }

  toData(): TrainerData {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      experience: this.experience,
      pokemon: this.pokemon.map(p => p.toData())
    };
  }
}