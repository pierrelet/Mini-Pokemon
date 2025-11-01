"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const DatabaseService_1 = require("../services/DatabaseService");
const router = (0, express_1.Router)();
function prepareSSE(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
}
function sendEvent(res, event, data) {
    res.write('event: ' + event + '\n');
    res.write('data: ' + JSON.stringify(data) + '\n\n');
}
// Défi aléatoire (temps réel)
router.get('/random-challenge', [
    (0, express_validator_2.query)('trainer1Id').isInt().withMessage('ID du dresseur 1 doit être un entier'),
    (0, express_validator_2.query)('trainer2Id').isInt().withMessage('ID du dresseur 2 doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const trainer1 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer1Id)));
        const trainer2 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer2Id)));
        if (!trainer1 || !trainer2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'a pas été trouvé' });
        }
        prepareSSE(res);
        trainer1.healAllPokemon();
        trainer2.healAllPokemon();
        const pokemon1 = trainer1.getRandomPokemon();
        const pokemon2 = trainer2.getRandomPokemon();
        if (!pokemon1 || !pokemon2) {
            sendEvent(res, 'error', { message: 'Un des dresseurs n\'a pas de Pokémon' });
            return res.end();
        }
        sendEvent(res, 'start', {
            battleType: 'Défi aléatoire (temps réel)',
            trainer1: trainer1.toData(),
            trainer2: trainer2.toData(),
            pokemon1: pokemon1.toData(),
            pokemon2: pokemon2.toData()
        });
        let rounds = 0;
        const maxRounds = 100;
        const interval = setInterval(async () => {
            if (!pokemon1.isAlive() || !pokemon2.isAlive() || rounds >= maxRounds) {
                clearInterval(interval);
                const winner = pokemon1.isAlive() ? trainer1 : trainer2;
                const loser = pokemon1.isAlive() ? trainer2 : trainer1;
                winner.gainExperience(5);
                loser.gainExperience(2);
                await DatabaseService_1.DatabaseService.updateTrainer(winner);
                await DatabaseService_1.DatabaseService.updateTrainer(loser);
                sendEvent(res, 'end', { rounds, winner: winner.toData(), loser: loser.toData() });
                return res.end();
            }
            const attacker = Math.random() < 0.5 ? pokemon1 : pokemon2;
            const defender = attacker === pokemon1 ? pokemon2 : pokemon1;
            const selected = attacker.attackRandom();
            let attackName = null;
            let damage = 0;
            let success = false;
            if (selected) {
                attackName = selected.getName();
                damage = selected.getDamage();
                defender.takeDamage(damage);
                success = true;
            }
            rounds++;
            sendEvent(res, 'turn', {
                round: rounds,
                attacker: attacker.getName(),
                defender: defender.getName(),
                defenderLife: defender.getLifePoints(),
                success,
                attackName,
                damage
            });
        }, 500);
        req.on('close', () => clearInterval(interval));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du combat aléatoire' });
    }
});
// Arène 1 (100 combats aléatoires successifs en temps réel)
router.get('/arena1', [
    (0, express_validator_2.query)('trainer1Id').isInt().withMessage('ID du dresseur 1 doit être un entier'),
    (0, express_validator_2.query)('trainer2Id').isInt().withMessage('ID du dresseur 2 doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const trainer1 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer1Id)));
        const trainer2 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer2Id)));
        if (!trainer1 || !trainer2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'a pas été trouvé' });
        }
        prepareSSE(res);
        sendEvent(res, 'start', { battleType: 'Arène 1 (temps réel)', trainer1: trainer1.toData(), trainer2: trainer2.toData() });
        let fights = 0;
        const maxFights = 100;
        const interval = setInterval(async () => {
            if (fights >= maxFights) {
                clearInterval(interval);
                const t1Level = trainer1.getLevel();
                const t2Level = trainer2.getLevel();
                let winner;
                let loser;
                if (t1Level !== t2Level) {
                    winner = t1Level > t2Level ? trainer1 : trainer2;
                    loser = winner === trainer1 ? trainer2 : trainer1;
                }
                else {
                    const t1Xp = trainer1.getExperience();
                    const t2Xp = trainer2.getExperience();
                    if (t1Xp !== t2Xp) {
                        winner = t1Xp > t2Xp ? trainer1 : trainer2;
                        loser = winner === trainer1 ? trainer2 : trainer1;
                    }
                    else {
                        winner = trainer1;
                        loser = trainer2;
                    }
                }
                winner.gainExperience(50);
                loser.gainExperience(20);
                await DatabaseService_1.DatabaseService.updateTrainer(winner);
                await DatabaseService_1.DatabaseService.updateTrainer(loser);
                sendEvent(res, 'end', { fights: maxFights, winner: winner.toData(), loser: loser.toData() });
                return res.end();
            }
            // single random challenge without DOM turns, just fight summary
            trainer1.healAllPokemon();
            trainer2.healAllPokemon();
            const p1 = trainer1.getRandomPokemon();
            const p2 = trainer2.getRandomPokemon();
            if (!p1 || !p2) {
                clearInterval(interval);
                sendEvent(res, 'error', { message: 'Un des dresseurs n\'a pas de Pokémon' });
                return res.end();
            }
            let rounds = 0;
            const maxRounds = 100;
            while (p1.isAlive() && p2.isAlive() && rounds < maxRounds) {
                const attacker = Math.random() < 0.5 ? p1 : p2;
                const defender = attacker === p1 ? p2 : p1;
                attacker.attackTarget(defender);
                rounds++;
            }
            const fightWinner = p1.isAlive() ? trainer1.getName() : trainer2.getName();
            fights++;
            sendEvent(res, 'progress', { fight: fights, fightWinner });
        }, 300);
        req.on('close', () => clearInterval(interval));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'arène 1' });
    }
});
// Défi déterministe (temps réel)
router.get('/deterministic-challenge', [
    (0, express_validator_2.query)('trainer1Id').isInt().withMessage('ID du dresseur 1 doit être un entier'),
    (0, express_validator_2.query)('trainer2Id').isInt().withMessage('ID du dresseur 2 doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const trainer1 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer1Id)));
        const trainer2 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer2Id)));
        if (!trainer1 || !trainer2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'a pas été trouvé' });
        }
        prepareSSE(res);
        const pokemon1 = trainer1.getStrongestPokemon();
        const pokemon2 = trainer2.getStrongestPokemon();
        if (!pokemon1 || !pokemon2) {
            sendEvent(res, 'error', { message: 'Un des dresseurs n\'a pas de Pokémon' });
            return res.end();
        }
        sendEvent(res, 'start', {
            battleType: 'Défi déterministe (temps réel)',
            trainer1: trainer1.toData(),
            trainer2: trainer2.toData(),
            pokemon1: pokemon1.toData(),
            pokemon2: pokemon2.toData()
        });
        let rounds = 0;
        const maxRounds = 100;
        const interval = setInterval(async () => {
            if (!pokemon1.isAlive() || !pokemon2.isAlive() || rounds >= maxRounds) {
                clearInterval(interval);
                const winner = pokemon1.isAlive() ? trainer1 : trainer2;
                const loser = pokemon1.isAlive() ? trainer2 : trainer1;
                winner.gainExperience(5);
                loser.gainExperience(2);
                await DatabaseService_1.DatabaseService.updateTrainer(winner);
                await DatabaseService_1.DatabaseService.updateTrainer(loser);
                sendEvent(res, 'end', { rounds, winner: winner.toData(), loser: loser.toData() });
                return res.end();
            }
            const attacker = Math.random() < 0.5 ? pokemon1 : pokemon2;
            const defender = attacker === pokemon1 ? pokemon2 : pokemon1;
            const selected = attacker.attackRandom();
            let attackName = null;
            let damage = 0;
            let success = false;
            if (selected) {
                attackName = selected.getName();
                damage = selected.getDamage();
                defender.takeDamage(damage);
                success = true;
            }
            rounds++;
            sendEvent(res, 'turn', {
                round: rounds,
                attacker: attacker.getName(),
                defender: defender.getName(),
                defenderLife: defender.getLifePoints(),
                success,
                attackName,
                damage
            });
        }, 500);
        req.on('close', () => clearInterval(interval));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du combat déterministe' });
    }
});
// Arène 2 (temps réel)
router.get('/arena2', [
    (0, express_validator_2.query)('trainer1Id').isInt().withMessage('ID du dresseur 1 doit être un entier'),
    (0, express_validator_2.query)('trainer2Id').isInt().withMessage('ID du dresseur 2 doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const trainer1 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer1Id)));
        const trainer2 = await DatabaseService_1.DatabaseService.getTrainer(parseInt(String(req.query.trainer2Id)));
        if (!trainer1 || !trainer2) {
            return res.status(404).json({ error: 'Un des dresseurs n\'a pas été trouvé' });
        }
        prepareSSE(res);
        sendEvent(res, 'start', { battleType: 'Arène 2 (temps réel)', trainer1: trainer1.toData(), trainer2: trainer2.toData() });
        let fights = 0;
        const maxFights = 100;
        const interval = setInterval(async () => {
            if (!trainer1.hasAlivePokemon() || !trainer2.hasAlivePokemon() || fights >= maxFights) {
                clearInterval(interval);
                const winner = trainer1.hasAlivePokemon() ? trainer1 : trainer2;
                const loser = trainer1.hasAlivePokemon() ? trainer2 : trainer1;
                winner.gainExperience(100);
                loser.gainExperience(50);
                await DatabaseService_1.DatabaseService.updateTrainer(winner);
                await DatabaseService_1.DatabaseService.updateTrainer(loser);
                sendEvent(res, 'end', { fights, winner: winner.toData(), loser: loser.toData() });
                return res.end();
            }
            const p1 = trainer1.getStrongestPokemon();
            const p2 = trainer2.getStrongestPokemon();
            if (!p1 || !p2) {
                clearInterval(interval);
                sendEvent(res, 'error', { message: 'Un des dresseurs n\'a pas de Pokémon' });
                return res.end();
            }
            let rounds = 0;
            const maxRounds = 100;
            while (p1.isAlive() && p2.isAlive() && rounds < maxRounds) {
                const attacker = Math.random() < 0.5 ? p1 : p2;
                const defender = attacker === p1 ? p2 : p1;
                attacker.attackTarget(defender);
                rounds++;
            }
            fights++;
            sendEvent(res, 'progress', { fight: fights });
        }, 300);
        req.on('close', () => clearInterval(interval));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'arène 2' });
    }
});
exports.default = router;
//# sourceMappingURL=battles.js.map