// List of trainer sprites from Bulbagarden
const trainerSprites = {
    bill: "https://archives.bulbagarden.net/media/upload/d/d7/Spr_FRLG_Bill.png",
    gentleman: "https://archives.bulbagarden.net/media/upload/7/71/Spr_FRLG_Gentleman.png",
    agatha: "https://archives.bulbagarden.net/media/upload/5/5f/Spr_FRLG_Agatha.png",
    wattson: "https://archives.bulbagarden.net/media/upload/5/54/Spr_RS_Wattson.png",
    giovanni: "https://archives.bulbagarden.net/media/upload/5/5c/Spr_FRLG_Giovanni.png",
    blaine: "https://archives.bulbagarden.net/media/upload/8/81/Spr_FRLG_Blaine.png",
    steven: "https://archives.bulbagarden.net/media/upload/9/94/Spr_RS_Steven.png",
    lance: "https://archives.bulbagarden.net/media/upload/d/d4/Spr_FRLG_Lance.png"
};

// Variables for the player's Pokémon and the opponent's Pokémon
let playerPokemon;
let opponentPokemon;
let currentTurn = "player"; // Player starts the battle

// Function to start the battle
function startBattle() {
    const trainerNames = Object.keys(trainerSprites);
    const randomTrainer = trainerNames[Math.floor(Math.random() * trainerNames.length)];
    
    // Set the trainer sprite and name
    document.getElementById("trainer-image").src = trainerSprites[randomTrainer];
    document.getElementById("trainer-name").innerText = randomTrainer.charAt(0).toUpperCase() + randomTrainer.slice(1);
    
    // Initialize player and opponent Pokémon
    playerPokemon = selectedPokemon[0]; // Player's first Pokémon
    opponentPokemon = generateOpponentPokemon(); // Generate a random opponent Pokémon

    // Update Pokémon information (name, level, etc.)
    document.getElementById("player-pokemon-name").innerText = `${playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)} Lv. ${playerPokemon.level}`;
    document.getElementById("opponent-pokemon-name").innerText = `${opponentPokemon.name} Lv. ${opponentPokemon.level}`;

    // Update HP bars
    updateHpBars();

    // Handle events for combat actions
    document.getElementById("attack-button").addEventListener("click", showAttackOptions);
    document.getElementById("pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-button").addEventListener("click", runAway);
}

// Generate a random opponent Pokémon
async function generateOpponentPokemon() {
    const randomId = Math.floor(Math.random() * 386) + 1; // Random ID between 1 and 386 (First Generation)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();

    // Return an opponent Pokémon with stats and moves
    return {
        name: pokemon.name,
        level: Math.floor(Math.random() * 50) + 1, // Random level between 1 and 50
        hp: pokemon.stats[0].base_stat, // Use HP stat from API
        maxHp: pokemon.stats[0].base_stat,
        type: pokemon.types[0].type.name, // First type
        moves: pokemon.moves.slice(0, 4).map(move => ({
            name: move.move.name,
            power: Math.floor(Math.random() * 100) + 50, // Random power
            type: pokemon.types[0].type.name // Match Pokémon type
        }))
    };
}

// Display player's attack options
function showAttackOptions() {
    const attackOptions = document.getElementById("attack-options");
    attackOptions.innerHTML = ''; // Clear previous options

    playerPokemon.moves.forEach((move) => {
        const button = document.createElement("button");
        button.innerText = move.name;
        button.addEventListener("click", () => playerAttack(move));
        attackOptions.appendChild(button);
    });

    document.getElementById("combat-options").classList.add("hidden");
    attackOptions.classList.remove("hidden");
}

// Handle player's attack
function playerAttack(move) {
    const damage = calculateDamage(move, playerPokemon, opponentPokemon);
    opponentPokemon.hp -= damage;
    if (opponentPokemon.hp < 0) opponentPokemon.hp = 0;

    updateHpBars();

    if (opponentPokemon.hp === 0) {
        endBattle("player");
        return;
    }

    // Pass turn to opponent
    currentTurn = "opponent";
    setTimeout(opponentTurn, 1000); // Delay before opponent attacks
}

// Handle opponent's attack
function opponentTurn() {
    const randomMove = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
    const damage = calculateDamage(randomMove, opponentPokemon, playerPokemon);
    playerPokemon.hp -= damage;
    if (playerPokemon.hp < 0) playerPokemon.hp = 0;

    updateHpBars();

    if (playerPokemon.hp === 0) {
        endBattle("opponent");
        return;
    }

    // Return to player's turn
    currentTurn = "player";
    document.getElementById("combat-options").classList.remove("hidden");
    document.getElementById("attack-options").classList.add("hidden");
}

// Damage calculation based on Pokémon types
const typeEffectiveness = {
    Fire: { Grass: 2, Water: 0.5, Fire: 0.5, Dragon: 0.5 },
    Water: { Fire: 2, Grass: 0.5, Water: 0.5, Dragon: 0.5 },
    Grass: { Water: 2, Fire: 0.5, Grass: 0.5, Dragon: 0.5 }
    // Add more types as needed
};

function calculateDamage(move, attacker, defender) {
    const baseDamage = move.power;
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const attackDefenseRatio = (baseDamage * levelFactor) / 50 + 2;

    // Adjust damage based on type effectiveness
    let typeEffect = 1;
    if (typeEffectiveness[move.type] && typeEffectiveness[move.type][defender.type]) {
        typeEffect = typeEffectiveness[move.type][defender.type];
    }

    return Math.floor(attackDefenseRatio * Math.random() * 0.85 * typeEffect);
}

// Update HP bars after each attack
function updateHpBars() {
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;

    document.getElementById("player-hp").style.width = `${playerHpPercent}%`;
    document.getElementById("opponent-hp").style.width = `${opponentHpPercent}%`;

    document.getElementById("player-hp").className = playerHpPercent > 50 ? "hp-bar hp-green" : playerHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
    document.getElementById("opponent-hp").className = opponentHpPercent > 50 ? "hp-bar hp-green" : opponentHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
}

// Handle Pokémon switch (player only)
function changePokemon() {
    const pokemonMenu = document.getElementById("pokemon-change-options");
    pokemonMenu.innerHTML = ''; // Clear previous options

    selectedPokemon.forEach(pokemon => {
        if (pokemon.hp > 0 && pokemon !== playerPokemon) {
            const button = document.createElement('button');
            button.innerText = pokemon.name;
            button.addEventListener('click', () => {
                playerPokemon = pokemon;
                updateTeamDisplay();
                currentTurn = "opponent";
                opponentTurn();
            });
            pokemonMenu.appendChild(button);
        }
    });

    document.getElementById("combat-options").classList.add("hidden");
    document.getElementById("pokemon-menu").classList.remove("hidden");
}

// Handle running away (player cannot run)
function runAway() {
    alert("Tu ne peux pas fuir !");
}

// End the battle and display result
function endBattle(winner) {
    if (winner === "player") {
        alert("Félicitations, tu as gagné !");
        document.getElementById("victory-animation").classList.remove("hidden");
    } else {
        alert("Tu as perdu !");
        document.getElementById("game-over-screen").classList.remove("hidden");
    }

    // Hide combat phase
    document.getElementById("combat-phase").classList.add("hidden");
}
