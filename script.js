document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    document.getElementById("start-game").addEventListener("click", startBattlePhase);
});

let selectedPokemon = [];
let currentTrainer = 1; // Compteur pour les dresseurs

// Récupérer les 150 premiers Pokémon
async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        const pokemonList = data.results;

        pokemonList.forEach((pokemon, index) => {
            fetchPokemonDetails(index + 1);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon:", error);
    }
}

// Récupérer les détails d'un Pokémon par son ID
async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();

        const pokemonCard = createPokemonCard(pokemon);
        document.getElementById("pokemon-list").appendChild(pokemonCard);
    } catch (error) {
        console.error("Erreur lors de la récupération des détails Pokémon:", error);
    }
}

// Créer une carte pour chaque Pokémon avec les images officielles
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // Utiliser l'URL pour les artworks officiels pour la sélection
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    return card;
}

// Fonction pour gérer la sélection ou la désélection d'un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        card.classList.remove('selected'); // Retirer le style de sélection
    } else if (selectedPokemon.length < 6) {
        selectedPokemon.push(pokemon);
        card.classList.add('selected'); // Ajouter un style visuel pour indiquer la sélection
    }

    updateTeamDisplay();
    document.getElementById('start-game').disabled = selectedPokemon.length !== 6;
}

// Mettre à jour l'affichage de l'équipe avec les images officielles pour le combat
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; 

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        img.alt = pokemon.name;
        teamContainer.appendChild(img);
    });
}

// Phase de combat après la sélection
function startBattlePhase() {
    document.getElementById("selection-phase").classList.add("hidden");
    document.getElementById("combat-phase").classList.remove("hidden");
    startBattle(selectedPokemon, currentTrainer);
}

// Démarrer le combat après la sélection
function startBattle(playerTeam, trainerNumber) {
    let opponentTeam;

    // Le dernier dresseur a une équipe fixe
    if (trainerNumber === 8) {
        opponentTeam = ["Venusaur", "Charizard", "Blastoise", "Dragonite", "Aerodactyl", "Mewtwo"];
    } else {
        opponentTeam = getRandomPokemonTeam();
    }

    document.getElementById("player-pokemon").innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${playerTeam[0].id}.gif" alt="${playerTeam[0].name}">
    `;
    
    document.getElementById("opponent-pokemon").innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${getPokemonIdByName(opponentTeam[0])}.gif" alt="${opponentTeam[0]}">
    `;

    setupBattle(playerTeam, opponentTeam);
}

// Générer une équipe aléatoire pour les dresseurs
function getRandomPokemonTeam() {
    const allPokemon = ["Bulbasaur", "Charmander", "Squirtle", "Pidgeotto", "Butterfree", "Beedrill", "Raticate", "Fearow"];
    let randomTeam = [];
    while (randomTeam.length < 6) {
        const randomIndex = Math.floor(Math.random() * allPokemon.length);
        const pokemon = allPokemon[randomIndex];
        if (!randomTeam.includes(pokemon)) {
            randomTeam.push(pokemon);
        }
    }
    return randomTeam;
}

// Récupérer l'ID du Pokémon par son nom pour afficher le sprite animé
function getPokemonIdByName(name) {
    const pokemonMap = {
        "Bulbasaur": 1,
        "Charmander": 4,
        "Squirtle": 7,
        "Pidgeotto": 17,
        "Butterfree": 12,
        "Beedrill": 15,
        "Raticate": 20,
        "Fearow": 22,
        "Venusaur": 3,
        "Charizard": 6,
        "Blastoise": 9,
        "Dragonite": 149,
        "Aerodactyl": 142,
        "Mewtwo": 150
    };
    return pokemonMap[name];
}

// Préparer le combat avec les statistiques et attaques des Pokémon
function setupBattle(playerTeam, opponentTeam) {
    fetchPokemonMoves(playerTeam[0], "player");
    fetchPokemonMoves({ name: opponentTeam[0] }, "opponent");

    document.getElementById("attack-button").addEventListener("click", () => {
        document.getElementById("attack-menu").classList.remove("hidden");
    });
}

// Récupérer les attaques des Pokémon depuis PokéAPI
async function fetchPokemonMoves(pokemon, type) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
    const data = await response.json();

    pokemon.moves = data.moves.slice(0, 4).map(move => move.move.name); // Sélectionner 4 attaques
    if (type === "player") {
        displayPlayerMoves(pokemon.moves);
    }
}

// Afficher les attaques du joueur dans le menu
function displayPlayerMoves(moves) {
    const attackList = document.getElementById("attack-list");
    attackList.innerHTML = ''; // Réinitialiser la liste d'attaques

    moves.forEach((move) => {
        const moveItem = document.createElement("li");
        moveItem.textContent = move;
        moveItem.addEventListener("click", () => {
            console.log(`${move} a été utilisé !`);
            document.getElementById("attack-menu").classList.add("hidden");
        });
        attackList.appendChild(moveItem);
    });
}
