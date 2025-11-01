"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const DatabaseService_1 = require("../services/DatabaseService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const trainers = await DatabaseService_1.DatabaseService.getAllTrainers();
        res.json(trainers.map(trainer => trainer.toData()));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des dresseurs' });
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
        const trainer = await DatabaseService_1.DatabaseService.getTrainer(parseInt(req.params.id));
        if (!trainer) {
            return res.status(404).json({ error: 'Dresseur non trouvé' });
        }
        res.json(trainer.toData());
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du dresseur' });
    }
});
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Le nom est requis')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const trainer = await DatabaseService_1.DatabaseService.createTrainer(req.body.name);
        res.status(201).json(trainer.toData());
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du dresseur' });
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
        const trainer = await DatabaseService_1.DatabaseService.getTrainer(parseInt(req.params.id));
        if (!trainer) {
            return res.status(404).json({ error: 'Dresseur non trouvé' });
        }
        trainer.healAllPokemon();
        await DatabaseService_1.DatabaseService.updateTrainer(trainer);
        res.json({ message: 'Tous les Pokémon ont été soignés' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du soin des Pokémon' });
    }
});
router.post('/:id/pokemon/:pokemonId', [
    (0, express_validator_1.param)('id').isInt().withMessage('ID du dresseur doit être un entier'),
    (0, express_validator_1.param)('pokemonId').isInt().withMessage('ID du Pokémon doit être un entier')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const trainerId = parseInt(req.params.id);
        const pokemonId = parseInt(req.params.pokemonId);
        const trainer = await DatabaseService_1.DatabaseService.getTrainer(trainerId);
        if (!trainer) {
            return res.status(404).json({ error: 'Dresseur non trouvé' });
        }
        await DatabaseService_1.DatabaseService.addPokemonToTrainer(pokemonId, trainerId);
        res.json({ message: 'Pokémon ajouté au dresseur' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du Pokémon' });
    }
});
exports.default = router;
//# sourceMappingURL=trainers.js.map