import { Pokemon } from './Pokemon';
import { TrainerData, PokemonData } from '../types';

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
    this.pokemon = data.pokemon.map(pokemonData => new Pokemon(pokemonData));
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLevel(): number {
    return this.level;
  }

  public getExperience(): number {
    return this.experience;
  }

  public getPokemon(): Pokemon[] {
    return this.pokemon;
  }

  public addPokemon(pokemon: Pokemon): boolean {
    this.pokemon.push(pokemon);
    return true;
  }

  public healAllPokemon(): void {
    this.pokemon.forEach(pokemon => pokemon.heal());
  }

  public gainExperience(amount: number): void {
    this.experience += amount;
    while (this.experience >= 10) {
      this.experience -= 10;
      this.level++;
    }
  }

  public getRandomPokemon(): Pokemon | null {
    if (this.pokemon.length === 0) {
      return null;
    }

    const alivePokemon = this.pokemon.filter(p => p.isAlive());
    if (alivePokemon.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * alivePokemon.length);
    return alivePokemon[randomIndex];
  }

  public getStrongestPokemon(): Pokemon | null {
    if (this.pokemon.length === 0) {
      return null;
    }

    const alivePokemon = this.pokemon.filter(p => p.isAlive());
    if (alivePokemon.length === 0) {
      return null;
    }

    return alivePokemon.reduce((strongest, current) => 
      current.getLifePoints() > strongest.getLifePoints() ? current : strongest
    );
  }

  public hasAlivePokemon(): boolean {
    return this.pokemon.some(pokemon => pokemon.isAlive());
  }

  public getAlivePokemonCount(): number {
    return this.pokemon.filter(pokemon => pokemon.isAlive()).length;
  }

  public toData(): TrainerData {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      experience: this.experience,
      pokemon: this.pokemon.map(pokemon => pokemon.toData())
    };
  }
}
