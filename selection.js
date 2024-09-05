document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    document.getElementById("start-game").addEventListener("click", () => {
        // Cacher la phase de sélection et passer à la phase de combat
        document.getElementById("selection-phase").classList.add("hidden");
        document.getElementById("combat-phase").classList.remove("hidden");
        initCombat(); // Appeler la fonction de la phase de combat
    });
});

let selectedPokemon = [];

// Récupérer les 150 premiers Pokémon dans l'ordre du Pokédex
async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        const pokemonList = data.results;

        // Garde l'ordre du Pokédex en récupérant les Pokémon par ID
        for (let i = 1; i <= 150; i++) {
            await fetchPokemonDetails(i);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon:", error);
    }
}

// Récupérer les détails d'un Pokémon par son ID, y compris ses statistiques et types
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

    // Utiliser l'image officielle du Pokémon et afficher les types
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    // Obtenir les types du Pokémon et générer les icônes correspondantes
    const typesHTML = pokemon.types
        .map(type => `<img src="https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type.type.name}.svg" alt="${type.type.name}" class="type-icon">`)
        .join("");

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <div class="types">${typesHTML}</div>
        <div class="stats hidden" id="stats-${pokemon.id}">
            <p>HP: ${pokemon.stats[0].base_stat}</p>
            <p>Attaque: ${pokemon.stats[1].base_stat}</p>
            <p>Défense: ${pokemon.stats[2].base_stat}</p>
            <p>Vitesse: ${pokemon.stats[5].base_stat}</p>
        </div>
    `;

    // Ajouter l'événement pour afficher les stats au survol
    card.addEventListener('mouseover', () => {
        document.getElementById(`stats-${pokemon.id}`).classList.remove('hidden');
    });

    // Cacher les stats quand la souris quitte la carte
    card.addEventListener('mouseout', () => {
        document.getElementById(`stats-${pokemon.id}`).classList.add('hidden');
    });

    // Sélectionner ou désélectionner un Pokémon
    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));

    return card;
}

// Sélectionner ou désélectionner un Pokémon
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
