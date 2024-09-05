function initCombat() {
    const playerTeam = selectedPokemon;
    const opponentTeam = getRandomPokemonTeam();

    document.getElementById("player-pokemon").innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${playerTeam[0].id}.gif" alt="${playerTeam[0].name}">
    `;
    document.getElementById("opponent-pokemon").innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${getOpponentSprite(opponentTeam[0])}.gif" alt="${opponentTeam[0]}">
    `;

    setupBattle(playerTeam, opponentTeam);
}

// Générer une équipe aléatoire pour les dresseurs
function getRandomPokemonTeam() {
    const allPokemon = ["Bulbasaur", "Charmander", "Squirtle", "Pidgeotto", "Butterfree", "Beedrill", "Raticate", "Fearow"];
    let randomTeam = [];
    while (randomTeam.length < 6) {
        const randomIndex = Math.floor(Math.random() * allPokemon.length);
        const pokemon = allPokemon[randomIndex];
        if (!randomTeam.includes(pokemon)) {
            randomTeam.push(pokemon);
        }
    }
    return randomTeam;
}

// Retourner l'ID du sprite pour l'ennemi
function getOpponentSprite(pokemonName) {
    const nameToId = {
        "Venusaur": 3,
        "Charizard": 6,
        "Blastoise": 9,
        "Dragonite": 149,
        "Aerodactyl": 142,
        "Mewtwo": 150
    };
    return nameToId[pokemonName] || 1; // Par défaut, renvoyer un sprite d'id 1
}

// Préparer le combat avec les statistiques et attaques des Pokémon
function setupBattle(playerTeam, opponentTeam) {
    fetchPokemonMoves(playerTeam[0], "player");
    fetchPokemonMoves({ name: opponentTeam[0] }, "opponent");

    document.getElementById("attack-button").addEventListener("click", () => {
        document.getElementById("attack-menu").classList.remove("hidden");
    });
}

// Récupérer les attaques des Pokémon
async function fetchPokemonMoves(pokemon, type) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
    const data = await response.json();

    pokemon.moves = data.moves.slice(0, 4).map(move => move.move.name); // Sélectionner 4 attaques
    if (type === "player") {
        displayPlayerMoves(pokemon.moves);
    }
}

// Afficher les attaques du joueur dans le menu
function displayPlayerMoves(moves) {
    const attackList = document.getElementById("attack-list");
    attackList.innerHTML = ''; // Réinitialiser la liste d'attaques

    moves.forEach((move) => {
        const moveItem = document.createElement("li");
        moveItem.textContent = move;
        moveItem.addEventListener("click", () => {
            console.log(`${move} a été utilisé !`);
            document.getElementById("attack-menu").classList.add("hidden");
        });
        attackList.appendChild(moveItem);
    });
}
