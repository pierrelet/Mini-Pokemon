"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const trainers_1 = __importDefault(require("./routes/trainers"));
const pokemon_1 = __importDefault(require("./routes/pokemon"));
const attacks_1 = __importDefault(require("./routes/attacks"));
const battles_1 = __importDefault(require("./routes/battles"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use('/api/trainers', trainers_1.default);
app.use('/api/pokemon', pokemon_1.default);
app.use('/api/attacks', attacks_1.default);
app.use('/api/battles', battles_1.default);
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎮 Mini Pokemon API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: white;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding: 40px 0;
            }
            
            .header h1 {
                font-size: 3.5rem;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
                background-size: 400% 400%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradientShift 3s ease infinite;
            }
            
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .header p {
                font-size: 1.2rem;
                opacity: 0.9;
            }
            
            .game-section {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 30px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .game-section h2 {
                color: #ffd700;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .battle-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .battle-btn {
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 15px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .battle-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }
            
            .battle-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .trainer-select {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .trainer-option {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid transparent;
                border-radius: 10px;
                padding: 15px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .trainer-option:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
            }
            
            .trainer-option.selected {
                border-color: #ffd700;
                background: rgba(255, 215, 0, 0.2);
            }
            
            .result {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin-top: 20px;
                border-left: 4px solid #4ecdc4;
                display: none;
            }
            
            .result.show {
                display: block;
                animation: slideIn 0.5s ease;
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .loading {
                text-align: center;
                padding: 20px;
                display: none;
            }
            
            .loading.show {
                display: block;
            }
            
            .spinner {
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid #ffd700;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .data-section {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            
            .data-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .data-card h3 {
                color: #ffd700;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .data-content {
                max-height: 300px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
            }
            
            .refresh-btn {
                background: linear-gradient(45deg, #4ecdc4, #45b7d1);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                margin-bottom: 15px;
                transition: transform 0.3s ease;
            }
            
            .refresh-btn:hover {
                transform: scale(1.05);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎮 Mini Pokemon API</h1>
                <p>Interface de jeu interactive - Pas besoin de Postman !</p>
            </div>
            
            <div class="game-section">
                <h2>🥊 Zone de Combat</h2>
                
                <div class="trainer-select">
                    <div class="trainer-option" data-trainer="1">
                        <h4>Ash</h4>
                        <p>Dresseur ID: 1</p>
                        <button class="refresh-btn" onclick="showTeam(1)">Équipe</button>
                    </div>
                    <div class="trainer-option" data-trainer="2">
                        <h4>Gary</h4>
                        <p>Dresseur ID: 2</p>
                        <button class="refresh-btn" onclick="showTeam(2)">Équipe</button>
                    </div>
                    <div class="trainer-option" data-trainer="3">
                        <h4>Misty</h4>
                        <p>Dresseur ID: 3</p>
                        <button class="refresh-btn" onclick="showTeam(3)">Équipe</button>
                    </div>
                </div>
                
                <div class="battle-controls">
                    <button class="battle-btn" onclick="startBattle('random-challenge')">
                        🎲 Défi Aléatoire
                    </button>
                    <button class="battle-btn" onclick="startBattle('arena1')">
                        🏟️ Arène 1 (100 combats)
                    </button>
                    <button class="battle-btn" onclick="startBattle('deterministic-challenge')">
                        ⚔️ Défi Déterministe
                    </button>
                    <button class="battle-btn" onclick="startBattle('arena2')">
                        🥊 Arène 2 (100 combats déterministes)
                    </button>
                </div>
                
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>Combat en cours...</p>
                </div>
                
                <div class="result" id="result">
                    <h3>Résultat du combat :</h3>
                    <div id="resultContent"></div>
                </div>
            </div>
            
            <div class="data-section">
                <div class="data-card">
                    <h3>👨‍🏫 Dresseurs</h3>
                    <button class="refresh-btn" onclick="loadData('trainers')">🔄 Actualiser</button>
                    <div class="data-content" id="trainersData">Chargement...</div>
                </div>
                
                <div class="data-card">
                    <h3>⚡ Pokémon</h3>
                    <button class="refresh-btn" onclick="loadData('pokemon')">🔄 Actualiser</button>
                    <div class="data-content" id="pokemonData">Chargement...</div>
                </div>
                
                <div class="data-card">
                    <h3>⚔️ Attaques</h3>
                    <button class="refresh-btn" onclick="loadData('attacks')">🔄 Actualiser</button>
                    <div class="data-content" id="attacksData">Chargement...</div>
                </div>
            </div>
        </div>

        <div id="teamModal" style="display:none; position: fixed; inset: 0; background: rgba(0,0,0,0.6);">
          <div style="max-width: 600px; margin: 60px auto; background: white; color: #222; border-radius: 12px; padding: 20px;">
            <div style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 10px;">
              <h3 id="teamTitle" style="margin:0;">Équipe</h3>
              <button onclick="closeTeam()" style="border:none; background:#ff6b6b; color:white; padding:8px 12px; border-radius:8px; cursor:pointer;">Fermer</button>
            </div>
            <div id="teamContent" style="max-height: 400px; overflow:auto; font-family: 'Courier New', monospace;"></div>
          </div>
        </div>
 
        <script>
            let selectedTrainers = [];
            
            // Sélection des dresseurs
            document.querySelectorAll('.trainer-option').forEach(option => {
                option.addEventListener('click', () => {
                    const trainerId = parseInt(option.dataset.trainer);
                    
                    if (selectedTrainers.includes(trainerId)) {
                        selectedTrainers = selectedTrainers.filter(id => id !== trainerId);
                        option.classList.remove('selected');
                    } else if (selectedTrainers.length < 2) {
                        selectedTrainers.push(trainerId);
                        option.classList.add('selected');
                    }
                });
            });
            
            // Charger les données
            async function loadData(type) {
                try {
                    const response = await fetch('/api/' + type);
                    const data = await response.json();
                    document.getElementById(type + 'Data').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById(type + 'Data').textContent = 'Erreur: ' + error.message;
                }
            }
            
            // Démarrer un combat en temps réel (SSE) sur les endpoints existants
            function startBattle(battleType) {
                if (selectedTrainers.length !== 2) {
                    alert('Veuillez sélectionner exactement 2 dresseurs !');
                    return;
                }

                const result = document.getElementById('result');
                const resultContent = document.getElementById('resultContent');
                resultContent.innerHTML = '<p>Connexion au flux...</p>';
                result.classList.add('show');

                const url = '/api/battles/' + encodeURIComponent(battleType) +
                  '?trainer1Id=' + encodeURIComponent(selectedTrainers[0]) +
                  '&trainer2Id=' + encodeURIComponent(selectedTrainers[1]);

                const eventSource = new EventSource(url);

                eventSource.addEventListener('start', function (e) {
                    const data = JSON.parse(e.data);
                    resultContent.innerHTML = '';
                    if (data.battleType) appendLine('Début: ' + data.battleType);
                    appendLine('Dresseur 1: ' + data.trainer1.name + ' | Dresseur 2: ' + data.trainer2.name);
                    if (data.pokemon1 && data.pokemon2) {
                      appendLine('Pokémon 1: ' + data.pokemon1.name + ' | Pokémon 2: ' + data.pokemon2.name);
                    }
                    appendLine('---');
                });

                eventSource.addEventListener('turn', function (e) {
                    const data = JSON.parse(e.data);
                    const atk = data.attackName ? (' avec ' + data.attackName + ' (-' + data.damage + ' PV)') : '';
                    appendLine('Round ' + data.round + ': ' + data.attacker + ' attaque ' + data.defender + atk + ' | PV ' + data.defender + ': ' + data.defenderLife);
                });

                eventSource.addEventListener('progress', function (e) {
                    const data = JSON.parse(e.data);
                    appendLine('Combat ' + data.fight + (data.fightWinner ? (' - Vainqueur: ' + data.fightWinner) : ''));
                });

                eventSource.addEventListener('end', function (e) {
                    const data = JSON.parse(e.data);
                    appendLine('---');
                    if (typeof data.rounds === 'number') {
                      appendLine('Fin en ' + data.rounds + ' rounds');
                    }
                    if (typeof data.fights === 'number' || typeof data.fights === 'undefined') {
                      if (typeof data.fights === 'number') appendLine('Total combats: ' + data.fights);
                    }
                    if (data.winner && data.loser) {
                      appendLine('Gagnant: ' + data.winner.name + ' | Perdant: ' + data.loser.name);
                    }
                    eventSource.close();
                    loadData('trainers');
                });

                eventSource.addEventListener('error', function (e) {
                    try {
                        const data = JSON.parse(e.data);
                        appendLine('Erreur: ' + data.message);
                    } catch (_) {
                        appendLine('Erreur de flux.');
                    }
                    eventSource.close();
                });

                function appendLine(text) {
                    const p = document.createElement('p');
                    p.textContent = text;
                    resultContent.appendChild(p);
                }
            }

            // Afficher l'équipe d'un dresseur
            async function showTeam(trainerId) {
              try {
                const res = await fetch('/api/trainers/' + trainerId);
                const data = await res.json();
                const team = (data.pokemon || []).map(p => {
                  const attacks = (p.attacks || []).map(a => a.name + ' (' + a.damage + ', ' + a.usageCount + '/' + a.usageLimit + ')').join(', ');
                  return '- ' + p.name + ' | PV: ' + p.lifePoints + '/' + p.maxLifePoints + (attacks ? (' | Attaques: ' + attacks) : '');
                }).join('\n');
                document.getElementById('teamTitle').textContent = 'Équipe de ' + data.name + ' (niv. ' + data.level + ')';
                document.getElementById('teamContent').textContent = team || 'Aucun Pokémon';
                document.getElementById('teamModal').style.display = 'block';
              } catch (e) {
                alert('Impossible de charger l\'équipe');
              }
            }

            function closeTeam() {
              document.getElementById('teamModal').style.display = 'none';
            }
            
            // Expose to global scope for inline onclick handlers
            window.startBattle = startBattle;
            window.showTeam = showTeam;
            window.closeTeam = closeTeam;
            window.loadData = loadData;
            
            // Charger les données au démarrage
            window.onload = () => {
                loadData('trainers');
                loadData('pokemon');
                loadData('attacks');
            };
        </script>
    </body>
    </html>
  `);
});
app.use((req, res) => {
    res.status(404).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Mini Pokemon API</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
            }
            .error-container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            h1 { font-size: 4rem; margin-bottom: 20px; }
            p { font-size: 1.2rem; margin-bottom: 30px; }
            a { 
                color: #ffd700; 
                text-decoration: none; 
                font-weight: bold;
                font-size: 1.1rem;
            }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>🔍 404</h1>
            <p>Endpoint non trouvé</p>
            <a href="/">← Retour à l'accueil</a>
        </div>
    </body>
    </html>
  `);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Mini Pokemon API</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
            }
            .error-container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            h1 { font-size: 4rem; margin-bottom: 20px; }
            p { font-size: 1.2rem; margin-bottom: 30px; }
            a { 
                color: #ffd700; 
                text-decoration: none; 
                font-weight: bold;
                font-size: 1.1rem;
            }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>💥 500</h1>
            <p>Erreur interne du serveur</p>
            <a href="/">← Retour à l'accueil</a>
        </div>
    </body>
    </html>
  `);
});
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
//# sourceMappingURL=index.js.map