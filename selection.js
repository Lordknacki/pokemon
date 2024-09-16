document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
});

let selectedPokemon = [];
let allPokemonData = [];

async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386');
        const data = await response.json();
        const pokemonList = data.results;

        const pokemonListWithIds = pokemonList.map(pokemon => {
            const id = pokemon.url.split("/").filter(Boolean).pop();
            return { name: translatePokemonName(pokemon.name), id: parseInt(id), url: pokemon.url };
        });

        pokemonListWithIds.sort((a, b) => a.id - b.id);
        allPokemonData = pokemonListWithIds;

        for (let pokemon of pokemonListWithIds) {
            await fetchPokemonDetails(pokemon.id);
        }

        setupPokemonSelection();
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon:", error);
    }
}

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

function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.dataset.pokemonId = pokemon.id;

    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('mouseenter', () => showPokemonStats(pokemon, card));
    card.addEventListener('mouseleave', () => hidePokemonStats());
    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    return card;
}

function setupPokemonSelection() {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        card.addEventListener('click', function() {
            const pokemonId = parseInt(this.dataset.pokemonId);
            togglePokemonSelection(pokemonId, this);
        });
    });
}

function togglePokemonSelection(pokemonId, card) {
    const isSelected = selectedPokemon.some(p => p.id === pokemonId);
    if (isSelected) {
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemonId);
        card.classList.remove('selected');
    } else if (selectedPokemon.length < 6) {
        selectedPokemon.push({ id: pokemonId, card: card });
        card.classList.add('selected');
    }
    updateTeamDisplay();
}

function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = '';
    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        img.alt = `Sprite de ${pokemon.card.querySelector('h3').textContent}`;
        teamContainer.appendChild(img);
    });
}

function showPokemonStats(pokemon, card) {
    const statsModal = document.getElementById("stats-modal");
    statsModal.innerHTML = `
        <div class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
        <div class="pokemon-types">
            ${pokemon.types.map(type => `<span class="pokemon-type type-${type.type.name}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</span>`).join('')}
        </div>
        <div class="pokemon-stats">
            <p>HP: ${pokemon.stats[0].base_stat}</p>
            <p>Attaque: ${pokemon.stats[1].base_stat}</p>
            <p>Défense: ${pokemon.stats[2].base_stat}</p>
            <p>Attaque Spéciale: ${pokemon.stats[3].base_stat}</p>
            <p>Défense Spéciale: ${pokemon.stats[4].base_stat}</p>
            <p>Vitesse: ${pokemon.stats[5].base_stat}</p>
        </div>
    `;
    statsModal.style.display = "block";
}

function hidePokemonStats() {
    const statsModal = document.getElementById("stats-modal");
    statsModal.style.display = "none";
}

function translatePokemonName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

document.getElementById('start-game').addEventListener('click', () => {
    if (selectedPokemon.length === 6) {
        document.getElementById('selection-phase').classList.add('hidden');
        document.getElementById('combat-phase').classList.remove('hidden');
        initializeCombat();
    } else {
        alert("Tu dois sélectionner 6 Pokémon pour commencer le combat !");
    }
});

function initializeCombat() {
    console.log("Le combat commence avec ces Pokémon:", selectedPokemon.map(p => p.id));
}
