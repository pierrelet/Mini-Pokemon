import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { BattleResult } from '../types';

export class BattleSystem {
  public static randomChallenge(trainer1: Trainer, trainer2: Trainer): BattleResult {
    trainer1.healAllPokemon();
    trainer2.healAllPokemon();

    const pokemon1 = trainer1.getRandomPokemon();
    const pokemon2 = trainer2.getRandomPokemon();

    if (!pokemon1 || !pokemon2) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon');
    }

    let rounds = 0;
    const maxRounds = 100;

    while (pokemon1.isAlive() && pokemon2.isAlive() && rounds < maxRounds) {
      const attacker = Math.random() < 0.5 ? pokemon1 : pokemon2;
      const defender = attacker === pokemon1 ? pokemon2 : pokemon1;

      attacker.attackTarget(defender);
      rounds++;
    }

    const winner = pokemon1.isAlive() ? trainer1 : trainer2;
    const loser = pokemon1.isAlive() ? trainer2 : trainer1;

    winner.gainExperience(5);
    loser.gainExperience(2);

    return {
      winner: winner.toData(),
      loser: loser.toData(),
      rounds,
      battleType: 'Défi aléatoire'
    };
  }

  public static arena1(trainer1: Trainer, trainer2: Trainer): BattleResult {
    for (let i = 0; i < 100; i++) {
      this.randomChallenge(trainer1, trainer2);
    }

    const t1Level = trainer1.getLevel();
    const t2Level = trainer2.getLevel();

    let winner: Trainer;
    let loser: Trainer;

    if (t1Level !== t2Level) {
      winner = t1Level > t2Level ? trainer1 : trainer2;
      loser = winner === trainer1 ? trainer2 : trainer1;
    } else {
      const t1Xp = trainer1.getExperience();
      const t2Xp = trainer2.getExperience();
      if (t1Xp !== t2Xp) {
        winner = t1Xp > t2Xp ? trainer1 : trainer2;
        loser = winner === trainer1 ? trainer2 : trainer1;
      } else {
        // Strict tie: fall back to a deterministic choice
        winner = trainer1;
        loser = trainer2;
      }
    }

    winner.gainExperience(50);
    loser.gainExperience(20);

    return {
      winner: winner.toData(),
      loser: loser.toData(),
      rounds: 100,
      battleType: 'Arène 1'
    };
  }

  public static deterministicChallenge(trainer1: Trainer, trainer2: Trainer): BattleResult {
    const pokemon1 = trainer1.getStrongestPokemon();
    const pokemon2 = trainer2.getStrongestPokemon();

    if (!pokemon1 || !pokemon2) {
      throw new Error('Un des dresseurs n\'a pas de Pokémon');
    }

    let rounds = 0;
    const maxRounds = 100;

    while (pokemon1.isAlive() && pokemon2.isAlive() && rounds < maxRounds) {
      const attacker = Math.random() < 0.5 ? pokemon1 : pokemon2;
      const defender = attacker === pokemon1 ? pokemon2 : pokemon1;

      attacker.attackTarget(defender);
      rounds++;
    }

    const winner = pokemon1.isAlive() ? trainer1 : trainer2;
    const loser = pokemon1.isAlive() ? trainer2 : trainer1;

    winner.gainExperience(5);
    loser.gainExperience(2);

    return {
      winner: winner.toData(),
      loser: loser.toData(),
      rounds,
      battleType: 'Défi déterministe'
    };
  }

  public static arena2(trainer1: Trainer, trainer2: Trainer): BattleResult {
    let rounds = 0;
    const maxRounds = 100;

    while (trainer1.hasAlivePokemon() && trainer2.hasAlivePokemon() && rounds < maxRounds) {
      const result = this.deterministicChallenge(trainer1, trainer2);
      rounds++;
    }

    const winner = trainer1.hasAlivePokemon() ? trainer1 : trainer2;
    const loser = trainer1.hasAlivePokemon() ? trainer2 : trainer1;

    winner.gainExperience(100);
    loser.gainExperience(50);

    return {
      winner: winner.toData(),
      loser: loser.toData(),
      rounds,
      battleType: 'Arène 2'
    };
  }
}
