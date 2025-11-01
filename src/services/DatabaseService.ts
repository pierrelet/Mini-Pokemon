import pool from '../config/database';
import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';
import { TrainerData, PokemonData, AttackData } from '../types';

export class DatabaseService {
  public static async createTrainer(name: string): Promise<Trainer> {
    const result = await pool.query(
      'INSERT INTO trainers (name, level, experience) VALUES ($1, $2, $3) RETURNING id, name, level, experience',
      [name, 1, 0]
    );
    const trainerId = result.rows[0].id;
    return this.getTrainer(trainerId) as Promise<Trainer>;
  }

  public static async getTrainer(id: number): Promise<Trainer | null> {
    const trainerResult = await pool.query(
      'SELECT id, name, level, experience FROM trainers WHERE id = $1',
      [id]
    );
    if (trainerResult.rows.length === 0) return null;

    const trainer = trainerResult.rows[0];
    const pokemonResult = await pool.query(
      `SELECT p.id, p.name, p."lifePoints", p."maxLifePoints"
       FROM pokemon p WHERE p."trainerId" = $1`,
      [id]
    );

    const pokemonData = await Promise.all(
      pokemonResult.rows.map(async (p: any) => {
        const attacksResult = await pool.query(
          `SELECT a.id, a.name, a.damage, a."usageLimit", pa."usageCount"
           FROM pokemon_attacks pa
           JOIN attacks a ON pa."attackId" = a.id
           WHERE pa."pokemonId" = $1`,
          [p.id]
        );
        return {
          ...p,
          attacks: attacksResult.rows.map((pa: any) => ({
            id: pa.id,
            name: pa.name,
            damage: pa.damage,
            usageLimit: pa.usageLimit,
            usageCount: pa.usageCount || 0
          }))
        };
      })
    );

    return new Trainer({
      id: trainer.id,
      name: trainer.name,
      level: trainer.level,
      experience: trainer.experience,
      pokemon: pokemonData.map(p => this.mapPokemonData(p))
    });
  }

  public static async getAllTrainers(): Promise<Trainer[]> {
    const result = await pool.query('SELECT id FROM trainers');
    const trainers = await Promise.all(
      result.rows.map((row: any) => this.getTrainer(row.id) as Promise<Trainer>)
    );
    return trainers.filter((t): t is Trainer => t !== null);
  }

  public static async updateTrainer(trainer: Trainer): Promise<Trainer> {
    await pool.query(
      'UPDATE trainers SET level = $1, experience = $2 WHERE id = $3',
      [trainer.getLevel(), trainer.getExperience(), trainer.getId()]
    );
    return this.getTrainer(trainer.getId()) as Promise<Trainer>;
  }

  public static async createPokemon(name: string, maxLifePoints: number, trainerId?: number): Promise<Pokemon> {
    const result = await pool.query(
      'INSERT INTO pokemon (name, "lifePoints", "maxLifePoints", "trainerId") VALUES ($1, $2, $3, $4) RETURNING id',
      [name, maxLifePoints, maxLifePoints, trainerId || null]
    );
    return this.getPokemon(result.rows[0].id) as Promise<Pokemon>;
  }

  public static async updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
    await pool.query(
      'UPDATE pokemon SET "lifePoints" = $1 WHERE id = $2',
      [pokemon.getLifePoints(), pokemon.getId()]
    );
    
    // Update attack usages from the Pokemon model
    const attacks = pokemon.getAttacks();
    for (const attack of attacks) {
      await pool.query(
        'UPDATE pokemon_attacks SET "usageCount" = $1 WHERE "pokemonId" = $2 AND "attackId" = $3',
        [attack.getUsageCount(), pokemon.getId(), attack.getId()]
      );
    }

    return this.getPokemon(pokemon.getId()) as Promise<Pokemon>;
  }

  public static async addPokemonToTrainer(pokemonId: number, trainerId: number): Promise<void> {
    await pool.query(
      'UPDATE pokemon SET "trainerId" = $1 WHERE id = $2',
      [trainerId, pokemonId]
    );
  }

  public static async teachAttackToPokemon(pokemonId: number, attackId: number): Promise<void> {
    await pool.query(
      'INSERT INTO pokemon_attacks ("pokemonId", "attackId", "usageCount") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [pokemonId, attackId, 0]
    );
  }

  public static async updatePokemonAttackUsage(pokemonId: number, attackId: number, usageCount: number): Promise<void> {
    await pool.query(
      'UPDATE pokemon_attacks SET "usageCount" = $1 WHERE "pokemonId" = $2 AND "attackId" = $3',
      [usageCount, pokemonId, attackId]
    );
  }

  public static async resetPokemonAttackUsages(pokemonId: number): Promise<void> {
    await pool.query(
      'UPDATE pokemon_attacks SET "usageCount" = $1 WHERE "pokemonId" = $2',
      [0, pokemonId]
    );
  }

  public static async createAttack(name: string, damage: number, usageLimit: number): Promise<Attack> {
    const result = await pool.query(
      'INSERT INTO attacks (name, damage, "usageLimit") VALUES ($1, $2, $3) RETURNING id, name, damage, "usageLimit"',
      [name, damage, usageLimit]
    );
    const data = result.rows[0];
    return new Attack({
      id: data.id,
      name: data.name,
      damage: data.damage,
      usageLimit: data.usageLimit,
      usageCount: 0
    });
  }

  public static async getAllAttacks(): Promise<Attack[]> {
    const result = await pool.query('SELECT id, name, damage, "usageLimit" FROM attacks');
    return result.rows.map((data: any) => new Attack({
      id: data.id,
      name: data.name,
      damage: data.damage,
      usageLimit: data.usageLimit,
      usageCount: 0
    }));
  }

  public static async getAttack(id: number): Promise<Attack | null> {
    const result = await pool.query('SELECT id, name, damage, "usageLimit" FROM attacks WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    const data = result.rows[0];
    return new Attack({
      id: data.id,
      name: data.name,
      damage: data.damage,
      usageLimit: data.usageLimit,
      usageCount: 0
    });
  }

  public static async getAllPokemon(): Promise<Pokemon[]> {
    const result = await pool.query('SELECT id FROM pokemon');
    const pokemon = await Promise.all(
      result.rows.map((row: any) => this.getPokemon(row.id) as Promise<Pokemon>)
    );
    return pokemon.filter((p): p is Pokemon => p !== null);
  }

  public static async getPokemon(id: number): Promise<Pokemon | null> {
    const result = await pool.query(
      'SELECT id, name, "lifePoints", "maxLifePoints" FROM pokemon WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;

    const pokemon = result.rows[0];
    const attacksResult = await pool.query(
      `SELECT a.id, a.name, a.damage, a."usageLimit", pa."usageCount"
       FROM pokemon_attacks pa
       JOIN attacks a ON pa."attackId" = a.id
       WHERE pa."pokemonId" = $1`,
      [id]
    );

    return new Pokemon({
      id: pokemon.id,
      name: pokemon.name,
      lifePoints: pokemon.lifePoints,
      maxLifePoints: pokemon.maxLifePoints,
      attacks: attacksResult.rows.map((pa: any) => ({
        id: pa.id,
        name: pa.name,
        damage: pa.damage,
        usageLimit: pa.usageLimit,
        usageCount: pa.usageCount || 0
      }))
    });
  }

  private static mapPokemonData(data: any): PokemonData {
    return {
      id: data.id,
      name: data.name,
      lifePoints: data.lifePoints,
      maxLifePoints: data.maxLifePoints,
      attacks: data.attacks || []
    };
  }
}