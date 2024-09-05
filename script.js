document.addEventListener("DOMContentLoaded", () => {
    let currentTrainer = 1; // Compteur pour les dresseurs
    const maxTrainers = 8; // Nombre total de dresseurs à affronter
    let selectedPokemon = []; // Stocker l'équipe du joueur

    // Récupération des Pokémon disponibles pour la sélection
    fetchPokemonData();

    document.getElementById("start-game").addEventListener("click", () => {
        // Masquer la phase de sélection et lancer la phase de combat
        document.getElementById("selection-phase").classList.add("hidden");
        document.getElementById("combat-phase").classList.remove("hidden");
        startBattle(selectedPokemon, currentTrainer);
    });
});

// Récupérer les 150 premiers Pokémon pour la sélection
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

// Récupérer les détails d'un Pokémon pour la sélection
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

// Créer une carte pour chaque Pokémon lors de la sélection
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // Utiliser l'URL des artworks pour l'affichage des Pokémon
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    return card;
}

// Sélectionner ou désélectionner un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        // Si le Pokémon est déjà sélectionné, le retirer de l'équipe
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        card.classList.remove('selected');
    } else if (selectedPokemon.length < 6) {
        // Ajouter le Pokémon à l'équipe
        selectedPokemon.push(pokemon);
        card.classList.add('selected');
    }

    // Mettre à jour l'affichage de l'équipe
    updateTeamDisplay();

    // Activer le bouton "Commencer le Combat" si 6 Pokémon sont sélectionnés
    document.getElementById('start-game').disabled = selectedPokemon.length !== 6;
}

// Mettre à jour l'affichage de l'équipe
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; 

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIl semble que mon message précédent ait été coupé. Voici donc le **code complet JavaScript**, incluant la sélection des Pokémon et leur affichage, ainsi que la transition vers la phase de combat :

```javascript
document.addEventListener("DOMContentLoaded", () => {
    let currentTrainer = 1; // Compteur pour les dresseurs
    const maxTrainers = 8; // Nombre total de dresseurs à affronter
    let selectedPokemon = []; // Stocker l'équipe du joueur

    // Récupération des Pokémon disponibles pour la sélection
    fetchPokemonData();

    document.getElementById("start-game").addEventListener("click", () => {
        // Masquer la phase de sélection et lancer la phase de combat
        document.getElementById("selection-phase").classList.add("hidden");
        document.getElementById("combat-phase").classList.remove("hidden");
        startBattle(selectedPokemon, currentTrainer);
    });
});

// Récupérer les 150 premiers Pokémon pour la sélection
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

// Récupérer les détails d'un Pokémon pour la sélection
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

// Créer une carte pour chaque Pokémon lors de la sélection
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // Utiliser l'URL des artworks pour l'affichage des Pokémon
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    return card;
}

// Sélectionner ou désélectionner un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        // Si le Pokémon est déjà sélectionné, le retirer de l'équipe
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        card.classList.remove('selected');
    } else if (selectedPokemon.length < 6) {
        // Ajouter le Pokémon à l'équipe
        selectedPokemon.push(pokemon);
        card.classList.add('selected');
    }

    // Mettre à jour l'affichage de l'équipe
    updateTeamDisplay();

    // Activer le bouton "Commencer le Combat" si 6 Pokémon sont sélectionnés
    document.getElementById('start-game').disabled = selectedPokemon.length !== 6;
}

// Mettre à jour l'affichage de l'équipe
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

// Démarrer le combat avec un dresseur aléatoire ou le dernier dresseur fixe
function startBattle(playerTeam, trainerNumber) {
    let opponentTeam;

    if (trainerNumber === 8) {
        // Le dernier dresseur a une équipe fixe
        opponentTeam = ["Venusaur", "Charizard", "Blastoise", "Dragonite", "Aerodactyl", "Mewtwo"];
    } else {
        // Dresseur avec équipe aléatoire pour les premiers rounds
        opponentTeam = getRandomPokemonTeam();
    }

    document.getElementById("player-pokemon").textContent = `Ton Pokémon : ${playerTeam[0].name}`;
    document.getElementById("opponent-pokemon").textContent = `Dresseur ${trainerNumber} : ${opponentTeam[0]}`;

    setupBattle(playerTeam, opponentTeam);
}

// Obtenir une équipe aléatoire pour les dresseurs aléatoires
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

// Initialiser les statistiques et attaques du combat
function setupBattle(playerTeam, opponentTeam) {
    // Afficher les stats des Pokémon et préparer le menu d'attaques
    fetchPokemonMoves(playerTeam[0], "player");
    fetchPokemonMoves({ name: opponentTeam[0] }, "opponent");

    document.getElementById("attack-button").addEventListener("click", () => {
        document.getElementById("attack-menu").classList.remove("hidden");
    });
}

// Récupérer les attaques des Pokémon à partir de PokéAPI
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
    attackList.innerHTML = "";

    moves.forEach((move) => {
        const moveItem = document.createElement("li");
        moveItem.textContent = move;
        moveItem.addEventListener("click", () => {
            console.log(`${move} a été utilisé!`);
            document.getElementById("attack-menu").classList.add("hidden");
            // Ajouter la logique de dégâts ici
        });
        attackList.appendChild(moveItem);
    });
}
