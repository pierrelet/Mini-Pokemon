// Client-side app script
(function(){
  let selectedTrainers = [];

  // Selection handlers
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.trainer-option').forEach(function(option){
      option.addEventListener('click', function(){
        var trainerId = parseInt(option.dataset.trainer);
        if (selectedTrainers.indexOf(trainerId) !== -1) {
          selectedTrainers = selectedTrainers.filter(function(id){ return id !== trainerId; });
          option.classList.remove('selected');
        } else if (selectedTrainers.length < 2) {
          selectedTrainers.push(trainerId);
          option.classList.add('selected');
        }
      });
    });
  });

  async function loadData(type){
    try {
      const response = await fetch('/api/' + type);
      const data = await response.json();
      const el = document.getElementById(type + 'Data');
      if (el) el.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      const el = document.getElementById(type + 'Data');
      if (el) el.textContent = 'Erreur: ' + error.message;
    }
  }

  function startBattle(battleType){
    if (selectedTrainers.length !== 2) {
      alert('Veuillez sélectionner exactement 2 dresseurs !');
      return;
    }

    const result = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    if (!result || !resultContent) return;
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
      if (typeof data.fights === 'number') {
        appendLine('Total combats: ' + data.fights);
      }
      if (data.winner && data.loser) {
        appendLine('Gagnant: ' + data.winner.name + ' | Perdant: ' + data.loser.name);
      }
      eventSource.close();
      loadData('trainers');
    });

    eventSource.addEventListener('error', function () {
      appendLine('Erreur de flux.');
      eventSource.close();
    });

    function appendLine(text) {
      const p = document.createElement('p');
      p.textContent = text;
      resultContent.appendChild(p);
    }
  }

  async function showTeam(trainerId){
    try {
      const res = await fetch('/api/trainers/' + trainerId);
      const data = await res.json();
      const team = (data.pokemon || []).map(function(p){
        const attacks = (p.attacks || []).map(function(a){ return a.name + ' (' + a.damage + ', ' + a.usageCount + '/' + a.usageLimit + ')'; }).join(', ');
        return '- ' + p.name + ' | PV: ' + p.lifePoints + '/' + p.maxLifePoints + (attacks ? (' | Attaques: ' + attacks) : '');
      }).join('\n');
      document.getElementById('teamTitle').textContent = 'Équipe de ' + data.name + ' (niv. ' + data.level + ')';
      document.getElementById('teamContent').textContent = team || 'Aucun Pokémon';
      document.getElementById('teamModal').style.display = 'block';
    } catch (e) {
      alert('Impossible de charger l\'équipe');
    }
  }

  function closeTeam(){
    document.getElementById('teamModal').style.display = 'none';
  }

  async function createTrainer(){
    const name = document.getElementById('newTrainerName').value.trim();
    if (!name) {
      alert('Veuillez entrer un nom de dresseur');
      return;
    }
    try {
      const res = await fetch('/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
      });
      if (res.ok) {
        alert('Dresseur créé !');
        document.getElementById('newTrainerName').value = '';
        loadData('trainers');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible de créer le dresseur'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  async function createPokemon(){
    const name = document.getElementById('newPokemonName').value.trim();
    const hp = parseInt(document.getElementById('newPokemonHP').value);
    if (!name || !hp || hp < 1) {
      alert('Veuillez entrer un nom et des PV valides');
      return;
    }
    try {
      const res = await fetch('/api/pokemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, maxLifePoints: hp })
      });
      if (res.ok) {
        alert('Pokémon créé !');
        document.getElementById('newPokemonName').value = '';
        document.getElementById('newPokemonHP').value = '';
        loadData('pokemon');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible de créer le Pokémon'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  async function createAttack(){
    const name = document.getElementById('newAttackName').value.trim();
    const damage = parseInt(document.getElementById('newAttackDamage').value);
    const limit = parseInt(document.getElementById('newAttackLimit').value);
    if (!name || !damage || damage < 1 || !limit || limit < 1) {
      alert('Veuillez remplir tous les champs avec des valeurs valides');
      return;
    }
    try {
      const res = await fetch('/api/attacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, damage: damage, usageLimit: limit })
      });
      if (res.ok) {
        alert('Attaque créée !');
        document.getElementById('newAttackName').value = '';
        document.getElementById('newAttackDamage').value = '';
        document.getElementById('newAttackLimit').value = '';
        loadData('attacks');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible de créer l\'attaque'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  async function teachAttack(){
    const pokemonId = parseInt(document.getElementById('teachPokemonId').value);
    const attackId = parseInt(document.getElementById('teachAttackId').value);
    if (!pokemonId || !attackId || pokemonId < 1 || attackId < 1) {
      alert('Veuillez entrer des IDs valides');
      return;
    }
    try {
      const res = await fetch('/api/pokemon/' + pokemonId + '/learn-attack/' + attackId, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Attaque enseignée !');
        document.getElementById('teachPokemonId').value = '';
        document.getElementById('teachAttackId').value = '';
        loadData('pokemon');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible d\'enseigner l\'attaque'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  async function addPokemonToTrainer(){
    const pokemonId = parseInt(document.getElementById('addPokemonId').value);
    const trainerId = parseInt(document.getElementById('addTrainerId').value);
    if (!pokemonId || !trainerId || pokemonId < 1 || trainerId < 1) {
      alert('Veuillez entrer des IDs valides');
      return;
    }
    try {
      const res = await fetch('/api/trainers/' + trainerId + '/pokemon/' + pokemonId, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Pokémon ajouté au dresseur !');
        document.getElementById('addPokemonId').value = '';
        document.getElementById('addTrainerId').value = '';
        loadData('trainers');
        loadData('pokemon');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible d\'ajouter le Pokémon'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  async function healPokemon(){
    const pokemonId = parseInt(document.getElementById('healPokemonId').value);
    if (!pokemonId || pokemonId < 1) {
      alert('Veuillez entrer un ID valide');
      return;
    }
    try {
      const res = await fetch('/api/pokemon/' + pokemonId + '/heal', {
        method: 'POST'
      });
      if (res.ok) {
        alert('Pokémon soigné !');
        document.getElementById('healPokemonId').value = '';
        loadData('pokemon');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible de soigner le Pokémon'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  async function healTrainer(){
    const trainerId = parseInt(document.getElementById('healTrainerId').value);
    if (!trainerId || trainerId < 1) {
      alert('Veuillez entrer un ID valide');
      return;
    }
    try {
      const res = await fetch('/api/trainers/' + trainerId + '/heal', {
        method: 'POST'
      });
      if (res.ok) {
        alert('Tous les Pokémon du dresseur ont été soignés !');
        document.getElementById('healTrainerId').value = '';
        loadData('trainers');
        loadData('pokemon');
      } else {
        const err = await res.json();
        alert('Erreur: ' + (err.error || err.message || 'Impossible de soigner les Pokémon'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  // Expose globally for inline onclick
  window.startBattle = startBattle;
  window.showTeam = showTeam;
  window.closeTeam = closeTeam;
  window.loadData = loadData;
  window.createTrainer = createTrainer;
  window.createPokemon = createPokemon;
  window.createAttack = createAttack;
  window.teachAttack = teachAttack;
  window.addPokemonToTrainer = addPokemonToTrainer;
  window.healPokemon = healPokemon;
  window.healTrainer = healTrainer;

  // Initial load
  window.addEventListener('load', function(){
    loadData('trainers');
    loadData('pokemon');
    loadData('attacks');
  });
})();
