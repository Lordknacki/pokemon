document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    document.getElementById("start-game").addEventListener("click", () => {
        // Cacher la phase de sélection et afficher la phase de combat
        document.getElementById("selection-phase").classList.add("hidden");
        document.getElementById("combat-phase").classList.remove("hidden");
        initCombat();
    });
});

let selectedPokemon = [];

// Récupérer les 150 premiers Pokémon
async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();

        for (let i = 1; i <= 150; i++) {
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

// Créer une carte pour chaque Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    // Affichage des statistiques au survol
    card.addEventListener('mouseover', (e) => showStatsModal(pokemon, e));
    card.addEventListener('mouseout', () => hideStatsModal());

    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));

    return card;
}

// Fonction pour afficher la fenêtre modale des statistiques
function showStatsModal(pokemon, event) {
    const modal = document.getElementById("stats-modal");
    const statsHTML = pokemon.stats.map(stat => `<p>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</p>`).join('');
    
    modal.querySelector(".pokemon-name").textContent = pokemon.name;
    modal.querySelector(".pokemon-stats").innerHTML = statsHTML;

    // Affichage des types
    const typesHTML = pokemon.types.map(type => `<span class="pokemon-type type-${type.type.name}">${type.type.name.toUpperCase()}</span>`).join('');
    modal.querySelector(".pokemon-types").innerHTML = typesHTML;

    // Obtenir les dimensions de la carte Pokémon et ajuster la position de la modale
    const cardRect = event.target.getBoundingClientRect();
    const modalHeight = modal.offsetHeight;
    
    // Positionner la modale juste au-dessus de la carte
    modal.style.left = `${cardRect.left + window.scrollX}px`;
    modal.style.top = `${cardRect.top + window.scrollY - modalHeight - 10}px`; // 10px d'espace au-dessus du Pokémon

    modal.classList.add("show");
}

// Fonction pour masquer la fenêtre modale des statistiques
function hideStatsModal() {
    document.getElementById("stats-modal").classList.remove("show");
}

// Fonction pour sélectionner ou désélectionner un Pokémon
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
    teamContainer.innerHTML = ''; // Réinitialiser

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        img.alt = pokemon.name;
        teamContainer.appendChild(img);
    });
}
