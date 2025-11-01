"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const database_1 = __importDefault(require("../config/database"));
const Trainer_1 = require("../models/Trainer");
const Pokemon_1 = require("../models/Pokemon");
const Attack_1 = require("../models/Attack");
class DatabaseService {
    static async createTrainer(name) {
        const trainerData = await database_1.default.trainer.create({
            data: { name },
            include: {
                pokemon: {
                    include: {
                        attacks: {
                            include: {
                                attack: true
                            }
                        }
                    }
                }
            }
        });
        return new Trainer_1.Trainer(this.mapTrainerData(trainerData));
    }
    static async getTrainer(id) {
        const trainerData = await database_1.default.trainer.findUnique({
            where: { id },
            include: {
                pokemon: {
                    include: {
                        attacks: {
                            include: {
                                attack: true
                            }
                        }
                    }
                }
            }
        });
        if (!trainerData)
            return null;
        return new Trainer_1.Trainer(this.mapTrainerData(trainerData));
    }
    static async getAllTrainers() {
        const trainersData = await database_1.default.trainer.findMany({
            include: {
                pokemon: {
                    include: {
                        attacks: {
                            include: {
                                attack: true
                            }
                        }
                    }
                }
            }
        });
        return trainersData.map(data => new Trainer_1.Trainer(this.mapTrainerData(data)));
    }
    static async updateTrainer(trainer) {
        const updatedData = await database_1.default.trainer.update({
            where: { id: trainer.getId() },
            data: {
                level: trainer.getLevel(),
                experience: trainer.getExperience()
            },
            include: {
                pokemon: {
                    include: {
                        attacks: {
                            include: {
                                attack: true
                            }
                        }
                    }
                }
            }
        });
        return new Trainer_1.Trainer(this.mapTrainerData(updatedData));
    }
    static async createPokemon(name, maxLifePoints, trainerId) {
        const pokemonData = await database_1.default.pokemon.create({
            data: {
                name,
                lifePoints: maxLifePoints,
                maxLifePoints,
                trainerId
            },
            include: {
                attacks: {
                    include: {
                        attack: true
                    }
                }
            }
        });
        return new Pokemon_1.Pokemon(this.mapPokemonData(pokemonData));
    }
    static async updatePokemon(pokemon) {
        const updatedData = await database_1.default.pokemon.update({
            where: { id: pokemon.getId() },
            data: {
                lifePoints: pokemon.getLifePoints()
            },
            include: {
                attacks: {
                    include: {
                        attack: true
                    }
                }
            }
        });
        return new Pokemon_1.Pokemon(this.mapPokemonData(updatedData));
    }
    static async addPokemonToTrainer(pokemonId, trainerId) {
        await database_1.default.pokemon.update({
            where: { id: pokemonId },
            data: { trainerId }
        });
    }
    static async teachAttackToPokemon(pokemonId, attackId) {
        await database_1.default.pokemonAttack.create({
            data: {
                pokemonId,
                attackId,
                usageCount: 0
            }
        });
    }
    static async updatePokemonAttackUsage(pokemonId, attackId, usageCount) {
        await database_1.default.pokemonAttack.updateMany({
            where: {
                pokemonId,
                attackId
            },
            data: { usageCount }
        });
    }
    static async resetPokemonAttackUsages(pokemonId) {
        await database_1.default.pokemonAttack.updateMany({
            where: { pokemonId },
            data: { usageCount: 0 }
        });
    }
    static async createAttack(name, damage, usageLimit) {
        const attackData = await database_1.default.attack.create({
            data: {
                name,
                damage,
                usageLimit
            }
        });
        return new Attack_1.Attack({
            id: attackData.id,
            name: attackData.name,
            damage: attackData.damage,
            usageLimit: attackData.usageLimit,
            usageCount: 0
        });
    }
    static async getAllAttacks() {
        const attacksData = await database_1.default.attack.findMany();
        return attacksData.map(data => new Attack_1.Attack({
            id: data.id,
            name: data.name,
            damage: data.damage,
            usageLimit: data.usageLimit,
            usageCount: 0
        }));
    }
    static async getAttack(id) {
        const attackData = await database_1.default.attack.findUnique({
            where: { id }
        });
        if (!attackData)
            return null;
        return new Attack_1.Attack({
            id: attackData.id,
            name: attackData.name,
            damage: attackData.damage,
            usageLimit: attackData.usageLimit,
            usageCount: 0
        });
    }
    static async getAllPokemon() {
        const pokemonData = await database_1.default.pokemon.findMany({
            include: {
                attacks: {
                    include: {
                        attack: true
                    }
                }
            }
        });
        return pokemonData.map(data => new Pokemon_1.Pokemon(this.mapPokemonData(data)));
    }
    static async getPokemon(id) {
        const pokemonData = await database_1.default.pokemon.findUnique({
            where: { id },
            include: {
                attacks: {
                    include: {
                        attack: true
                    }
                }
            }
        });
        if (!pokemonData)
            return null;
        return new Pokemon_1.Pokemon(this.mapPokemonData(pokemonData));
    }
    static mapTrainerData(data) {
        return {
            id: data.id,
            name: data.name,
            level: data.level,
            experience: data.experience,
            pokemon: data.pokemon.map((p) => this.mapPokemonData(p))
        };
    }
    static mapPokemonData(data) {
        return {
            id: data.id,
            name: data.name,
            lifePoints: data.lifePoints,
            maxLifePoints: data.maxLifePoints,
            attacks: data.attacks.map((pa) => ({
                id: pa.attack.id,
                name: pa.attack.name,
                damage: pa.attack.damage,
                usageLimit: pa.attack.usageLimit,
                usageCount: pa.usageCount
            }))
        };
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=DatabaseService.js.map