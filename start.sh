#!/bin/bash

echo "🎮 Mini Pokemon API - Script de démarrage"
echo "========================================"

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Veuillez l'installer d'abord."
    echo "   Sur macOS: brew install postgresql"
    echo "   Sur Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example .env
    echo "⚠️  Veuillez configurer votre DATABASE_URL dans le fichier .env"
    echo "   Exemple: DATABASE_URL=\"postgresql://username:password@localhost:5432/mini_pokemon?schema=public\""
    exit 1
fi

echo "🔧 Génération du client Prisma..."
npx prisma generate

echo "🗄️  Application des migrations..."
npx prisma migrate dev --name init

echo "🌱 Ajout de données de test..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    // Créer des attaques
    const charge = await prisma.attack.create({
      data: { name: 'Charge', damage: 15, usageLimit: 3 }
    });
    
    const flammeche = await prisma.attack.create({
      data: { name: 'Flammeche', damage: 25, usageLimit: 2 }
    });
    
    const eclair = await prisma.attack.create({
      data: { name: 'Eclair', damage: 30, usageLimit: 2 }
    });
    
    const hydroPompe = await prisma.attack.create({
      data: { name: 'Hydro-Pompe', damage: 35, usageLimit: 1 }
    });

    // Créer des dresseurs
    const ash = await prisma.trainer.create({
      data: { name: 'Ash', level: 1, experience: 0 }
    });
    
    const gary = await prisma.trainer.create({
      data: { name: 'Gary', level: 1, experience: 0 }
    });

    // Créer des Pokémon
    const pikachu = await prisma.pokemon.create({
      data: { 
        name: 'Pikachu', 
        lifePoints: 100, 
        maxLifePoints: 100,
        trainerId: ash.id
      }
    });
    
    const charmander = await prisma.pokemon.create({
      data: { 
        name: 'Charmander', 
        lifePoints: 90, 
        maxLifePoints: 90,
        trainerId: gary.id
      }
    });
    
    const squirtle = await prisma.pokemon.create({
      data: { 
        name: 'Squirtle', 
        lifePoints: 95, 
        maxLifePoints: 95,
        trainerId: ash.id
      }
    });

    // Enseigner des attaques
    await prisma.pokemonAttack.createMany({
      data: [
        { pokemonId: pikachu.id, attackId: charge.id, usageCount: 0 },
        { pokemonId: pikachu.id, attackId: eclair.id, usageCount: 0 },
        { pokemonId: charmander.id, attackId: flammeche.id, usageCount: 0 },
        { pokemonId: charmander.id, attackId: charge.id, usageCount: 0 },
        { pokemonId: squirtle.id, attackId: hydroPompe.id, usageCount: 0 },
        { pokemonId: squirtle.id, attackId: charge.id, usageCount: 0 }
      ]
    });

    console.log('✅ Données de test ajoutées avec succès!');
    console.log('📊 Résumé:');
    console.log('   - 4 attaques créées');
    console.log('   - 2 dresseurs créés (Ash, Gary)');
    console.log('   - 3 Pokémon créés (Pikachu, Charmander, Squirtle)');
    console.log('   - Attaques enseignées aux Pokémon');
    
  } catch (error) {
    console.log('⚠️  Erreur lors de l\'ajout des données:', error.message);
  } finally {
    await prisma.\$disconnect();
  }
}

seed();
"

echo ""
echo "🚀 Démarrage du serveur..."
echo "   API disponible sur: http://localhost:3000"
echo "   Documentation: http://localhost:3000"
echo ""
echo "📚 Commandes utiles:"
echo "   - Voir les dresseurs: curl http://localhost:3000/api/trainers"
echo "   - Voir les Pokémon: curl http://localhost:3000/api/pokemon"
echo "   - Voir les attaques: curl http://localhost:3000/api/attacks"
echo ""

npm run dev


