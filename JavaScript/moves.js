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
            type: moveData.type.name.charAt(0).toUpperCase() + moveData.type.name.slice(1)
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        return {
            name: "Charge",
            description: "Attaque basique.",
            power: 50,
            accuracy: 100,
            type: "Normal"
        };
    }
}

function getUniqueMoves(moves, count = 4) {
    if (!moves || moves.length === 0) {
        console.error("Erreur : La liste des mouvements est vide ou non définie.");
        return []; // Retourne une liste vide si aucun mouvement n'est disponible
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



// Prépare les mouvements de l'adversaire en sélectionnant jusqu'à 4 mouvements uniques
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
    attackOptions.innerHTML = ''; // Vide le contenu pour réinitialiser

    // Utilise les mouvements déjà sélectionnés (limités à 4)
    const selectedMoves = pokemon.moves;

    for (const move of selectedMoves) {
        try {
            // Récupérer les détails complets de l'attaque, y compris le type
            const moveDetails = await fetchMoveDetails(move.url);
            const moveTypeInFrench = getMoveTypeInFrench(moveDetails.type);

            const moveButton = document.createElement('button');
            moveButton.textContent = moveDetails.name;
            moveButton.classList.add('attack-btn');

            // Ajoute un événement pour chaque bouton d'attaque
            moveButton.addEventListener('click', () => handlePlayerMove(moveDetails));

            // Ajouter un événement pour afficher un tooltip personnalisé
            moveButton.addEventListener('mouseenter', (event) => {
                showMoveTooltip(event, `
                    <strong>${moveDetails.name}</strong><br>
                    <span class="move-type">${moveTypeInFrench}</span><br>
                    Puissance: ${moveDetails.power}<br>
                    Précision: ${moveDetails.accuracy}%<br>
                    ${moveDetails.description}
                `, moveDetails.type);
            });

            moveButton.addEventListener('mouseleave', hideMoveTooltip);

            attackOptions.appendChild(moveButton);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de l'attaque :", error);
        }
    }


    // Assure que le menu d'attaques est visible uniquement s'il y a des mouvements à afficher
    if (selectedMoves.length > 0) {
        document.getElementById('attack-menu').classList.remove('hidden');
    } else {
        console.warn("Aucun mouvement à afficher pour ce Pokémon.");
        hideAttackMenu();
    }
}

function showMoveTooltip(event, content, moveType) {
    // Supprime le *tooltip* existant avant d'en créer un nouveau
    const existingTooltip = document.querySelector('.move-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // Crée un élément pour le tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('move-tooltip');
    
    // Traduire le type de l'attaque
    const typeInFrench = getMoveTypeInFrench(moveType);

    // Crée le contenu du tooltip avec un span pour le type
    tooltip.innerHTML = `
        <div>
            <span class="move-type type-${typeInFrench.toLowerCase()}">${typeInFrench}</span> - ${content}
        </div>
    `;
    
    document.body.appendChild(tooltip);

    // Positionne le tooltip au-dessus du bouton
    const rect = event.target.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;

    tooltip.classList.add('show');
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




function hideMoveTooltip() {
    const tooltip = document.querySelector('.move-tooltip');
    if (tooltip) {
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip.parentElement) {
                    tooltip.parentElement.removeChild(tooltip);
                }
            }, 200); // Délai pour laisser la transition de disparition se terminer
        }, 100); // Délai avant de commencer à masquer le *tooltip*
    }
}







// Fonction utilitaire pour introduire un délai
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        if (!move || !move.type) {
            console.error('Erreur : le mouvement ou son type est indéfini.', move);
            return;
        }

        // Masquer le menu d'attaques
        hideAttackMenu();

        // Affiche l'animation de l'attaque du joueur
        const attackerSprite = document.getElementById('player-pokemon-sprite');
        attackerSprite.src = playerPokemon.animatedSprite;
        setTimeout(() => {
            attackerSprite.src = playerPokemon.standardSprite;
        }, 1000);

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
            // Attendre 2 secondes avant le tour de l'adversaire
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



function getEffectiveness(moveType, defenderTypes) {
    const typeChart = {
        normal: { roche: 0.5, spectre: 0, acier: 0.5 },
        feu: { feu: 0.5, eau: 0.5, plante: 2, glace: 2, insecte: 2, roche: 0.5, dragon: 0.5, acier: 2 },
        eau: { feu: 2, eau: 0.5, plante: 0.5, sol: 2, roche: 2, dragon: 0.5 },
        électrique: { eau: 2, électrique: 0.5, plante: 0.5, sol: 0, vol: 2, dragon: 0.5 },
        plante: { feu: 0.5, eau: 2, plante: 0.5, poison: 0.5, sol: 2, vol: 0.5, insecte: 0.5, roche: 2, dragon: 0.5, acier: 0.5 },
        glace: { feu: 0.5, eau: 0.5, plante: 2, glace: 0.5, sol: 2, vol: 2, dragon: 2, acier: 0.5 },
        combat: { normal: 2, glace: 2, roche: 2, ténèbres: 2, acier: 2, poison: 0.5, vol: 0.5, psy: 0.5, insecte: 0.5, spectre: 0, fée: 0.5 },
        poison: { plante: 2, poison: 0.5, sol: 0.5, roche: 0.5, spectre: 0.5, acier: 0, fée: 2 },
        sol: { feu: 2, électrique: 2, plante: 0.5, poison: 2, vol: 0, insecte: 0.5, roche: 2, acier: 2 },
        vol: { électrique: 0.5, plante: 2, combat: 2, insecte: 2, roche: 0.5, acier: 0.5 },
        psy: { combat: 2, poison: 2, psy: 0.5, ténèbres: 0, acier: 0.5 },
        insecte: { feu: 0.5, plante: 2, combat: 0.5, poison: 0.5, vol: 0.5, psy: 2, spectre: 0.5, ténèbres: 2, acier: 0.5, fée: 0.5 },
        roche: { feu: 2, glace: 2, combat: 0.5, sol: 0.5, vol: 2, insecte: 2, acier: 0.5 },
        spectre: { normal: 0, psy: 2, spectre: 2, ténèbres: 0.5 },
        dragon: { dragon: 2, acier: 0.5, fée: 0 },
        ténèbres: { combat: 0.5, psy: 2, spectre: 2, ténèbres: 0.5, fée: 0.5 },
        acier: { feu: 0.5, eau: 0.5, électrique: 0.5, glace: 2, roche: 2, acier: 0.5, fée: 2 },
        fée: { feu: 0.5, combat: 2, poison: 0.5, dragon: 2, ténèbres: 2, acier: 0.5 }
    };

    // Calcul de l'efficacité de l'attaque en fonction des types défensifs
    let effectiveness = 1;
    defenderTypes.forEach(type => {
        const defenderType = type.type.toLowerCase();
        effectiveness *= typeChart[moveType]?.[defenderType] || 1;
    });
    return effectiveness;
}
