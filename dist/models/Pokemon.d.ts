import { Attack } from './Attack';
import { PokemonData } from '../types';
export declare class Pokemon {
    private id;
    private name;
    private lifePoints;
    private maxLifePoints;
    private attacks;
    constructor(data: PokemonData);
    getId(): number;
    getName(): string;
    getLifePoints(): number;
    getMaxLifePoints(): number;
    getAttacks(): Attack[];
    isAlive(): boolean;
    takeDamage(damage: number): void;
    heal(): void;
    learnAttack(attack: Attack): boolean;
    getAvailableAttacks(): Attack[];
    attackRandom(): Attack | null;
    attackTarget(target: Pokemon): boolean;
    getStrongestAttack(): Attack | null;
    toData(): PokemonData;
}
//# sourceMappingURL=Pokemon.d.ts.map