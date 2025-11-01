import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { DatabaseService } from '../services/DatabaseService';
import { Trainer } from '../models/Trainer';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const trainers = await DatabaseService.getAllTrainers();
    res.json(trainers.map(trainer => trainer.toData()));
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des dresseurs' });
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

    const trainer = await DatabaseService.getTrainer(parseInt(req.params.id));
    if (!trainer) {
      return res.status(404).json({ error: 'Dresseur non trouvé' });
    }

    res.json(trainer.toData());
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du dresseur' });
  }
});

router.post('/', [
  body('name').notEmpty().withMessage('Le nom est requis')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trainer = await DatabaseService.createTrainer(req.body.name);
    res.status(201).json(trainer.toData());
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du dresseur' });
  }
});

router.post('/:id/heal', [
  param('id').isInt().withMessage('ID doit être un entier')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trainer = await DatabaseService.getTrainer(parseInt(req.params.id));
    if (!trainer) {
      return res.status(404).json({ error: 'Dresseur non trouvé' });
    }

    trainer.healAllPokemon();
    await DatabaseService.updateTrainer(trainer);

    res.json({ message: 'Tous les Pokémon ont été soignés' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du soin des Pokémon' });
  }
});

router.post('/:id/pokemon/:pokemonId', [
  param('id').isInt().withMessage('ID du dresseur doit être un entier'),
  param('pokemonId').isInt().withMessage('ID du Pokémon doit être un entier')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trainerId = parseInt(req.params.id);
    const pokemonId = parseInt(req.params.pokemonId);

    const trainer = await DatabaseService.getTrainer(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: 'Dresseur non trouvé' });
    }

    await DatabaseService.addPokemonToTrainer(pokemonId, trainerId);
    res.json({ message: 'Pokémon ajouté au dresseur' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du Pokémon' });
  }
});

export default router;
