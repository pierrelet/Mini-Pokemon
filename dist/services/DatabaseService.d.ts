import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';
export declare class DatabaseService {
    static createTrainer(name: string): Promise<Trainer>;
    static getTrainer(id: number): Promise<Trainer | null>;
    static getAllTrainers(): Promise<Trainer[]>;
    static updateTrainer(trainer: Trainer): Promise<Trainer>;
    static createPokemon(name: string, maxLifePoints: number, trainerId?: number): Promise<Pokemon>;
    static updatePokemon(pokemon: Pokemon): Promise<Pokemon>;
    static addPokemonToTrainer(pokemonId: number, trainerId: number): Promise<void>;
    static teachAttackToPokemon(pokemonId: number, attackId: number): Promise<void>;
    static updatePokemonAttackUsage(pokemonId: number, attackId: number, usageCount: number): Promise<void>;
    static resetPokemonAttackUsages(pokemonId: number): Promise<void>;
    static createAttack(name: string, damage: number, usageLimit: number): Promise<Attack>;
    static getAllAttacks(): Promise<Attack[]>;
    static getAttack(id: number): Promise<Attack | null>;
    static getAllPokemon(): Promise<Pokemon[]>;
    static getPokemon(id: number): Promise<Pokemon | null>;
    private static mapTrainerData;
    private static mapPokemonData;
}
//# sourceMappingURL=DatabaseService.d.ts.map