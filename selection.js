document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    toggleStartButton();
});

let selectedPokemon = [];

//--------------- Récupère les 386 premiers Pokémon du Pokédex ---------------\\
let allPokemonData = [];
let playerPokemon; // Déclaration globale
let selectedOpponent; // Déclaration globale


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
            if (pokemonCard) {  // S'assure que la carte Pokémon est bien créée
                document.getElementById("pokemon-list").appendChild(createPokemonCard(pokemonCard)); // Ajoute toutes les cartes en une fois
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon:", error);
    }
}

//--------------- Récupérer les détails d'un Pokémon par son ID ---------------\\
// Modifier la fonction fetchPokemonDetails pour récupérer 4 attaques aléatoires
async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();

        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const frenchName = speciesData.names.find(name => name.language.name === 'fr').name;

        const typesPromises = pokemon.types.map(async (type) => {
            const typeResponse = await fetch(type.type.url);
            const typeData = await typeResponse.json();
            const frenchTypeName = typeData.names.find(name => name.language.name === 'fr').name;
            return { type: frenchTypeName };
        });

        const types = await Promise.all(typesPromises);
        const pokemonSprite = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        const moves = pokemon.moves;
        const randomMoves = getRandomMoves(moves, 4);

        const baseHP = pokemon.stats[0].base_stat;
        const maxHP = calculateHP(baseHP);

        console.log("Détails du Pokémon récupérés:", {
            id: pokemon.id,
            name: frenchName,
            sprite: pokemonSprite,
            stats: pokemon.stats,
            maxHP: maxHP,
            currentHP: maxHP,
            types: types,
            moves: randomMoves
        });

        return {
            id: pokemon.id,
            name: frenchName,
            sprite: pokemonSprite,
            stats: pokemon.stats,
            maxHP: maxHP,
            currentHP: maxHP,
            types: types,
            moves: randomMoves
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du Pokémon ID ${id}:`, error);
        return null;
    }
}


async function fetchOpponentDetails(id) {
    try {
        // Utilise fetchPokemonDetails pour obtenir les détails du Pokémon
        const opponentPokemon = await fetchPokemonDetails(id);
        if (!opponentPokemon || !opponentPokemon.stats) {
            console.error("Impossible de récupérer les détails du Pokémon adverse.");
            return null;
        }
        return opponentPokemon;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du Pokémon adverse :", error);
        return null;
    }
}


// Fonction utilitaire pour obtenir des attaques aléatoires
function getRandomMoves(moves, count) {
    const randomMoves = [];
    while (randomMoves.length < count && moves.length > 0) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        const move = moves[randomIndex];
        randomMoves.push(move);
        moves.splice(randomIndex, 1);  // Retirer l'attaque sélectionnée pour éviter les doublons
    }
    return randomMoves;
}


//--------------- Créer une carte Pokémon et gérer la sélection ---------------\\
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.setAttribute('data-id', pokemon.id);
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

//--------------- Afficher les statistiques d'un Pokémon lors du survol ---------------\\
function showPokemonStats(pokemon, card) {
    const statsModal = document.getElementById("stats-modal");

    statsModal.innerHTML = `
        <div class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
        <div class="pokemon-types">
            ${pokemon.types.map(type => `<span class="pokemon-type type-${type.type.toLowerCase()}">${type.type}</span>`).join(' ')}
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
    statsModal.classList.add("show");

    const rect = card.getBoundingClientRect();
    
    const topPosition = window.scrollY + rect.top - statsModal.offsetHeight - 15;
    let leftPosition = rect.left + (rect.width / 2) - (statsModal.offsetWidth / 2);

    if (leftPosition + statsModal.offsetWidth > window.innerWidth) {
        leftPosition = window.innerWidth - statsModal.offsetWidth - 30;
    }
    if (leftPosition < 0) {
        leftPosition = 30;
    }

    statsModal.style.top = `${Math.max(10, topPosition)}px`;
    statsModal.style.left = `${leftPosition}px`;
}

//--------------- Masquer les statistiques du Pokémon lors du retrait de la souris ---------------\\
function hidePokemonStats() {
    const statsModal = document.getElementById("stats-modal");
    statsModal.classList.remove("show");
}

//--------------- Sélectionner et désélectionner un Pokémon ---------------\\
function togglePokemonSelection(pokemon, element) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        document.querySelectorAll(`[data-id="${pokemon.id}"]`).forEach(el => el.classList.remove('selected'));
    } else if (selectedPokemon.length < 6) {
        selectedPokemon.push(pokemon);
        document.querySelectorAll(`[data-id="${pokemon.id}"]`).forEach(el => el.classList.add('selected'));
    }

    updateTeamDisplay();
    toggleStartButton();
}

//--------------- Mettre à jour l'affichage de l'équipe sélectionnée ---------------\\
function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; // Efface le contenu actuel

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = pokemon.sprite;
        img.alt = pokemon.name;
        img.classList.add('team-pokemon', 'selected');
        img.setAttribute('data-id', pokemon.id);
        img.addEventListener('click', () => togglePokemonSelection(pokemon, img));
        teamContainer.appendChild(img);
    });
}

//--------------- Activer/Désactiver le bouton "Démarrer le Combat" ---------------\\
function toggleStartButton() {
    const startButton = document.getElementById('start-game');
    
    if (selectedPokemon.length === 0) {
        startButton.textContent = 'Sélectionne tes Pokémon 0/6';
    } else if (selectedPokemon.length < 6) {
        startButton.textContent = `Sélectionne tes Pokémon ${selectedPokemon.length}/6`;
    } else {
        startButton.textContent = 'Commencer le Combat';
    }

    startButton.disabled = selectedPokemon.length !== 6;
}

//--------------- Démarrer le combat après la sélection des Pokémon ---------------\\
document.getElementById('start-game').addEventListener('click', async () => {
    if (selectedPokemon.length === 6) {
        const playerPokemon = selectedPokemon[0];
        const opponentPokemon = await getRandomPokemon();

        displayPokemonOnBattlefield(playerPokemon, opponentPokemon);

        document.getElementById('selection-phase').classList.add('hidden');
        document.getElementById('combat-phase').classList.remove('hidden');
    } else {
        alert("Tu dois sélectionner 6 Pokémon pour commencer le combat !");
    }
});

let opponentPokemon; // Déclaration globale

async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 386) + 1;
    const opponent = await fetchPokemonDetails(randomId);
    if (!opponent || !opponent.stats) {
        console.error("Les statistiques du Pokémon adverse sont introuvables.");
        return null;
    }
    return opponent;
}



async function startBattle(playerPokemon) {
    // Récupérer un Pokémon adverse aléatoire
    selectedOpponent = await getRandomPokemon();

    if (!selectedOpponent || !selectedOpponent.stats) {
        console.error("Erreur lors de la récupération des détails du Pokémon adverse.");
        return;
    }

    // Afficher les Pokémon sur le terrain
    displayPokemonOnBattlefield(playerPokemon, selectedOpponent);

    // Afficher les attaques du premier Pokémon du joueur
    displayMoves(playerPokemon.moves);

    // Masquer la phase de sélection et afficher la phase de combat
    document.getElementById('selection-phase').classList.add('hidden');
    document.getElementById('combat-phase').classList.remove('hidden');

    // Déterminer l'ordre des tours après avoir récupéré les détails des deux Pokémon
    const currentTurn = determineTurnOrder(playerPokemon, selectedOpponent);
    
    // Démarrer la première phase de combat avec l'ordre déterminé
    executeTurn(currentTurn, playerPokemon, selectedOpponent);
}



// Fonction pour déterminer l'ordre des tours
function determineTurnOrder(playerPokemon, opponentPokemon) {
    if (!playerPokemon.stats || !opponentPokemon.stats) {
        console.error("Les statistiques des Pokémon sont manquantes.");
        return;
    }

    const playerSpeed = playerPokemon.stats[5].base_stat;
    const opponentSpeed = opponentPokemon.stats[5].base_stat;

    if (playerSpeed > opponentSpeed) {
        return 'player'; // Le joueur commence
    } else if (opponentSpeed > playerSpeed) {
        return 'opponent'; // L'adversaire commence
    } else {
        // Si les vitesses sont identiques, choisir aléatoirement
        return Math.random() > 0.5 ? 'player' : 'opponent';
    }
}

// Fonction pour exécuter le tour selon l'ordre déterminé
// Fonction pour exécuter le tour selon l'ordre déterminé
function executeTurn(currentTurn, playerPokemon, opponentPokemon) {
    if (currentTurn === 'player') {
        console.log("C'est au tour du joueur de jouer.");
        // Afficher les attaques du joueur
        displayMoves(playerPokemon.moves);
    } else {
        console.log("C'est au tour de l'adversaire de jouer.");
        // Lancer une attaque aléatoire de l'adversaire
        const randomMove = getRandomMove(opponentPokemon);
        handleMoveClick(opponentPokemon, playerPokemon, randomMove.move.url);
    }
}



// --------------- Afficher les Pokémon sur le terrain de combat ---------------\\
// Fonction pour afficher les Pokémon et leurs attaques sur le terrain de combat
function displayPokemonOnBattlefield(playerPokemon, opponentPokemon) {
    const playerSprite = document.getElementById('player-pokemon-sprite');
    const opponentSprite = document.getElementById('opponent-pokemon-sprite');

    playerSprite.src = playerPokemon.sprite;
    opponentSprite.src = opponentPokemon.sprite;

    document.getElementById('player-pokemon-name').textContent = playerPokemon.name;
    document.getElementById('opponent-pokemon-name').textContent = opponentPokemon.name;

    updateHPBar(playerPokemon, playerPokemon.maxHP, playerPokemon.maxHP, 'player-hp', 'player-hp-text');
    updateHPBar(opponentPokemon, opponentPokemon.maxHP, opponentPokemon.maxHP, 'opponent-hp', 'opponent-hp-text');

    // Afficher les attaques du Pokémon du joueur
    displayMoves(playerPokemon.moves);

    // Rendre le menu d'attaques visible
    document.getElementById('attack-menu').classList.remove('hidden');
}

async function displayMoves(moves) {
    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = '';

    for (const move of moves) {
        if (move && move.move && move.move.url) {
            try {
                const moveDetails = await fetchMoveDetails(move.move.url);
                if (moveDetails) {
                    const moveButton = document.createElement('button');
                    moveButton.textContent = moveDetails.name;
                    moveButton.classList.add('attack-btn');

                    moveButton.setAttribute('data-move-tooltip', `
                        Type: ${moveDetails.type}
                        Puissance: ${moveDetails.power ? moveDetails.power : 'Inconnue'}
                        Précision: ${moveDetails.accuracy ? moveDetails.accuracy : 'Inconnue'}
                        Description: ${moveDetails.description}
                    `);

                    moveButton.addEventListener('click', () => {
                        handlePlayerMove(moveDetails);
                    });

                    moveButton.addEventListener('mouseenter', (event) => {
                        showMoveTooltip(event, moveButton.getAttribute('data-move-tooltip'));
                    });

                    moveButton.addEventListener('mouseleave', hideMoveTooltip);
                    attackOptions.appendChild(moveButton);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails de l'attaque:", error);
            }
        }
    }
}


// Fonction pour afficher l'infobulle des attaques
function showMoveTooltip(event, content) {
    const tooltip = document.createElement('div');
    tooltip.id = 'move-tooltip';
    tooltip.innerText = content;

    document.body.appendChild(tooltip);

    const rect = event.target.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;

    tooltip.classList.add('show');
}

function hideMoveTooltip() {
    const tooltip = document.getElementById('move-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}


async function fetchAilmentDetails(moveUrl) {
    const response = await fetch(moveUrl);
    const moveData = await response.json();
    const ailment = moveData.meta.ailment.name; // par exemple, "poison", "paralysis"
    return ailment;
}

async function fetchMoveCategory(moveUrl) {
    const response = await fetch(moveUrl);
    const categoryData = await response.json();
    const category = categoryData.name; // Ex. "damage", "heal"
    return category;
}

async function fetchMoveTarget(moveUrl) {
    const response = await fetch(moveUrl);
    const moveData = await response.json();
    const target = moveData.target.name; // Ex. "selected-pokemon", "all-opponents"
    return target;
}

async function fetchMoveBattleStyle(moveUrl) {
    const response = await fetch(moveUrl);
    const battleStyleData = await response.json();
    const battleStyle = battleStyleData.name;
    return battleStyle;
}

async function fetchMoveDetails(moveUrl) {
    try {
        const response = await fetch(moveUrl);
        const moveData = await response.json();
        
        // Filtrer pour récupérer les descriptions et noms en français
        const moveName = moveData.names.find(name => name.language.name === 'fr')?.name || 'Nom inconnu';
        const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text || 'Description indisponible';
        const movePower = moveData.power || "???";
        const moveAccuracy = moveData.accuracy || 100;
        const moveType = moveData.type.name.charAt(0).toUpperCase() + moveData.type.name.slice(1);
        const damageClass = moveData.damage_class.name; // "physical", "special", or "status"
        
        return {
            name: moveName,
            description: moveDescription,
            power: movePower,
            accuracy: moveAccuracy,
            type: moveType,
            damageClass: damageClass
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        return null;
    }
}




//--------------- Barre de recherche des Pokémon ---------------\\
document.getElementById('pokemon-search').addEventListener('input', function(e) {
    const searchQuery = e.target.value.toLowerCase();
    const pokemonCards = document.querySelectorAll('#pokemon-list .pokemon-card');
    let found = false;

    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('h3').textContent.toLowerCase();
        if (pokemonName.includes(searchQuery)) {
            card.style.display = ''; // Afficher la carte si elle correspond à la requête
            found = true;
        } else {
            card.style.display = 'none'; // Masquer la carte sinon
        }
    });

    const noResultMsg = document.getElementById('no-result-msg');
    if (!found && searchQuery !== '') {
        noResultMsg.style.display = 'block';
    } else {
        noResultMsg.style.display = 'none';
    }
});

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

function calculateHP(baseHP) {
    const level = 100;
    const iv = 31; // Max IV
    const ev = 252; // Max EV
    const hp = Math.floor(((2 * baseHP + iv + Math.floor(ev / 4)) * level / 100) + level + 10);
    return hp;
}

// Example usage for Charizard with current HP and max HP
const baseHP = 78; // Charizard's base HP
const maxHP = calculateHP(baseHP);

const typeChart = {
    fire: { water: 0.5, grass: 2, fire: 0.5, rock: 0.5 },
    water: { fire: 2, grass: 0.5, electric: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5 },
    // More types...
};

function getTypeEffectiveness(moveType, defenderTypes) {
    let effectiveness = 1;
    defenderTypes.forEach(type => {
        effectiveness *= typeChart[moveType][type] || 1;
    });
    return effectiveness;
}

document.getElementById('attack-options').addEventListener('click', function(event) {
    const moveButton = event.target;

    if (moveButton.tagName === 'BUTTON') {
        const moveUrl = moveButton.getAttribute('data-move-url');
        handleMoveClick(playerPokemon, opponentPokemon, moveUrl);
    }
});


function getRandomMove(pokemon) {
    return pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
}


// Function to handle move click and apply damage
async function handleMoveClick(attacker, defender, moveUrl) {
    const moveDetails = await fetchMoveDetails(moveUrl);
    if (!moveDetails) {
        console.error("Détails de l'attaque non trouvés !");
        return;
    }

    if (!moveHits(moveDetails.accuracy)) {
        console.log(`${attacker.name} a raté son attaque !`);
        return;
    }

    const ailment = await fetchAilmentDetails(moveUrl);
    if (ailment !== 'none') {
        console.log(`${attacker.name} inflige ${ailment} à ${defender.name} !`);
        applyAilment(defender, ailment);
    }

    const damage = calculateDamage(attacker, defender, moveDetails);
    applyDamage(defender, damage, defender === playerPokemon ? 'opponent-hp' : 'player-hp', defender === playerPokemon ? 'opponent-hp-text' : 'player-hp-text');
    checkForFainting(defender);
}


// Function to calculate damage based on stats and move power
function calculateDamage(attacker, defender, moveDetails) {
    if (!attacker.stats || !defender.stats) {
        console.error("Les statistiques des Pokémon sont manquantes pour l'attaque.");
        return 0; // Retourne 0 pour éviter que le jeu plante
    }

    let baseDamage = moveDetails.power || 50;
    if (moveDetails.damage_class === 'status') {
        console.log("L'attaque est de type 'status' et ne cause pas de dégâts directs.");
        return 0;
    }

    const attackStat = moveDetails.damage_class === 'physical' ? attacker.stats[1].base_stat : attacker.stats[3].base_stat;
    const defenseStat = moveDetails.damage_class === 'physical' ? defender.stats[2].base_stat : defender.stats[4].base_stat;

    const damage = (((2 * 100 / 5 + 2) * baseDamage * (attackStat / defenseStat)) / 50) + 2;

    return Math.round(damage);
}




function moveHits(accuracy) {
    const roll = Math.random() * 100;
    return roll <= accuracy;
}



function applyDamage(pokemon, damage, hpBarId, hpTextId) {
    pokemon.currentHP = Math.max(0, pokemon.currentHP - damage);
    updateHPBar(pokemon, pokemon.currentHP, pokemon.maxHP, hpBarId, hpTextId);
}

function updateHPBar(pokemon, currentHP, maxHP, hpBarId, hpTextId) {
    const hpPercentage = (currentHP / maxHP) * 100;
    const hpBar = document.getElementById(hpBarId);
    const hpText = document.getElementById(hpTextId);

    hpBar.style.width = `${hpPercentage}%`;
    hpText.textContent = `${currentHP} / ${maxHP}`;

    if (hpPercentage > 50) {
        hpBar.classList.remove('hp-yellow', 'hp-red');
        hpBar.classList.add('hp-green');
    } else if (hpPercentage > 20) {
        hpBar.classList.remove('hp-green', 'hp-red');
        hpBar.classList.add('hp-yellow');
    } else {
        hpBar.classList.remove('hp-green', 'hp-yellow');
        hpBar.classList.add('hp-red');
    }
}



// Function to check if a Pokémon fainted
function checkForFainting(pokemon) {
    if (pokemon.currentHP <= 0) {
        console.log(`${pokemon.name} fainted!`);
        if (pokemon === playerPokemon) {
            alert("Your Pokémon fainted! You lose.");
        } else {
            alert("The opponent's Pokémon fainted! You win.");
        }
    }
}

async function handlePlayerMove(moveDetails) {
    console.log("Détails du mouvement:", moveDetails);
    console.log("Player Pokemon:", playerPokemon);
    console.log("Selected Opponent:", selectedOpponent);

    if (!playerPokemon || !playerPokemon.stats || !selectedOpponent || !selectedOpponent.stats) {
        console.error("Les statistiques des Pokémon sont manquantes.");
        return;
    }

    const damage = calculateDamage(playerPokemon, selectedOpponent, moveDetails);
    applyDamage(selectedOpponent, damage, 'opponent-hp', 'opponent-hp-text');

    if (selectedOpponent.currentHP <= 0) {
        endBattle("Victory! The opponent's Pokémon fainted.");
        return;
    }

    await opponentMove();
}


