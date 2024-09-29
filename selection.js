document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    toggleStartButton();
});

let selectedPokemon = [];

//--------------- Récupère les 386 premiers pokemon du pokedex ---------------\\
let allPokemonData = [];

async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386');
        const data = await response.json();
        const pokemonList = data.results;

        const pokemonDetailsPromises = pokemonList.map(pokemon => {
            const id = pokemon.url.split("/").filter(Boolean).pop();
            return fetchPokemonDetails(parseInt(id));
        });

        allPokemonData = await Promise.all(pokemonDetailsPromises); // Attend que toutes les promesses soient résolues
        allPokemonData.forEach(pokemonCard => {
            document.getElementById("pokemon-list").appendChild(pokemonCard); // Ajoute toutes les cartes en une fois
        });
        setupPokemonSelection(); // Configure les sélections après le chargement
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon:", error);
    }
}
//--------------- Récupère les 386 premiers pokemon du pokedex ---------------\\



//--------------- Récupérer les détails d'un Pokémon par son ID ---------------\\
async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();

        // Récupération du nom français
        const speciesUrl = pokemon.species.url; // URL vers les informations de l'espèce
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        
        const frenchName = speciesData.names.find(name => name.language.name === 'fr').name;

        return createPokemonCard(pokemon, frenchName);
    } catch (error) {
        console.error("Erreur lors de la récupération des détails Pokémon:", error);
        return null; // Retourner un élément nul si la requête échoue
    }
}
//--------------- Récupérer les détails d'un Pokémon par son ID ---------------\\



//--------------- Transforme le pokemon en carte prête à être sélectionnée ---------------\\
function createPokemonCard(pokemon, frenchName) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.setAttribute('data-id', pokemon.id); // Ajoute un identifiant de données pour la synchronisation
    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    card.innerHTML = `
        <img src="${pokemonImage}" alt="${frenchName}">
        <h3>${frenchName.charAt(0).toUpperCase() + frenchName.slice(1)}</h3>
    `;

//--------------- Transforme le pokemon en carte prête à être sélectionnée ---------------\\



//--------------- Affichage des divers caractéristiques des pokemon ---------------\\

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

//--------------- Affichage des divers caractéristiques des pokemon ---------------\\



//--------------- Barre de recherche des pokemon ---------------\\
document.getElementById('pokemon-search').addEventListener('input', function(e) {
    const searchQuery = e.target.value.toLowerCase();
    const pokemonCards = document.querySelectorAll('#pokemon-list .pokemon-card');
    let found = false;  // Indicateur si un Pokémon correspondant est trouvé

    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('h3').textContent.toLowerCase();
        if (pokemonName.includes(searchQuery)) {
            card.style.display = ''; // Afficher la carte si elle correspond à la requête
            found = true;  // Marquer comme trouvé
        } else {
            card.style.display = 'none'; // Masquer la carte sinon
        }
    });

    // Gérer l'affichage du message "Pas de résultat"
    const noResultMsg = document.getElementById('no-result-msg');
    if (!found && searchQuery !== '') {  // Afficher le message s'il n'y a pas de résultats et la requête n'est pas vide
        noResultMsg.style.display = 'block';
    } else {
        noResultMsg.style.display = 'none';
    }
});

//--------------- Barre de recherche des pokemon ---------------\\




//--------------- Permet de sélectionner / déselectionner un pokemon ---------------\\

// Fonction pour gérer la sélection ou la désélection d'un Pokémon
function togglePokemonSelection(pokemon, element) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    // Toggle de la sélection ou désélection
    if (isSelected) {
        // Désélection du Pokémon
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        // Retire la classe 'selected' de tous les éléments correspondants
        document.querySelectorAll(`[data-id="${pokemon.id}"]`).forEach(el => el.classList.remove('selected'));
    } else if (selectedPokemon.length < 6) {
        // Sélection du Pokémon
        selectedPokemon.push(pokemon);
        // Ajoute la classe 'selected' à tous les éléments correspondants
        document.querySelectorAll(`[data-id="${pokemon.id}"]`).forEach(el => el.classList.add('selected'));
    }

    updateTeamDisplay(); // Met à jour l'affichage de l'équipe
    toggleStartButton(); // Vérifie l'état du bouton de démarrage
}

// Mettre à jour l'affichage de l'équipe avec les images officielles pour le combat
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; // Efface le contenu actuel

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        img.alt = pokemon.name;
        img.classList.add('team-pokemon', 'selected');
        img.setAttribute('data-id', pokemon.id); // Ajoute un identifiant de données pour la synchronisation
        img.addEventListener('click', () => togglePokemonSelection(pokemon, img));
        teamContainer.appendChild(img);
    });
}

//--------------- Permet de sélectionner / déselectionner un pokemon ---------------\\



// Fonction pour activer/désactiver le bouton "Démarrer le combat" et afficher une infobulle si nécessaire
function toggleStartButton() {
    const startButton = document.getElementById('start-game');

    if (selectedPokemon.length === 0) {
        startButton.textContent = 'Sélectionne tes Pokémon 0/6';
    } else if (selectedPokemon.length < 6) {
        startButton.textContent = `Sélectionne tes Pokémon ${selectedPokemon.length}/6`;
    } else {
        startButton.textContent = 'Commencer le Combat';
    }
    
    if (selectedPokemon.length !== 6) {
        startButton.disabled = true;
        startButton.style.cursor = 'not-allowed';  // Curseur désactivé
        startButton.setAttribute('data-tooltip', 'Tu dois sélectionner 6 Pokémon pour commencer le combat !');
    } else {
        startButton.disabled = false;
        startButton.style.cursor = 'pointer';  // Curseur cliquable
        startButton.removeAttribute('data-tooltip');  // Supprime l'infobulle
    }
}

// Gérer l'affichage de l'infobulle au survol du bouton désactivé
document.getElementById('start-game').addEventListener('mouseenter', (event) => {
    const startButton = event.target;
    if (startButton.disabled && !document.getElementById('tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.innerText = startButton.getAttribute('data-tooltip');
        
        // Calcule la position pour centrer l'infobulle juste au-dessus du bouton
        document.body.appendChild(tooltip);
        const buttonRect = startButton.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.top = `${window.scrollY + buttonRect.top - tooltipRect.height - 10}px`;  // Ajuste pour une position au-dessus avec espace pour la flèche
        tooltip.style.left = `${window.scrollX + buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2)}px`;  // Centré horizontalement

        // Applique la classe .show pour rendre l'infobulle visible
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);  // Léger délai pour s'assurer que l'élément est ajouté au DOM avant d'ajouter la classe
    }
});

// Supprimer l'infobulle lorsque la souris quitte le bouton
document.getElementById('start-game').addEventListener('mouseleave', () => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');  // Retire la classe pour appliquer l'animation de disparition
        setTimeout(() => {
            tooltip.remove();  // Retire complètement l'infobulle après la transition
        }, 300);  // Délai pour correspondre à la durée de la transition (0.3s)
    }
});

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
//--------------- Activer/désactiver le bouton "Commencer le Combat" selon le nombre de Pokémon sélectionnés ---------------\\
