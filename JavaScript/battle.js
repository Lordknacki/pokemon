async function startBattle(playerTeamArray) {
    try {
        playerTeam = playerTeamArray; // Associe l'équipe du joueur
        opponentTeam = await getOpponentTeam(); // Récupère une équipe pour l'adversaire
        playerPokemonIndex = 0;
        opponentPokemonIndex = 0;
        playerPokemon = playerTeam[playerPokemonIndex];
        selectedOpponent = opponentTeam[opponentPokemonIndex];

        // Affiche l'écran de transition puis démarre le combat
        showTransitionScreen(playerTeam, opponentTeam, () => {
            // Une fois la transition terminée, le combat commence ici
            continueBattle();
        });
    } catch (error) {
        console.error("Erreur lors du démarrage du combat :", error);
    }
}

function continueBattle() {
    // Vérifier que les Pokémon ont bien un sprite avant de continuer
    if (!playerPokemon || !playerPokemon.animatedSprite) {
        console.error("Erreur : Le Pokémon du joueur n'a pas de sprite.", playerPokemon);
        return;
    }
    if (!selectedOpponent || !selectedOpponent.animatedSprite) {
        console.error("Erreur : Le Pokémon de l'adversaire n'a pas de sprite.", selectedOpponent);
        return;
    }

    // Préparer les mouvements des Pokémon pour garantir qu'ils ont 4 mouvements uniques
    preparePlayerMoves(playerPokemon);
    prepareOpponentMoves(opponentTeam);

    // Afficher les Pokémon sur le champ de bataille
    displayPokemonOnBattlefield(playerPokemon, selectedOpponent);
    displayMoves(playerPokemon);

    // Transition de la phase de sélection à la phase de combat
    document.getElementById('selection-phase').classList.add('hidden');
    document.getElementById('combat-phase').classList.remove('hidden');

    // Initialiser l'affichage des Pokéballs pour les deux équipes
    initializePokeballs();

    // Déterminer qui commence le combat et lancer le premier tour
    const currentTurn = determineTurnOrder(playerPokemon, selectedOpponent);
    executeTurn(currentTurn);
}






function initializePokeballs() {
    const playerPokeballs = document.getElementById('player-pokeballs');
    const opponentPokeballs = document.getElementById('opponent-pokeballs');

    playerPokeballs.innerHTML = '';
    opponentPokeballs.innerHTML = '';

    // Afficher 6 Pokéballs pour chaque côté
    for (let i = 0; i < 6; i++) {
        const playerBall = document.createElement('img');
        playerBall.src = 'pokeballs.png'; // Remplace par le chemin vers l'image de la Pokéball active
        playerBall.classList.add('player-pokeball');
        playerPokeballs.appendChild(playerBall);

        const opponentBall = document.createElement('img');
        opponentBall.src = 'pokeballs.png'; // Remplace par le chemin vers l'image de la Pokéball active
        opponentBall.classList.add('opponent-pokeball');
        opponentPokeballs.appendChild(opponentBall);
    }
}

function updatePokeballs(pokemonType, index) {
    const pokeballImage = 'pokeoff.png'; // Remplace par le chemin de l'image de la Pokéball KO

    if (pokemonType === 'player') {
        const playerPokeballs = document.querySelectorAll('.player-pokeball');
        if (playerPokeballs[index]) {
            playerPokeballs[index].src = pokeballImage;
        }
    } else if (pokemonType === 'opponent') {
        const opponentPokeballs = document.querySelectorAll('.opponent-pokeball');
        if (opponentPokeballs[index]) {
            opponentPokeballs[index].src = pokeballImage;
        }
    }
}

async function executeTurn(currentTurn) {
    if (currentTurn === 'player') {
        displayMoves(playerPokemon.moves);
    } else if (currentTurn === 'opponent') {
        hideAttackMenu(); // Cache le menu pendant le tour de l'adversaire
        await handleOpponentMove();
    }
}





function determineTurnOrder(playerPokemon, opponentPokemon) {
    const playerSpeed = playerPokemon.stats[5].base_stat; // Vitesse du joueur
    const opponentSpeed = opponentPokemon.stats[5].base_stat; // Vitesse de l'adversaire

    if (playerSpeed > opponentSpeed) {
        return 'player'; // Le joueur attaque en premier
    } else if (playerSpeed < opponentSpeed) {
        return 'opponent'; // L'adversaire attaque en premier
    } else {
        return Math.random() > 0.5 ? 'player' : 'opponent'; // Aléatoire si vitesses égales
    }
}

async function opponentMove() {
    try {
        const randomMove = getRandomMove(selectedOpponent);
        const moveDetails = await fetchMoveDetails(randomMove.url);

        const damage = calculateDamage(selectedOpponent, playerPokemon, moveDetails);
        applyDamage(playerPokemon, damage, 'player-hp', 'player-hp-text');

        if (playerPokemon.currentHP <= 0) {
            updatePokeballs('player', playerPokemonIndex);
            playerPokemonIndex = getNextAvailablePokemon(playerTeam, playerPokemonIndex + 1);

            if (playerPokemonIndex === -1) {
                endBattle("Your Pokémon fainted! You lose.");
            } else {
                playerPokemon = playerTeam[playerPokemonIndex];
                displayPokemonOnBattlefield(playerPokemon, selectedOpponent);
                await executeTurn('player');
            }
        } else {
            executeTurn('player');
        }
    } catch (error) {
        console.error("Erreur lors de l'attaque de l'adversaire :", error);
    }
}



function checkForFainting(pokemon) {
    if (pokemon.currentHP <= 0) {
        console.log(`${pokemon.name} fainted!`);
        alert(pokemon === playerPokemon ? "Your Pokémon fainted! You lose." : "The opponent's Pokémon fainted! You win.");
    }
}

function applyDamage(pokemon, damage, hpBarId, hpTextId) {
    pokemon.currentHP = Math.max(0, pokemon.currentHP - damage);
    updateHPBar(pokemon, pokemon.currentHP, pokemon.maxHP, hpBarId, hpTextId);
}

function endBattle(message) {
    alert(message); // Affiche un message pour le joueur (par exemple "Victory! The opponent's Pokémon fainted.")
    // Remettre les éléments de l'interface à leur état initial ou proposer de recommencer.
    document.getElementById('combat-phase').classList.add('hidden');
    document.getElementById('selection-phase').classList.remove('hidden');

    // Réinitialiser les Pokémon et autres variables pour une nouvelle partie
    selectedOpponent = null;
    playerPokemon = null;
    selectedPokemon = [];
    updateTeamDisplay();
    console.log("Le combat est terminé : ", message);
}

function getNextAvailablePokemon(team, index) {
    // Parcourt l'équipe pour trouver le premier Pokémon encore en vie à partir de l'index donné
    for (let i = index; i < team.length; i++) {
        if (team[i].currentHP > 0) {
            return i;
        }
    }
    return -1; // Retourne -1 si aucun Pokémon n'est disponible
}

function showTransitionScreen(playerTeam, opponentTeam, callback) {
    console.log("Affichage de l'écran de transition...");
    const playerTeamContainer = document.getElementById('player-team');
    const opponentTeamContainer = document.getElementById('opponent-team');

    playerTeamContainer.innerHTML = '';
    opponentTeamContainer.innerHTML = '';

    // URL de base pour les sprites Pokémon
    const baseSpriteUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

    // Afficher les Pokémon de l'équipe du joueur avec leur sprite depuis l'API
    playerTeam.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `${baseSpriteUrl}${pokemon.id}.png`; // Utilise l'ID du Pokémon pour générer l'URL du sprite
        img.alt = pokemon.name;
        img.classList.add('pokemon-sprite'); // Ajoute une classe pour ajuster la taille et le style si nécessaire
        playerTeamContainer.appendChild(img);
    });

    // Afficher les Pokémon de l'équipe de l'adversaire avec leur sprite depuis l'API
    opponentTeam.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `${baseSpriteUrl}${pokemon.id}.png`; // Utilise l'ID du Pokémon pour générer l'URL du sprite
        img.alt = pokemon.name;
        img.classList.add('pokemon-sprite'); // Ajoute une classe pour ajuster la taille et le style si nécessaire
        opponentTeamContainer.appendChild(img);
    });

    // Afficher l'écran de transition
    const transitionScreen = document.getElementById('transition-screen');
    transitionScreen.classList.remove('hidden');
    transitionScreen.style.opacity = '1';

        // Ajouter le texte défilant
    const scrollingText = document.getElementById('scrolling-text');
    scrollingText.classList.add('active'); // Active l'animation de défilement

    // Lancer l'animation et masquer l'écran après 10 secondes (ajuste la durée si nécessaire)
    setTimeout(() => {
        scrollingText.classList.remove('active'); // Désactive le texte défilant
        transitionScreen.style.opacity = '0';
        setTimeout(() => {
            transitionScreen.classList.add('hidden');
            if (typeof callback === 'function') {
                callback();
            }
        }, 500); // Laisser le temps à l'animation de se terminer avant de masquer l'élément
    }, 10000); // Durée de l'affichage de l'écran de transition (10 secondes)
}

