import { Pokemon } from './Pokemon';
import { TrainerData } from '../types';
export declare class Trainer {
    private id;
    private name;
    private level;
    private experience;
    private pokemon;
    constructor(data: TrainerData);
    getId(): number;
    getName(): string;
    getLevel(): number;
    getExperience(): number;
    getPokemon(): Pokemon[];
    addPokemon(pokemon: Pokemon): boolean;
    healAllPokemon(): void;
    gainExperience(amount: number): void;
    getRandomPokemon(): Pokemon | null;
    getStrongestPokemon(): Pokemon | null;
    hasAlivePokemon(): boolean;
    getAlivePokemonCount(): number;
    toData(): TrainerData;
}
//# sourceMappingURL=Trainer.d.ts.map