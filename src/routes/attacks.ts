import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { DatabaseService } from '../services/DatabaseService';
import { Attack } from '../models/Attack';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const attacks = await DatabaseService.getAllAttacks();
    res.json(attacks.map(attack => attack.toData()));
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des attaques' });
  }
});

router.get('/:id', [
  param('id').isInt().withMessage('ID doit être un entier')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attack = await DatabaseService.getAttack(parseInt(req.params.id));
    if (!attack) {
      return res.status(404).json({ error: 'Attaque non trouvée' });
    }

    res.json(attack.toData());
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'attaque' });
  }
});

router.post('/', [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('damage').isInt({ min: 1 }).withMessage('Les dégâts doivent être un entier positif'),
  body('usageLimit').isInt({ min: 1 }).withMessage('La limite d\'usage doit être un entier positif')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attack = await DatabaseService.createAttack(
      req.body.name,
      req.body.damage,
      req.body.usageLimit
    );
    res.status(201).json(attack.toData());
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'attaque' });
  }
});

export default router;
