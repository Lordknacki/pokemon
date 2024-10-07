async function fetchMoveDetails(moveUrl) {
    try {
        const response = await fetch(moveUrl);
        const moveData = await response.json();

        // Récupérer le nom de l'attaque en français
        const moveName = moveData.names.find(name => name.language.name === 'fr')?.name || moveData.name;

        // Récupérer la description en français
        const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text || "Description non disponible";

        return {
            name: moveName,
            description: moveDescription,
            power: moveData.power || 50, // Valeur par défaut si la puissance n'est pas définie
            accuracy: moveData.accuracy || 100, // Valeur par défaut si la précision n'est pas définie
            type: moveData.type.name.charAt(0).toUpperCase() + moveData.type.name.slice(1) // Capitaliser le type
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        return {
            name: "Charge",
            description: "Attaque basique.",
            power: 50,
            accuracy: 100,
            type: "Normal"
        }; // Mouvement par défaut en cas d'erreur
    }
}




// Fonction pour sélectionner un mouvement aléatoire parmi les mouvements d'un Pokémon
function getRandomMove(pokemon) {
    if (!pokemon || !pokemon.moves || pokemon.moves.length === 0) {
        console.error("Erreur : Aucun mouvement disponible pour ce Pokémon.");
        return { name: "Charge", power: 40, accuracy: 100, type: "Normal" };
    }
    const randomIndex = Math.floor(Math.random() * pokemon.moves.length);
    return pokemon.moves[randomIndex];
}

// moves.js
async function displayMoves(moves) {
    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = '';

    if (!Array.isArray(moves) || moves.length === 0) {
        console.error("Erreur : Aucun mouvement à afficher.");
        return;
    }

    moves.forEach(move => {
        const moveButton = createMoveButton(move);
        if (moveButton) {
            attackOptions.appendChild(moveButton);
        }
    });

    console.log("Attaques affichées :", moves);
}

function createMoveButton(move) {
    if (!move || !move.name || !move.url) {
        console.error("Erreur : Mouvement invalide.", move);
        return null;
    }

    const button = document.createElement('button');
    button.textContent = move.name; // Affiche le nom de l'attaque en français
    button.classList.add('attack-btn');

    // Ajouter un événement de clic pour gérer le choix de l'attaque par le joueur
    button.addEventListener('click', () => handlePlayerMove(move));

    // Afficher la description en français lors du survol du bouton
    button.title = move.description; // Affiche la description en survolant le bouton

    return button;
}


async function handlePlayerMove(move) {
    try {
        const moveDetails = await fetchMoveDetails(move.url);
        if (!playerPokemon || !playerPokemon.stats || !selectedOpponent || !selectedOpponent.stats) {
            console.error("Erreur : Pokémon manquant pour le calcul des dégâts.", playerPokemon, selectedOpponent);
            return;
        }

        const damage = calculateDamage(playerPokemon, selectedOpponent, moveDetails);
        applyDamage(selectedOpponent, damage, 'opponent-hp', 'opponent-hp-text');

        const opponentIndex = 0;
        if (selectedOpponent.currentHP <= 0) {
            updatePokeballs('opponent', opponentIndex);
            endBattle("Victory! The opponent's Pokémon fainted.");
        } else {
            // Si l'adversaire n'est pas KO, il attaque à son tour
            await executeTurn('opponent');
        }
    } catch (error) {
        console.error("Erreur lors de l'utilisation de l'attaque :", error);
    }
}





function calculateDamage(attacker, defender, move) {
    if (!attacker || !attacker.stats || !defender || !defender.stats) {
        console.error("Erreur : Statistiques manquantes pour le calcul des dégâts.", attacker, defender);
        return 0; // Retourne 0 si les statistiques sont manquantes pour éviter des erreurs
    }

    const basePower = move.power || 50; // Utilise 50 par défaut si la puissance n'est pas définie
    const attack = attacker.stats[1].base_stat; // Attaque physique du Pokémon attaquant
    const defense = defender.stats[2].base_stat; // Défense du Pokémon défenseur

    // Exemple de calcul simplifié des dégâts
    const damage = Math.floor(((2 * 100 / 5 + 2) * basePower * (attack / defense)) / 50) + 2;

    console.log(`${attacker.name} utilise ${move.name} et inflige ${damage} dégâts à ${defender.name}.`);
    return damage;
}

// Vérifier si le mouvement touche sa cible
function moveHits(accuracy) {
    const roll = Math.random() * 100;
    return roll <= accuracy;
}

