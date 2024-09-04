document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
});

// Fetch Pokémon data for the first 150 Pokémon
async function fetchPokemonData() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
    const data = await response.json();
    const pokemonList = data.results;

    pokemonList.forEach((pokemon, index) => {
        fetchPokemonDetails(index + 1);  // Fetch details by ID (index + 1 corresponds to Pokédex ID)
    });
}

// Fetch details for a single Pokémon
async function fetchPokemonDetails(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();

    const pokemonCard = createPokemonCard(pokemon);
    document.getElementById("pokemon-list").appendChild(pokemonCard);
}

// Create a Pokémon card element
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('click', () => displayPokemonDetails(pokemon));

    return card;
}

// Display Pokémon details in a modal
function displayPokemonDetails(pokemon) {
    const modal = document.getElementById("pokemon-details");
    const detailsContent = document.getElementById("details-content");

    const pokemonTypes = pokemon.types.map(type => type.type.name).join(", ");
    const moves = pokemon.moves.slice(0, 4).map(move => move.move.name).join(", ");

    detailsContent.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p><strong>Type:</strong> ${pokemonTypes}</p>
        <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
        <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
        <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
        <p><strong>Speed:</strong> ${pokemon.stats[5].base_stat}</p>
        <p><strong>Moves:</strong> ${moves}</p>
    `;

    modal.style.display = "flex";

    // Close the modal
    document.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close the modal if clicking outside of content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}
