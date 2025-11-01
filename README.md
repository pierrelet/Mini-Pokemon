# Mini Pokemon API

API REST pour un système de jeu Pokémon simplifié avec Express, TypeScript et PostgreSQL.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données PostgreSQL et mettre à jour le fichier `.env` :
```
DATABASE_URL="postgresql://username:password@localhost:5432/mini_pokemon?schema=public"
PORT=3000
NODE_ENV=development
```

3. Générer le client Prisma et appliquer les migrations :
```bash
npx prisma generate
npx prisma migrate dev
```

4. Démarrer le serveur en mode développement :
```bash
npm run dev
```

## Structure du projet

- `src/models/` - Classes Pokemon, Attack, Trainer
- `src/services/` - Logique métier (BattleSystem, DatabaseService)
- `src/routes/` - Routes API REST
- `src/types/` - Interfaces TypeScript
- `prisma/schema.prisma` - Schéma de base de données

## Endpoints API

### Dresseurs
- `GET /api/trainers` - Liste tous les dresseurs
- `GET /api/trainers/:id` - Récupère un dresseur
- `POST /api/trainers` - Crée un dresseur
- `POST /api/trainers/:id/heal` - Soigne tous les Pokémon d'un dresseur
- `POST /api/trainers/:id/pokemon/:pokemonId` - Ajoute un Pokémon à un dresseur

### Pokémon
- `GET /api/pokemon` - Liste tous les Pokémon
- `GET /api/pokemon/:id` - Récupère un Pokémon
- `POST /api/pokemon` - Crée un Pokémon
- `POST /api/pokemon/:id/heal` - Soigne un Pokémon
- `POST /api/pokemon/:id/learn-attack/:attackId` - Enseigne une attaque à un Pokémon

### Attaques
- `GET /api/attacks` - Liste toutes les attaques
- `GET /api/attacks/:id` - Récupère une attaque
- `POST /api/attacks` - Crée une attaque

### Combats
- `POST /api/battles/random-challenge` - Défi aléatoire
- `POST /api/battles/arena1` - Arène 1 (100 combats aléatoires)
- `POST /api/battles/deterministic-challenge` - Défi déterministe
- `POST /api/battles/arena2` - Arène 2 (100 combats déterministes)

## Fonctionnalités

### Pokémon
- Points de vie et attaques
- Apprentissage d'attaques (max 4, sans doublon)
- Soin et réinitialisation des usages d'attaques
- Attaque aléatoire avec une attaque disponible

### Attaques
- Nom, dégâts, limite d'usage
- Compteur d'usage qui s'incrémente
- Méthode d'affichage des informations

### Dresseurs
- Nom, niveau, expérience
- Collection de Pokémon
- Soin de tous les Pokémon
- Gain d'expérience et montée de niveau

### Systèmes de combat
1. **Défi aléatoire** : Combat entre Pokémon aléatoires
2. **Arène 1** : 100 combats aléatoires successifs
3. **Défi déterministe** : Combat avec le Pokémon le plus fort
4. **Arène 2** : 100 combats déterministes consécutifs


