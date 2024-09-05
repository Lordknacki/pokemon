document.addEventListener("DOMContentLoaded", () => {
    let currentTrainer = 1; // Compteur des dresseurs
    let maxTrainers = 8; // Il y aura 8 dresseurs à affronter

    const playerPokemon = {
        name: "Pikachu", // Exemple, tu peux ajouter un choix dynamique
        hp: 100,
        moves: [],
    };

    const opponentPokemon = {}; // L'équipe sera définie aléatoirement sauf pour le dernier dresseur

    setupBattle(playerPokemon, opponentPokemon, currentTrainer);
});

function setupBattle(playerPokemon, opponentPokemon, trainerNumber) {
    // Si c'est le dernier dresseur
    if (trainerNumber === 8) {
        opponentPokemon.name = ["Venusaur", "Charizard", "Blastoise", "Dragonite", "Aerodactyl", "Mewtwo"];
    } else {
        // Dresseurs aléatoires pour les autres rounds
        opponentPokemon.name = getRandomPokemonTeam();
    }

    document.getElementById("player-pokemon").textContent = `${playerPokemon.name} - ${playerPokemon.hp} HP`;
    document.getElementById("opponent-pokemon").textContent = `Dresseur ${trainerNumber} - ${opponentPokemon.name[0]} et son équipe`;

    fetchPokemonMoves(playerPokemon, "player");
    fetchPokemonMoves(opponentPokemon, "opponent");

    document.getElementById("attack-button").addEventListener("click", () => {
        document.getElementById("attack-menu").classList.remove("hidden");
    });
}

// Fonction pour obtenir une équipe aléatoire sauf pour le dernier dresseur
function getRandomPokemonTeam() {
    const allPokemon = ["Bulbasaur", "Charmander", "Squirtle", "Pidgeotto", "Butterfree", "Beedrill", "Raticate", "Fearow"];
    let randomTeam = [];
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * allPokemon.length);
        randomTeam.push(allPokemon[randomIndex]);
    }
    return randomTeam;
}

async function fetchPokemonMoves(pokemon, type) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name[0].toLowerCase()}`);
    const data = await response.json();
    
    pokemon.moves = data.moves.slice(0, 4).map(move => move.move.name); // Sélectionner 4 attaques
    if (type === "player") {
        displayPlayerMoves(pokemon.moves);
    }
}

function displayPlayerMoves(moves) {
    const attackList = document.getElementById("attack-list");
    attackList.innerHTML = "";
    
    moves.forEach((move) => {
        const moveItem = document.createElement("li");
        moveItem.textContent = move;
        moveItem.addEventListener("click", () => {
            console.log(`${move} a été utilisé!`);
            document.getElementById("attack-menu").classList.add("hidden");
            // Ajouter la logique de dégâts ici
        });
        attackList.appendChild(moveItem);
    });
}
