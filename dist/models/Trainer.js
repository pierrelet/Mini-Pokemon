"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer = void 0;
const Pokemon_1 = require("./Pokemon");
class Trainer {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.level = data.level;
        this.experience = data.experience;
        this.pokemon = data.pokemon.map(pokemonData => new Pokemon_1.Pokemon(pokemonData));
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getLevel() {
        return this.level;
    }
    getExperience() {
        return this.experience;
    }
    getPokemon() {
        return this.pokemon;
    }
    addPokemon(pokemon) {
        this.pokemon.push(pokemon);
        return true;
    }
    healAllPokemon() {
        this.pokemon.forEach(pokemon => pokemon.heal());
    }
    gainExperience(amount) {
        this.experience += amount;
        while (this.experience >= 10) {
            this.experience -= 10;
            this.level++;
        }
    }
    getRandomPokemon() {
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
    getStrongestPokemon() {
        if (this.pokemon.length === 0) {
            return null;
        }
        const alivePokemon = this.pokemon.filter(p => p.isAlive());
        if (alivePokemon.length === 0) {
            return null;
        }
        return alivePokemon.reduce((strongest, current) => current.getLifePoints() > strongest.getLifePoints() ? current : strongest);
    }
    hasAlivePokemon() {
        return this.pokemon.some(pokemon => pokemon.isAlive());
    }
    getAlivePokemonCount() {
        return this.pokemon.filter(pokemon => pokemon.isAlive()).length;
    }
    toData() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            experience: this.experience,
            pokemon: this.pokemon.map(pokemon => pokemon.toData())
        };
    }
}
exports.Trainer = Trainer;
//# sourceMappingURL=Trainer.js.map