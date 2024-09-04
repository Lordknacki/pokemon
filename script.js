document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
});

let selectedPokemon = [];

// Récupérer les 150 premiers Pokémon
async function fetchPokemonData() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
    const data = await response.json();
    const pokemonList = data.results;

    pokemonList.forEach((pokemon, index) => {
        fetchPokemonDetails(index + 1);  // Récupérer les détails de chaque Pokémon
    });
}

// Récupérer les détails d'un Pokémon par son ID
async function fetchPokemonDetails(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();

    const pokemonCard = createPokemonCard(pokemon);
    document.getElementById("pokemon-list").appendChild(pokemonCard);
}

// Créer une carte pour chaque Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const pokemonImage = pokemon.sprites.front_default;
    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('click', () => selectPokemon(pokemon));
    return card;
}

// Sélectionner un Pokémon et l'ajouter à l'équipe
function selectPokemon(pokemon) {
    if (selectedPokemon.length < 6) {
        selectedPokemon.push(pokemon);
        updateTeamDisplay();
    }

    // Activer le bouton de début si 6 Pokémon sont sélectionnés
    if (selectedPokemon.length === 6) {
        document.getElementById('start-game').disabled = false;
    }
}

// Mettre à jour l'affichage de l'équipe
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = '';  // Effacer l'équipe précédente

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;
        teamContainer.appendChild(img);
    });
}
