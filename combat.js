document.addEventListener("DOMContentLoaded", () => {
    initializeCombat();
});

let playerPokemon = {
    name: "Pikachu",
    level: 50,
    hp: 120,
    maxHp: 120,
    type: "Electric",
    moves: [
        { name: "Thunderbolt", power: 90, type: "Electric" },
        { name: "Quick Attack", power: 40, type: "Normal" },
        { name: "Iron Tail", power: 100, type: "Steel" },
        { name: "Electro Ball", power: 60, type: "Electric" }
    ]
};

let opponentPokemon = {
    name: "Dracaufeu",
    level: 50,
    hp: 150,
    maxHp: 150,
    type: "Fire/Flying",
    moves: [
        { name: "Flamethrower", power: 90, type: "Fire" },
        { name: "Dragon Claw", power: 80, type: "Dragon" },
        { name: "Fly", power: 70, type: "Flying" },
        { name: "Slash", power: 70, type: "Normal" }
    ]
};

let currentTurn = "player"; // Commence avec le joueur

// Fonction pour initialiser le combat
function initializeCombat() {
    // Mise à jour des informations sur les Pokémon
    document.getElementById("player-pokemon-name").innerText = `${playerPokemon.name} Lv. ${playerPokemon.level}`;
    document.getElementById("opponent-pokemon-name").innerText = `${opponentPokemon.name} Lv. ${opponentPokemon.level}`;

    updateHpBars();

    // Gestion des boutons
    document.getElementById("attack-button").addEventListener("click", showAttackOptions);
    document.getElementById("pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-button").addEventListener("click", runAway);
}

// Affichage des options d'attaque
function showAttackOptions() {
    const attackOptions = document.getElementById("attack-options");
    attackOptions.innerHTML = ''; // Réinitialisation des options

    playerPokemon.moves.forEach((move, index) => {
        const button = document.createElement("button");
        button.innerText = move.name;
        button.addEventListener("click", () => playerAttack(move));
        attackOptions.appendChild(button);
    });

    document.getElementById("combat-options").classList.add("hidden");
    attackOptions.classList.remove("hidden");
}

// Gestion de l'attaque du joueur
function playerAttack(move) {
    const damage = calculateDamage(move, playerPokemon, opponentPokemon);
    opponentPokemon.hp -= damage;
    if (opponentPokemon.hp < 0) opponentPokemon.hp = 0;

    updateHpBars();

    // Vérification si l'adversaire est KO
    if (opponentPokemon.hp === 0) {
        endBattle("player");
        return;
    }

    // Passage au tour de l'adversaire
    currentTurn = "opponent";
    setTimeout(opponentTurn, 1000); // Attente d'une seconde avant l'attaque de l'adversaire
}

// Gestion de l'attaque de l'adversaire
function opponentTurn() {
    const randomMove = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
    const damage = calculateDamage(randomMove, opponentPokemon, playerPokemon);
    playerPokemon.hp -= damage;
    if (playerPokemon.hp < 0) playerPokemon.hp = 0;

    updateHpBars();

    // Vérification si le joueur est KO
    if (playerPokemon.hp === 0) {
        endBattle("opponent");
        return;
    }

    // Retour au tour du joueur
    currentTurn = "player";
    document.getElementById("combat-options").classList.remove("hidden");
    document.getElementById("attack-options").classList.add("hidden");
}

// Calcul des dégâts
function calculateDamage(move, attacker, defender) {
    const baseDamage = move.power;
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const attackDefenseRatio = (baseDamage * levelFactor) / 50 + 2;

    // Facteurs de types, et autres facteurs peuvent être intégrés ici
    return Math.floor(attackDefenseRatio * Math.random() * 0.85);
}

// Mise à jour des barres de HP
function updateHpBars() {
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;

    document.getElementById("player-hp").style.width = `${playerHpPercent}%`;
    document.getElementById("opponent-hp").style.width = `${opponentHpPercent}%`;

    // Changement de couleur des barres de HP
    document.getElementById("player-hp").className = playerHpPercent > 50 ? "hp-bar hp-green" : playerHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
    document.getElementById("opponent-hp").className = opponentHpPercent > 50 ? "hp-bar hp-green" : opponentHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
}

// Changement de Pokémon (placeholder)
function changePokemon() {
    alert("Fonction de changement de Pokémon à ajouter.");
}

// Fuite du combat
function runAway() {
    alert("Tu ne peux pas fuir !");
}

// Fin du combat
function endBattle(winner) {
    if (winner === "player") {
        alert("Félicitations, tu as gagné le combat !");
        document.getElementById("victory-animation").classList.remove("hidden");
    } else {
        alert("Tu as perdu le combat.");
        document.getElementById("game-over-screen").classList.remove("hidden");
    }

    document.getElementById("combat-phase").classList.add("hidden");
}
