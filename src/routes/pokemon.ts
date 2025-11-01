import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { DatabaseService } from '../services/DatabaseService';
import { Pokemon } from '../models/Pokemon';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const pokemon = await DatabaseService.getAllPokemon();
    res.json(pokemon.map(p => p.toData()));
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des Pokémon' });
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

    const pokemon = await DatabaseService.getPokemon(parseInt(req.params.id));
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    res.json(pokemon.toData());
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du Pokémon' });
  }
});

router.post('/', [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('maxLifePoints').isInt({ min: 1 }).withMessage('Les PV max doivent être un entier positif')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pokemon = await DatabaseService.createPokemon(
      req.body.name,
      req.body.maxLifePoints,
      req.body.trainerId
    );
    res.status(201).json(pokemon.toData());
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du Pokémon' });
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

    const pokemon = await DatabaseService.getPokemon(parseInt(req.params.id));
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    pokemon.heal();
    await DatabaseService.updatePokemon(pokemon);

    res.json({ message: 'Pokémon soigné' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du soin du Pokémon' });
  }
});

router.post('/:id/learn-attack/:attackId', [
  param('id').isInt().withMessage('ID du Pokémon doit être un entier'),
  param('attackId').isInt().withMessage('ID de l\'attaque doit être un entier')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pokemonId = parseInt(req.params.id);
    const attackId = parseInt(req.params.attackId);

    const pokemon = await DatabaseService.getPokemon(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    const attack = await DatabaseService.getAttack(attackId);
    if (!attack) {
      return res.status(404).json({ error: 'Attaque non trouvée' });
    }

    const success = pokemon.learnAttack(attack);
    if (!success) {
      return res.status(400).json({ error: 'Le Pokémon ne peut pas apprendre cette attaque' });
    }

    await DatabaseService.teachAttackToPokemon(pokemonId, attackId);
    res.json({ message: 'Attaque apprise avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'apprentissage de l\'attaque' });
  }
});

export default router;
