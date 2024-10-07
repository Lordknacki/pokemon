async function startBattle(playerPokemon) {
    try {
        selectedOpponent = await getRandomPokemon();
        if (!selectedOpponent || !selectedOpponent.stats) {
            console.error("Erreur : Les statistiques du Pokémon adverse sont introuvables.");
            return;
        }

        displayPokemonOnBattlefield(playerPokemon, selectedOpponent);
        document.getElementById('selection-phase').classList.add('hidden');
        document.getElementById('combat-phase').classList.remove('hidden');

        initializePokeballs();

        // Déterminer qui commence le combat
        const currentTurn = determineTurnOrder(playerPokemon, selectedOpponent);
        executeTurn(currentTurn);
    } catch (error) {
        console.error("Erreur lors du démarrage du combat :", error);
    }
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
        // Le joueur attaque
        displayMoves(playerPokemon.moves); // Affiche les mouvements du joueur pour qu'il puisse choisir
    } else if (currentTurn === 'opponent') {
        // L'adversaire attaque de manière automatique
        await opponentMove();
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
        
        if (!playerPokemon || !selectedOpponent) {
            console.error("Erreur : Pokémon manquant pour l'attaque de l'adversaire.");
            return;
        }

        const damage = calculateDamage(selectedOpponent, playerPokemon, moveDetails);
        applyDamage(playerPokemon, damage, 'player-hp', 'player-hp-text');
        
        if (playerPokemon.currentHP <= 0) {
            updatePokeballs('player', 0); // Utiliser l'index du Pokémon KO si nécessaire
            endBattle("Your Pokémon fainted! You lose.");
        } else {
            // Si le joueur n'est pas KO, c'est à son tour
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

