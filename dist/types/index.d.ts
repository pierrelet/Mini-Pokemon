export interface AttackData {
    id: number;
    name: string;
    damage: number;
    usageLimit: number;
    usageCount: number;
}
export interface PokemonData {
    id: number;
    name: string;
    lifePoints: number;
    maxLifePoints: number;
    attacks: AttackData[];
}
export interface TrainerData {
    id: number;
    name: string;
    level: number;
    experience: number;
    pokemon: PokemonData[];
}
export interface BattleResult {
    winner: TrainerData;
    loser: TrainerData;
    rounds: number;
    battleType: string;
}
//# sourceMappingURL=index.d.ts.map