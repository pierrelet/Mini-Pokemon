# Exemple d'utilisation de l'API Mini Pokemon

## 1. Créer des attaques

```bash
# Créer quelques attaques
curl -X POST http://localhost:3000/api/attacks \
  -H "Content-Type: application/json" \
  -d '{"name": "Charge", "damage": 15, "usageLimit": 3}'

curl -X POST http://localhost:3000/api/attacks \
  -H "Content-Type: application/json" \
  -d '{"name": "Flammeche", "damage": 25, "usageLimit": 2}'

curl -X POST http://localhost:3000/api/attacks \
  -H "Content-Type: application/json" \
  -d '{"name": "Eclair", "damage": 30, "usageLimit": 2}'
```

## 2. Créer des Pokémon

```bash
# Créer des Pokémon
curl -X POST http://localhost:3000/api/pokemon \
  -H "Content-Type: application/json" \
  -d '{"name": "Pikachu", "maxLifePoints": 100}'

curl -X POST http://localhost:3000/api/pokemon \
  -H "Content-Type: application/json" \
  -d '{"name": "Charmander", "maxLifePoints": 90}'

curl -X POST http://localhost:3000/api/pokemon \
  -H "Content-Type: application/json" \
  -d '{"name": "Squirtle", "maxLifePoints": 95}'
```

## 3. Enseigner des attaques aux Pokémon

```bash
# Enseigner Charge à Pikachu (ID 1)
curl -X POST http://localhost:3000/api/pokemon/1/learn-attack/1

# Enseigner Eclair à Pikachu (ID 1)
curl -X POST http://localhost:3000/api/pokemon/1/learn-attack/3

# Enseigner Flammeche à Charmander (ID 2)
curl -X POST http://localhost:3000/api/pokemon/2/learn-attack/2
```

## 4. Créer des dresseurs

```bash
# Créer des dresseurs
curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Ash"}'

curl -X POST http://localhost:3000/api/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Gary"}'
```

## 5. Ajouter des Pokémon aux dresseurs

```bash
# Ajouter Pikachu à Ash (ID 1)
curl -X POST http://localhost:3000/api/trainers/1/pokemon/1

# Ajouter Charmander à Gary (ID 2)
curl -X POST http://localhost:3000/api/trainers/2/pokemon/2
```

## 6. Organiser des combats

```bash
# Défi aléatoire entre Ash et Gary
curl -X POST http://localhost:3000/api/battles/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'

# Arène 1 - 100 combats aléatoires
curl -X POST http://localhost:3000/api/battles/arena1 \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'

# Défi déterministe
curl -X POST http://localhost:3000/api/battles/deterministic-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'

# Arène 2 - 100 combats déterministes
curl -X POST http://localhost:3000/api/battles/arena2 \
  -H "Content-Type: application/json" \
  -d '{"trainer1Id": 1, "trainer2Id": 2}'
```

## 7. Soigner les Pokémon

```bash
# Soigner tous les Pokémon d'Ash
curl -X POST http://localhost:3000/api/trainers/1/heal

# Soigner un Pokémon spécifique
curl -X POST http://localhost:3000/api/pokemon/1/heal
```

## 8. Consulter les données

```bash
# Voir tous les dresseurs
curl http://localhost:3000/api/trainers

# Voir un dresseur spécifique
curl http://localhost:3000/api/trainers/1

# Voir tous les Pokémon
curl http://localhost:3000/api/pokemon

# Voir toutes les attaques
curl http://localhost:3000/api/attacks
```


