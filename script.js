document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
});

let selectedPokemon = [];

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

// Créer une carte pour chaque Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // Utiliser l'URL de Pokémon Showdown pour les sprites animés
    const pokemonImage = `https://play.pokemonshowdown.com/sprites/ani/${pokemon.name.toLowerCase()}.gif`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    return card;
}

// Fonction pour gérer la sélection ou la désélection d'un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.includes(pokemon);

    if (isSelected) {
        // Si le Pokémon est déjà sélectionné, le retirer de l'équipe
        selectedPokemon = selectedPokemon.filter(p => p !== pokemon);
        card.classList.remove('selected'); // Retirer le style de sélection
    } else if (selectedPokemon.length < 6) {
        // Ajouter le Pokémon s'il n'est pas déjà sélectionné et que l'équipe a moins de 6 Pokémon
        selectedPokemon.push(pokemon);
        card.classList.add('selected'); // Ajouter un style visuel pour indiquer la sélection
    }

    // Mettre à jour l'affichage de l'équipe
    updateTeamDisplay();

    // Activer ou désactiver le bouton "Commencer le Combat" en fonction de l'état de l'équipe
    document.getElementById('start-game').disabled = selectedPokemon.length !== 6;
}

// Mettre à jour l'affichage de l'équipe
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; 

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://play.pokemonshowdown.com/sprites/ani/${pokemon.name.toLowerCase()}.gif`;
        img.alt = pokemon.name;
        teamContainer.appendChild(img);
    });
}
