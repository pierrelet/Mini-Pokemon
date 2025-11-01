"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const DatabaseService_1 = require("../services/DatabaseService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const pokemon = await DatabaseService_1.DatabaseService.getAllPokemon();
        res.json(pokemon.map(p => p.toData()));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des Pokémon' });
    }
});
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt().withMessage('ID doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pokemon = await DatabaseService_1.DatabaseService.getPokemon(parseInt(req.params.id));
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        res.json(pokemon.toData());
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du Pokémon' });
    }
});
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Le nom est requis'),
    (0, express_validator_1.body)('maxLifePoints').isInt({ min: 1 }).withMessage('Les PV max doivent être un entier positif')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pokemon = await DatabaseService_1.DatabaseService.createPokemon(req.body.name, req.body.maxLifePoints, req.body.trainerId);
        res.status(201).json(pokemon.toData());
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du Pokémon' });
    }
});
router.post('/:id/heal', [
    (0, express_validator_1.param)('id').isInt().withMessage('ID doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pokemon = await DatabaseService_1.DatabaseService.getPokemon(parseInt(req.params.id));
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        pokemon.heal();
        await DatabaseService_1.DatabaseService.updatePokemon(pokemon);
        res.json({ message: 'Pokémon soigné' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du soin du Pokémon' });
    }
});
router.post('/:id/learn-attack/:attackId', [
    (0, express_validator_1.param)('id').isInt().withMessage('ID du Pokémon doit être un entier'),
    (0, express_validator_1.param)('attackId').isInt().withMessage('ID de l\'attaque doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pokemonId = parseInt(req.params.id);
        const attackId = parseInt(req.params.attackId);
        const pokemon = await DatabaseService_1.DatabaseService.getPokemon(pokemonId);
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        const attack = await DatabaseService_1.DatabaseService.getAttack(attackId);
        if (!attack) {
            return res.status(404).json({ error: 'Attaque non trouvée' });
        }
        const success = pokemon.learnAttack(attack);
        if (!success) {
            return res.status(400).json({ error: 'Le Pokémon ne peut pas apprendre cette attaque' });
        }
        await DatabaseService_1.DatabaseService.teachAttackToPokemon(pokemonId, attackId);
        res.json({ message: 'Attaque apprise avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'apprentissage de l\'attaque' });
    }
});
exports.default = router;
//# sourceMappingURL=pokemon.js.map