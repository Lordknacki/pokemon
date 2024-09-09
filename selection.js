document.addEventListener("DOMContentLoaded", () => {
    // Charger les Pokémon depuis l'API dès que le DOM est prêt
    fetchPokemonData();
    // Activer le bouton "Commencer le Combat" après la sélection
    document.getElementById("start-game").addEventListener("click", () => {
        // Cacher la phase de sélection et afficher la phase de combat
        document.getElementById("selection-phase").classList.add("hidden");
        document.getElementById("combat-phase").classList.remove("hidden");
        initCombat(); // Appeler la fonction pour démarrer le combat dans combat.js
    });
});

let selectedPokemon = [];

// Récupérer les 150 premiers Pokémon depuis l'API
async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        const pokemonList = data.results;

        // Récupérer les détails de chaque Pokémon par son ID
        for (let i = 0; i < pokemonList.length; i++) {
            await fetchPokemonDetails(i + 1); // Ajouter l'ID du Pokémon pour récupérer ses détails
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon :", error);
    }
}

// Récupérer les détails d'un Pokémon par son ID
async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();
        const pokemonCard = createPokemonCard(pokemon);
        document.getElementById("pokemon-list").appendChild(pokemonCard); // Ajouter chaque carte Pokémon dans la liste
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du Pokémon :", error);
    }
}

// Créer une carte pour chaque Pokémon avec son image et son nom
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // Image et nom du Pokémon à partir de l'API
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    // Ajouter un gestionnaire d'événement pour la sélection de Pokémon
    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));

    return card;
}

// Gérer la sélection/désélection d'un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        // Si le Pokémon est déjà sélectionné, le retirer de l'équipe
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        card.classList.remove('selected'); // Retirer le style de sélection
    } else if (selectedPokemon.length < 6) {
        // Ajouter le Pokémon si l'équipe a moins de 6 Pokémon
        selectedPokemon.push(pokemon);
        card.classList.add('selected'); // Ajouter un style visuel pour indiquer la sélection
    }

    // Mettre à jour l'affichage de l'équipe
    updateTeamDisplay();
    // Activer ou désactiver le bouton "Commencer le Combat"
    toggleStartButton();
}

// Mettre à jour l'affichage de l'équipe avec les Pokémon sélectionnés
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; // Réinitialiser le conteneur de l'équipe

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        img.alt = pokemon.name;
        teamContainer.appendChild(img);
    });
}

// Activer ou désactiver le bouton "Commencer le Combat"
function toggleStartButton() {
    const startButton = document.getElementById("start-game");
    startButton.disabled = selectedPokemon.length !== 6; // Activer le bouton si 6 Pokémon sont sélectionnés
}
