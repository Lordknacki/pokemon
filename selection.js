document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
});

let selectedPokemon = [];

// Récupérer les 386 premiers Pokémon dans l'ordre du Pokédex
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
            await fetchPokemonDetails(pokemon.id);  // Supposons que cela affiche aussi les Pokémon
        }

        // Après avoir chargé et affiché tous les Pokémon, configure les sélections
        setupPokemonSelection();
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

    // Utiliser l'URL pour les artworks officiels pour la sélection
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    // Ajout des événements pour afficher les statistiques lors du survol
    card.addEventListener('mouseenter', () => showPokemonStats(pokemon, card));
    card.addEventListener('mouseleave', () => hidePokemonStats());
    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));
    return card;
}

// Afficher les statistiques d'un Pokémon lors du survol
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
    const rect = card.getBoundingClientRect();
    
    // Ajustement ergonomique pour que la fenêtre apparaisse de façon fixe dans la vue
    const topPosition = window.scrollY + rect.top - statsModal.offsetHeight - 15;
    let leftPosition = rect.left + (rect.width / 2) - (statsModal.offsetWidth / 2);

    // Si le Pokémon est trop proche du bord droit, déplacer la fenêtre davantage vers la gauche
    if (leftPosition + statsModal.offsetWidth > window.innerWidth) {
        leftPosition = window.innerWidth - statsModal.offsetWidth - 30; // Plus de décalage vers la gauche
    }

    // Si le Pokémon est trop proche du bord gauche, déplacer légèrement vers la droite
    if (leftPosition < 0) {
        leftPosition = 30; // Plus de décalage vers la droite
    }

    statsModal.style.top = `${Math.max(10, topPosition)}px`;  // Empêcher de sortir de l'écran en haut
    statsModal.style.left = `${leftPosition}px`;  // Empêcher de sortir de l'écran à gauche ou à droite
}

// Masquer les statistiques du Pokémon lors du retrait de la souris
function hidePokemonStats() {
    const statsModal = document.getElementById("stats-modal");
    statsModal.style.display = "none";
}

function translatePokemonName(name) {
    // Exemple: simplement retourner le nom avec la première lettre en majuscule
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// Fonction pour gérer la sélection ou la désélection d'un Pokémon
function togglePokemonSelection(pokemon, card) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        card.classList.remove('selected'); // Retirer le style de sélection
    } else if (selectedPokemon.length < 6) {
        selectedPokemon.push(pokemon);
        card.classList.add('selected'); // Ajouter un style visuel pour indiquer la sélection
    }

    // Mettre à jour l'affichage de l'équipe
    updateTeamDisplay();

    // Activer ou désactiver le bouton "Commencer le Combat" en fonction de l'état de l'équipe
    toggleStartButton();
}

// Mettre à jour l'affichage de l'équipe avec les images officielles pour le combat
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

// Activer/désactiver le bouton "Commencer le Combat" selon le nombre de Pokémon sélectionnés
function toggleStartButton() {
    const startButton = document.getElementById('start-game');
    startButton.disabled = selectedPokemon.length !== 6;
}

// Démarrer le combat lorsque l'équipe est prête
document.getElementById('start-game').addEventListener('click', () => {
    if (selectedPokemon.length === 6) {
        document.getElementById('selection-phase').classList.add('hidden');  // Cache la phase de sélection
        document.getElementById('combat-phase').classList.remove('hidden');  // Affiche la phase de combat
        initializeCombat();  // Démarre le combat
    } else {
        alert("Tu dois sélectionner 6 Pokémon pour commencer le combat !");
    }
});
