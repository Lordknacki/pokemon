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
            power: moveData.power || 50,
            accuracy: moveData.accuracy || 100,
            type: moveData.type.name.charAt(0).toUpperCase() + moveData.type.name.slice(1),
            damageClass: moveData.damage_class.name // Récupère la classe de dégâts (physical, special, status)
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        return {
            name: "Charge",
            description: "Attaque basique.",
            power: 50,
            accuracy: 100,
            type: "Normal",
            damageClass: "physical" // Par défaut à physique si une erreur se produit
        };
    }
}



function hideAttackMenu() {
    const attackMenu = document.getElementById('attack-menu');
    if (attackMenu) {
        attackMenu.classList.add('hidden');
    }
}

function hideMoveTooltip() {
    const tooltip = document.querySelector('.move-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

async function displayMoves(pokemon) {
    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = ''; // Réinitialise le contenu pour éviter les doublons

    // Vérifie si les mouvements sont définis et s'il s'agit bien d'un tableau
    if (!pokemon || !Array.isArray(pokemon.moves) || pokemon.moves.length === 0) {
        console.error("Erreur : Aucun mouvement disponible pour ce Pokémon.", pokemon);
        return;
    }

    // Utilise les mouvements déjà sélectionnés (limités à 4)
    const selectedMoves = pokemon.moves.slice(0, 4); // Limite à 4 mouvements au maximum

    for (const move of selectedMoves) {
        try {
            // Récupérer les détails complets de l'attaque, y compris le type
            const moveDetails = await fetchMoveDetails(move.url);
            const moveTypeInFrench = getMoveTypeInFrench(moveDetails.type);

            const moveButton = document.createElement('button');
            moveButton.textContent = moveDetails.name;
            moveButton.classList.add('attack-btn');

            // Ajoute un événement pour chaque bouton d'attaque
            moveButton.addEventListener('click', () => {
                hideAttackMenu(); // Cache le menu d'attaque lors de l'attaque
                handlePlayerMove(moveDetails);
            });

            // Ajouter un événement pour afficher un tooltip personnalisé
            moveButton.addEventListener('mouseenter', (event) => {
                showMoveTooltip(
                    event,
                    moveDetails.name,
                    moveTypeInFrench,
                    moveDetails.description,
                    moveDetails.power,
                    moveDetails.accuracy,
                    moveDetails.damageClass
                );
            });

            moveButton.addEventListener('mouseleave', hideMoveTooltip);

            attackOptions.appendChild(moveButton);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        }
    }

    document.getElementById('attack-menu').classList.remove('hidden');
}





function getUniqueMoves(moves, count = 4) {
    if (!moves || moves.length === 0) {
        console.error("Erreur : La liste des mouvements est vide ou non définie.");
        return [];
    }

    const uniqueMoves = [];
    const seenMoves = new Set();
    const shuffledMoves = moves.sort(() => 0.5 - Math.random());

    for (const move of shuffledMoves) {
        if (uniqueMoves.length < count && !seenMoves.has(move.name)) {
            uniqueMoves.push(move);
            seenMoves.add(move.name);
        }
        if (uniqueMoves.length === count) {
            break;
        }
    }

    return uniqueMoves;
}


function preparePlayerMoves(playerPokemon) {
    if (!playerPokemon || !playerPokemon.moves || playerPokemon.moves.length === 0) {
        console.error("Erreur : Le Pokémon du joueur n'a pas de mouvements disponibles.");
        return;
    }
    playerPokemon.moves = getUniqueMoves(playerPokemon.moves, 4);
}

function prepareOpponentMoves(opponentTeam) {
    opponentTeam.forEach(pokemon => {
        pokemon.moves = getUniqueMoves(pokemon.moves, 4);
    });
}


// Sélectionne un mouvement aléatoire parmi les mouvements d'un Pokémon
function getRandomMove(pokemon) {
    if (!pokemon || !pokemon.moves || pokemon.moves.length === 0) {
        console.error("Erreur : Aucun mouvement disponible pour ce Pokémon.");
        return { name: "Charge", power: 40, accuracy: 100, type: "Normal" };
    }
    const randomIndex = Math.floor(Math.random() * pokemon.moves.length);
    return pokemon.moves[randomIndex];
}


async function displayMoves(pokemon) {
    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = ''; // Réinitialise le contenu pour éviter les doublons

    // Vérifie si les mouvements sont définis et s'il s'agit bien d'un tableau
    if (!pokemon || !Array.isArray(pokemon.moves) || pokemon.moves.length === 0) {
        return; // Sort de la fonction si aucun mouvement n'est disponible
    }

    // Utilise les mouvements déjà sélectionnés (limités à 4)
    const selectedMoves = pokemon.moves.slice(0, 4); // Limite à 4 mouvements au maximum

    for (const move of selectedMoves) {
        try {
            const moveDetails = await fetchMoveDetails(move.url);
            const moveTypeInFrench = getMoveTypeInFrench(moveDetails.type);

            const moveButton = document.createElement('button');
            moveButton.textContent = moveDetails.name;
            moveButton.classList.add('attack-btn');

            // Ajoute un événement pour chaque bouton d'attaque
            moveButton.addEventListener('click', () => {
                hideAttackMenu(); // Cache le menu d'attaque lors de l'attaque
                handlePlayerMove(moveDetails);
            });

            // Ajouter un événement pour afficher un tooltip personnalisé
            moveButton.addEventListener('mouseenter', (event) => {
                showMoveTooltip(
                    event,
                    moveDetails.name,
                    moveTypeInFrench,
                    moveDetails.description,
                    moveDetails.power,
                    moveDetails.accuracy,
                    moveDetails.damageClass
                );
            });

            moveButton.addEventListener('mouseleave', hideMoveTooltip);

            attackOptions.appendChild(moveButton);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        }
    }

    document.getElementById('attack-menu').classList.remove('hidden');
}



function showMoveTooltip(event, moveName, moveType, moveDescription, movePower, moveAccuracy, moveCategory) {
    const existingTooltip = document.querySelector('.move-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    let categoryImage;
    let categoryText;
    switch (moveCategory) {
        case 'physical':
            categoryImage = 'physique.png';
            categoryText = 'Physique';
            break;
        case 'special':
            categoryImage = 'speciale.png';
            categoryText = 'Spéciale';
            break;
        case 'status':
            categoryImage = 'statut.png';
            categoryText = 'Statut';
            break;
        default:
            categoryImage = 'physique.png';
            categoryText = 'Inconnu';
            break;
    }

    const tooltip = document.createElement('div');
    tooltip.classList.add('move-tooltip');

    tooltip.innerHTML = `
        <div>
            <span class="move-type type-${moveType.toLowerCase()}">${moveType}</span>: ${moveName}
        </div>
        <div class="move-details">
            <img src="${categoryImage}" alt="${categoryText}" class="move-category-icon" />
            ${categoryText} | Puissance: ${movePower} | Précision: ${moveAccuracy}%
        </div>
        <div class="move-description">${moveDescription}</div>
    `;

    document.body.appendChild(tooltip);

    const rect = event.target.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;

    tooltip.classList.add('show');
}


function hideMoveTooltip() {
    const tooltip = document.querySelector('.move-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}




function getMoveTypeInFrench(type) {
    const typeTranslations = {
        normal: "normal",
        fire: "feu",
        water: "eau",
        grass: "plante",
        electric: "électrik",
        ice: "glace",
        fighting: "combat",
        poison: "poison",
        ground: "sol",
        flying: "vol",
        psychic: "psy",
        bug: "insecte",
        rock: "roche",
        ghost: "spectre",
        dragon: "dragon",
        dark: "ténèbres",
        steel: "acier",
        fairy: "fée"
    };
    return typeTranslations[type.toLowerCase()] || type.toLowerCase();
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

function hideAttackMenu() {
    const attackMenu = document.getElementById('attack-menu');
    if (attackMenu) {
        attackMenu.classList.add('hidden');
    }
}

async function handlePlayerMove(move) {
    try {
        hideAttackMenu(); 
        if (!move || !move.type) {
            console.error('Erreur : le mouvement ou son type est indéfini.', move);
            return;
        }

        // Affiche l'animation de l'attaque du joueur
        const attackerSprite = document.getElementById('player-pokemon-sprite');
        attackerSprite.src = playerPokemon.animatedSprite;
        setTimeout(() => {
            attackerSprite.src = playerPokemon.standardSprite;
        }, 1000);

        // Vérifier si l'attaque touche sa cible
        if (!moveHits(move.accuracy)) {
            addBattleLog(`${playerPokemon.name} utilise ${move.name}, mais l'attaque échoue !`);
            // Masquer le menu d'attaques pendant 2 secondes pour simuler le délai
            await delay(2000);
            await executeTurn('opponent');
            return;
        }

        // Calculer les dégâts et appliquer l'attaque
        const damage = calculateDamage(playerPokemon, selectedOpponent, move);
        applyDamage(selectedOpponent, damage, 'opponent-hp', 'opponent-hp-text');

        addBattleLog(`${playerPokemon.name} utilise ${move.name} et inflige ${damage} dégâts à ${selectedOpponent.name}.`);

        // Vérifier l'efficacité de l'attaque
        const effectiveness = getEffectiveness(move.type, selectedOpponent.types);
        if (effectiveness > 1) {
            addBattleLog("C'est super efficace !");
        } else if (effectiveness < 1) {
            addBattleLog("Ce n'est pas très efficace...");
        }

        // Vérifier si l'adversaire est KO
        if (selectedOpponent.currentHP <= 0) {
            addBattleLog(`${selectedOpponent.name} est KO !`);
            updatePokeballs('opponent', opponentPokemonIndex);
            opponentPokemonIndex = getNextAvailablePokemon(opponentTeam, opponentPokemonIndex + 1);

            if (opponentPokemonIndex === -1) {
                endBattle("Victory! All opponent's Pokémon have fainted.");
            } else {
                selectedOpponent = opponentTeam[opponentPokemonIndex];
                displayPokemonOnBattlefield(playerPokemon, selectedOpponent);

                // Attendre 2 secondes avant le tour de l'adversaire
                await delay(2000);
                await executeTurn('opponent');
            }
        } else {
            // Masquer le menu d'attaques pendant 2 secondes après l'attaque du joueur
            await delay(2000);
            await executeTurn('opponent');
        }
    } catch (error) {
        console.error("Erreur lors de l'utilisation de l'attaque :", error);
    }
}




async function handleOpponentMove() {
    try {
        // Masquer le menu d'attaques pendant le tour de l'adversaire
        hideAttackMenu();

        // Sélectionne un mouvement aléatoire de l'adversaire
        const move = getRandomMove(selectedOpponent);
        const moveDetails = await fetchMoveDetails(move.url);

        // Affiche l'animation de l'attaque de l'adversaire
        const attackerSprite = document.getElementById('opponent-pokemon-sprite');
        await new Promise(resolve => setTimeout(resolve, 50));
        attackerSprite.src = selectedOpponent.animatedSprite;

        // Après 1 seconde (durée de l'animation), revenir au sprite statique
        setTimeout(() => {
            attackerSprite.src = selectedOpponent.standardSprite;
        }, 1000);

        // Calculer les dégâts et appliquer l'attaque
        const damage = calculateDamage(selectedOpponent, playerPokemon, moveDetails);
        applyDamage(playerPokemon, damage, 'player-hp', 'player-hp-text');

        addBattleLog(`${selectedOpponent.name} utilise ${moveDetails.name} et inflige ${damage} dégâts à ${playerPokemon.name}.`);

        // Vérifier l'efficacité de l'attaque
        const effectiveness = getEffectiveness(moveDetails.type, playerPokemon.types);
        if (effectiveness > 1) {
            addBattleLog("C'est super efficace !");
        } else if (effectiveness < 1) {
            addBattleLog("Ce n'est pas très efficace...");
        }

        // Vérifier si le Pokémon du joueur est KO
        if (playerPokemon.currentHP <= 0) {
            addBattleLog(`${playerPokemon.name} est KO !`);
            updatePokeballs('player', playerPokemonIndex);
            playerPokemonIndex = getNextAvailablePokemon(playerTeam, playerPokemonIndex + 1);

            if (playerPokemonIndex === -1) {
                endBattle("Your Pokémon fainted! You lose.");
            } else {
                playerPokemon = playerTeam[playerPokemonIndex];
                displayPokemonOnBattlefield(playerPokemon, selectedOpponent);

                // Attendre 2 secondes avant que le joueur ne puisse attaquer
                await delay(2000);
                displayMoves(playerPokemon);
            }
        } else {
            // Attendre 2 secondes avant que le joueur ne puisse attaquer
            await delay(2000);
            displayMoves(playerPokemon);
        }
    } catch (error) {
        console.error("Erreur lors de l'utilisation de l'attaque de l'adversaire :", error);
    }
}






// Fonction utilitaire pour introduire un délai
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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


function addBattleLog(message) {
    const battleLog = document.getElementById('battle-log');
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    battleLog.appendChild(messageElement);

    // Faire défiler le log vers le bas pour afficher le dernier message
    battleLog.scrollTop = battleLog.scrollHeight;
}