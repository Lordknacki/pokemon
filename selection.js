document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
});

let selectedPokemon = [];

// Récupérer les 386 premiers Pokémon dans l'ordre du Pokédex National
async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386&offset=0');
        const data = await response.json();
        const pokemonList = data.results;

        // S'assurer que les Pokémon sont traités dans l'ordre
        for (let i = 1; i <= pokemonList.length; i++) {
            await fetchPokemonDetails(i);
        }
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

    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${capitalize(pokemon.name)}</h3>
    `;

    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    card.addEventListener('mouseover', () => showPokemonStats(pokemon, card));
    card.addEventListener('mouseout', hidePokemonStats);

    return card;
}

// Fonction pour gérer la sélection ou la désélection d'un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        card.classList.remove('selected');
    } else if (selectedPokemon.length < 6) {
        selectedPokemon.push(pokemon);
        card.classList.add('selected');
    }

    updateTeamDisplay();
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

// Affiche les statistiques du Pokémon au survol
function showPokemonStats(pokemon, card) {
    const statsModal = document.getElementById('stats-modal');
    statsModal.querySelector('.pokemon-name').innerText = capitalize(pokemon.name);

    const typesContainer = statsModal.querySelector('.pokemon-types');
    typesContainer.innerHTML = '';
    pokemon.types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.classList.add('pokemon-type', `type-${type.type.name}`);
        typeElement.innerText = capitalize(type.type.name);
        typesContainer.appendChild(typeElement);
    });

    const statsContainer = statsModal.querySelector('.pokemon-stats');
    statsContainer.innerHTML = `
        <p>HP: ${pokemon.stats[0].base_stat}</p>
        <p>Attack: ${pokemon.stats[1].base_stat}</p>
        <p>Defense: ${pokemon.stats[2].base_stat}</p>
        <p>Speed: ${pokemon.stats[5].base_stat}</p>
    `;

    const rect = card.getBoundingClientRect();
    statsModal.style.top = `${rect.top - 80}px`;
    statsModal.style.left = `${rect.left}px`;
    statsModal.classList.add('show');
}

// Masquer la fenêtre modale des statistiques
function hidePokemonStats() {
    const statsModal = document.getElementById('stats-modal');
    statsModal.classList.remove('show');
}

// Fonction utilitaire pour capitaliser les noms
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
