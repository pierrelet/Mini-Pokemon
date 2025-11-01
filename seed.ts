import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Ajout de données de test...');

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

    const fouetLianes = await prisma.attack.create({
      data: { name: 'Fouet-Lianes', damage: 20, usageLimit: 3 }
    });

    const lanceFlammes = await prisma.attack.create({
      data: { name: 'Lance-Flammes', damage: 40, usageLimit: 1 }
    });

    // Créer des dresseurs
    const ash = await prisma.trainer.create({
      data: { name: 'Ash', level: 1, experience: 0 }
    });
    
    const gary = await prisma.trainer.create({
      data: { name: 'Gary', level: 1, experience: 0 }
    });

    const misty = await prisma.trainer.create({
      data: { name: 'Misty', level: 1, experience: 0 }
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

    const bulbasaur = await prisma.pokemon.create({
      data: { 
        name: 'Bulbasaur', 
        lifePoints: 85, 
        maxLifePoints: 85,
        trainerId: gary.id
      }
    });

    const staryu = await prisma.pokemon.create({
      data: { 
        name: 'Staryu', 
        lifePoints: 80, 
        maxLifePoints: 80,
        trainerId: misty.id
      }
    });

    const psyduck = await prisma.pokemon.create({
      data: { 
        name: 'Psyduck', 
        lifePoints: 75, 
        maxLifePoints: 75,
        trainerId: misty.id
      }
    });

    // Enseigner des attaques
    await prisma.pokemonAttack.createMany({
      data: [
        // Pikachu
        { pokemonId: pikachu.id, attackId: charge.id, usageCount: 0 },
        { pokemonId: pikachu.id, attackId: eclair.id, usageCount: 0 },
        
        // Charmander
        { pokemonId: charmander.id, attackId: flammeche.id, usageCount: 0 },
        { pokemonId: charmander.id, attackId: lanceFlammes.id, usageCount: 0 },
        
        // Squirtle
        { pokemonId: squirtle.id, attackId: hydroPompe.id, usageCount: 0 },
        { pokemonId: squirtle.id, attackId: charge.id, usageCount: 0 },
        
        // Bulbasaur
        { pokemonId: bulbasaur.id, attackId: fouetLianes.id, usageCount: 0 },
        { pokemonId: bulbasaur.id, attackId: charge.id, usageCount: 0 },
        
        // Staryu
        { pokemonId: staryu.id, attackId: hydroPompe.id, usageCount: 0 },
        { pokemonId: staryu.id, attackId: charge.id, usageCount: 0 },
        
        // Psyduck
        { pokemonId: psyduck.id, attackId: hydroPompe.id, usageCount: 0 },
        { pokemonId: psyduck.id, attackId: charge.id, usageCount: 0 }
      ]
    });

    console.log('✅ Données de test ajoutées avec succès!');
    console.log('');
    console.log('📊 Résumé:');
    console.log('   - 6 attaques créées');
    console.log('   - 3 dresseurs créés (Ash, Gary, Misty)');
    console.log('   - 6 Pokémon créés avec leurs attaques');
    console.log('');
    console.log('🎮 Vous pouvez maintenant jouer !');
    console.log('   - Testez les combats avec Postman');
    console.log('   - Ou utilisez les endpoints dans votre navigateur');
    console.log('');
    console.log('🚀 Exemples de combats à tester :');
    console.log('   POST /api/battles/random-challenge');
    console.log('   POST /api/battles/arena1');
    console.log('   POST /api/battles/deterministic-challenge');
    console.log('   POST /api/battles/arena2');
    
  } catch (error) {
    console.log('⚠️  Erreur lors de l\'ajout des données:', error instanceof Error ? error.message : 'Erreur inconnue');
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
