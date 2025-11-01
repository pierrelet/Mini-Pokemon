"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const DatabaseService_1 = require("../services/DatabaseService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const attacks = await DatabaseService_1.DatabaseService.getAllAttacks();
        res.json(attacks.map(attack => attack.toData()));
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des attaques' });
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
        const attack = await DatabaseService_1.DatabaseService.getAttack(parseInt(req.params.id));
        if (!attack) {
            return res.status(404).json({ error: 'Attaque non trouvée' });
        }
        res.json(attack.toData());
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'attaque' });
    }
});
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Le nom est requis'),
    (0, express_validator_1.body)('damage').isInt({ min: 1 }).withMessage('Les dégâts doivent être un entier positif'),
    (0, express_validator_1.body)('usageLimit').isInt({ min: 1 }).withMessage('La limite d\'usage doit être un entier positif')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const attack = await DatabaseService_1.DatabaseService.createAttack(req.body.name, req.body.damage, req.body.usageLimit);
        res.status(201).json(attack.toData());
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'attaque' });
    }
});
exports.default = router;
//# sourceMappingURL=attacks.js.map