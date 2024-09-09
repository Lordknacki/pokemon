// Variables globales
let currentBattle = 0;
const totalBattles = 8;
let playerTeam = [];
let opponentTeam = [];
let playerCurrentPokemonIndex = 0;
let opponentCurrentPokemonIndex = 0;
let playerCurrentPokemon;
let opponentCurrentPokemon;
const terrains = [
    "https://example.com/terrain-grass.png",
    "https://example.com/terrain-water.png",
    "https://example.com/terrain-cave.png",
];
const trainers = [
    { name: "Dresseur Pierre", image: "https://example.com/trainer1.png" },
    { name: "Dresseur Ondine", image: "https://example.com/trainer2.png" },
    // Ajoutez plus de dresseurs ici
];

// Fonction d'initialisation du combat
async function initCombat() {
    // Récupérer l'équipe du joueur depuis la sélection
    playerTeam = selectedPokemon;

    // Démarrer le premier combat
    currentBattle = 0;
    await startBattle();
}

// Fonction pour démarrer un combat
async function startBattle() {
    if (currentBattle >= totalBattles) {
        alert("Félicitations, vous avez vaincu tous les dresseurs !");
        return;
    }

    // Initialiser les variables
    playerCurrentPokemonIndex = 0;
    opponentCurrentPokemonIndex = 0;
    playerCurrentPokemon = playerTeam[playerCurrentPokemonIndex];

    // Charger le dresseur et son équipe
    const trainer = trainers[currentBattle];
    opponentTeam = await generateTrainerTeam(currentBattle);

    // Afficher le terrain, le dresseur, et les Pokémon
    displayBattlefield(trainer);

    // Initialiser les PV des Pokémon
    playerCurrentPokemon.currentHp = playerCurrentPokemon.stats[0].base_stat;
    opponentCurrentPokemon = opponentTeam[opponentCurrentPokemonIndex];
    opponentCurrentPokemon.currentHp = opponentCurrentPokemon.stats[0].base_stat;

    updatePokemonDisplay();
}

// Afficher les informations du champ de bataille
function displayBattlefield(trainer) {
    const terrainImage = terrains[currentBattle % terrains.length];
    document.getElementById("terrain-image").src = terrainImage;
    document.getElementById("trainer-name").textContent = trainer.name;
    document.getElementById("trainer-image").src = trainer.image;
}

// Générer une équipe de dresseurs
async function generateTrainerTeam(difficulty) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
    const data = await response.json();
    const pokemonList = data.results;

    // Générer une équipe de 6 Pokémon
    const team = [];
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        const pokemonData = await fetchPokemonDetails(pokemonList[randomIndex].name);
        team.push(pokemonData);
    }

    // Trier l'équipe en fonction des statistiques
    team.sort((a, b) => getPokemonTotalStats(a) - getPokemonTotalStats(b));
    return team.slice(difficulty, difficulty + 6);
}

// Récupérer les détails des Pokémon
async function fetchPokemonDetails(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return await response.json();
}

// Calculer le total des statistiques d'un Pokémon
function getPokemonTotalStats(pokemon) {
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
}

// Mettre à jour l'affichage des Pokémon sur le champ de bataille
function updatePokemonDisplay() {
    // Afficher le Pokémon du joueur
    document.getElementById("player-pokemon-sprite").src = playerCurrentPokemon.sprites.front_default;
    document.getElementById("player-pokemon-name").textContent = `${playerCurrentPokemon.name} Nv.${playerCurrentPokemon.level || 50}`;

    // Afficher le Pokémon adverse
    document.getElementById("opponent-pokemon-sprite").src = opponentCurrentPokemon.sprites.front_default;
    document.getElementById("opponent-pokemon-name").textContent = `${opponentCurrentPokemon.name} Nv.${opponentCurrentPokemon.level || 50}`;

    // Mettre à jour les barres de santé
    updateHpBar('player', playerCurrentPokemon.currentHp, playerCurrentPokemon.stats[0].base_stat);
    updateHpBar('opponent', opponentCurrentPokemon.currentHp, opponentCurrentPokemon.stats[0].base_stat);

    // Afficher les attaques du Pokémon du joueur
    displayPlayerAttacks();
}

// Mettre à jour les barres de santé
function updateHpBar(side, currentHp, maxHp) {
    const hpBar = document.querySelector(`#${side}-hp`);
    const hpPercentage = (currentHp / maxHp) * 100;
    hpBar.style.width = `${hpPercentage}%`;

    if (hpPercentage > 50) {
        hpBar.className = 'hp-bar hp-green';
    } else if (hpPercentage > 20) {
        hpBar.className = 'hp-bar hp-orange';
    } else {
        hpBar.className = 'hp-bar hp-red';
    }
}

// Afficher les attaques du Pokémon du joueur
function displayPlayerAttacks() {
    const attackMenu = document.getElementById('attack-menu');
    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = '';

    playerCurrentPokemon.moves.slice(0, 4).forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.move.name;
        button.addEventListener('click', () => performAttack(move.move));
        attackOptions.appendChild(button);
    });
}

// Gérer une attaque
function performAttack(move) {
    // Cacher le menu des attaques
    document.getElementById('attack-menu').classList.add('hidden');

    // Calculer les dégâts (simplifié)
    const damage = Math.floor(Math.random() * 20) + 10;

    // Réduire les PV du Pokémon adverse
    opponentCurrentPokemon.currentHp = Math.max(0, opponentCurrentPokemon.currentHp - damage);
    updateHpBar('opponent', opponentCurrentPokemon.currentHp, opponentCurrentPokemon.stats[0].base_stat);

    // Vérifier si le Pokémon adverse est K.O.
    if (opponentCurrentPokemon.currentHp === 0) {
        opponentCurrentPokemonIndex++;
        if (opponentCurrentPokemonIndex >= opponentTeam.length) {
            currentBattle++;
            alert("Vous avez vaincu le dresseur !");
            startBattle();
        } else {
            opponentCurrentPokemon = opponentTeam[opponentCurrentPokemonIndex];
            opponentCurrentPokemon.currentHp = opponentCurrentPokemon.stats[0].base_stat;
            updatePokemonDisplay();
        }
    } else {
        // Le Pokémon adverse attaque
        opponentAttack();
    }
}

// Gérer l'attaque du Pokémon adverse
function opponentAttack() {
    const damage = Math.floor(Math.random() * 20) + 10;

    // Réduire les PV du Pokémon du joueur
    playerCurrentPokemon.currentHp = Math.max(0, playerCurrentPokemon.currentHp - damage);
    updateHpBar('player', playerCurrentPokemon.currentHp, playerCurrentPokemon.stats[0].base_stat);

    if (playerCurrentPokemon.currentHp === 0) {
        playerCurrentPokemonIndex++;
        if (playerCurrentPokemonIndex >= playerTeam.length) {
            alert("Tous vos Pokémon sont K.O. ! Vous avez perdu le combat.");
            document.getElementById('combat-phase').classList.add('hidden');
            document.getElementById('selection-phase').classList.remove('hidden');
        } else {
            playerCurrentPokemon = playerTeam[playerCurrentPokemonIndex];
            playerCurrentPokemon.currentHp = playerCurrentPokemon.stats[0].base_stat;
            updatePokemonDisplay();
        }
    }
}

// Jouer l'animation d'une attaque
function playAttackAnimation(attackName) {
    const attackElement = document.createElement('div');
    attackElement.classList.add('attack-animation');
    attackElement.style.backgroundImage = `url('https://example.com/attacks/${attackName}.png')`;
    document.getElementById('battlefield').appendChild(attackElement);

    setTimeout(() => {
        attackElement.remove();
    }, 1000);
}

// Gérer les boutons du menu de combat
document.getElementById('attack-button').addEventListener('click', () => {
    document.getElementById('attack-menu').classList.remove('hidden');
});

document.getElementById('run-button').addEventListener('click', () => {
    alert("Vous ne pouvez pas fuir un combat de dresseur !");
});

// Initialiser le combat lorsque le joueur clique sur "Commencer le Combat" dans `selection.js`
