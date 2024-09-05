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

// Récupérer les détails d'un Pokémon
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

// Fonction pour montrer la fenêtre modale des stats
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

// Fonction pour cacher la fenêtre modale des stats
function hideStatsModal() {
    document.getElementById("stats-modal").classList.remove("show");
}

// SéVoici le **code complet en JavaScript** et **CSS**, ajusté pour s'assurer que la fenêtre modale des statistiques des Pokémon s'affiche **toujours au-dessus** du Pokémon sélectionné sans gêner la vue de la carte.

### **1. Code CSS complet**

```css
body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
    text-align: center;
    margin: 0;
    padding: 0;
}

h1 {
    font-size: 3rem;
    margin-top: 20px;
    color: #333;
}

#team-container, #pokemon-list {
    margin: 20px;
}

.pokemon-list {
    display: grid;
    grid-template-columns: repeat(10, 1fr); /* 10 Pokémon par ligne */
    gap: 20px;
    padding: 20px;
}

/* Cartes des Pokémon */
.pokemon-card {
    position: relative;
    border: 2px solid #333;
    background-color: #fff;
    border-radius: 10px;
    transition: 0.3s;
    cursor: pointer;
    padding: 10px;
    text-align: center;
}

.pokemon-card img {
    width: 120px;
    height: 120px;
}

.pokemon-card.selected {
    border: 3px solid #FFD700;
    background-color: rgba(255, 223, 0, 0.2);
}

.team {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.team img {
    width: 80px;
    height: 80px;
}

.start-game {
    padding: 15px 30px;
    font-size: 1.5rem;
    background-color: #ffcb05;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    opacity: 0.5;
}

.start-game:enabled {
    opacity: 1;
    background-color: #f00;
}

/* Fenêtre modale pour les statistiques */
#stats-modal {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    border-radius: 10px;
    display: none;
    z-index: 1000;
    width: 200px;
    transition: opacity 0.3s ease-in-out;
}

#stats-modal.show {
    display: block;
    opacity: 1;
}

#stats-modal .pokemon-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

#stats-modal .pokemon-types {
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
}

#stats-modal .pokemon-stats p {
    margin: 5px 0;
}

.pokemon-type {
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

/* Types de Pokémon avec couleurs */
.type-fire { background-color: #F08030; }
.type-water { background-color: #6890F0; }
.type-grass { background-color: #78C850; }
.type-electric { background-color: #F8D030; }
/* Ajoutez les autres types ici */

/* Terrain de combat */
#battlefield {
    display: flex;
    justify-content: space-around;
    margin: 50px 0;
    padding: 20px;
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'); /* Fond de terrain */
    background-size: cover;
    height: 300px;
}

.pokemon-side {
    width: 40%;
    height: 100%;
    position: relative;
}

.hidden {
    display: none;
}

/* Menu de combat */
#combat-menu {
    margin: 20px;
}

#actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}

button {
    padding: 10px 20px;
    background-color: #ffeb3b;
    border: none;
    border-radius: 10px;
    font-size: 1.2rem;
    cursor: pointer;
}

button:hover {
    background-color: #ffca28;
}

#attack-list {
    list-style-type: none;
    padding: 0;
}

#attack-list li {
    margin: 10px 0;
    padding: 10px;
    background-color: #f44336;
    color: white;
    cursor: pointer;
    border-radius: 5px;
}

#attack-list li:hover {
    background-color: #d32f2f;
}

/* Responsiveness */
@media screen and (max-width: 1200px) {
    .pokemon-list {
        grid-template-columns: repeat(5, 1fr); /* 5 Pokémon par ligne */
    }

    #battlefield {
        flex-direction: column;
        align-items: center;
        height: auto;
    }
}

@media screen and (max-width: 768px) {
    .pokemon-list {
        grid-template-columns: repeat(3, 1fr); /* 3 Pokémon par ligne */
    }
}

@media screen and (max-width: 480px) {
    .pokemon-list {
        grid-template-columns: repeat(2, 1fr); /* 2 Pokémon par ligne */
    }

    .pokemon-card img {
        width: 100px;
        height: 100px;
    }
}
