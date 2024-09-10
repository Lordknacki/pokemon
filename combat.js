let playerPokemon;
let opponentPokemon;
let currentTurn = "player"; // Commence avec le joueur

// Fonction pour initialiser le combat
function initializeCombat() {
    // Choisir le premier Pokémon du joueur et un Pokémon adverse
    playerPokemon = selectedPokemon[0]; // Le premier Pokémon de l'équipe
    opponentPokemon = {
        name: "Dracaufeu",
        level: 50,
        hp: 150,
        maxHp: 150,
        moves: [
            { name: "Flamethrower", power: 90, type: "Fire" },
            { name: "Dragon Claw", power: 80, type: "Dragon" },
            { name: "Fly", power: 70, type: "Flying" },
            { name: "Slash", power: 70, type: "Normal" }
        ]
    };

    // Mise à jour des informations de combat
    document.getElementById("player-pokemon-name").innerText = `${playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)} Lv. ${playerPokemon.level}`;
    document.getElementById("opponent-pokemon-name").innerText = `${opponentPokemon.name} Lv. ${opponentPokemon.level}`;

    updateHpBars();

    // Gérer les boutons
    document.getElementById("attack-button").addEventListener("click", showAttackOptions);
    document.getElementById("pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-button").addEventListener("click", runAway);
}

// Afficher les options d'attaques
function showAttackOptions() {
    const attackOptions = document.getElementById("attack-options");
    attackOptions.innerHTML = ''; // Réinitialisation des options

    playerPokemon.moves.forEach((move) => {
        const button = document.createElement("button");
        button.innerText = move.name;
        button.addEventListener("click", () => playerAttack(move));
        attackOptions.appendChild(button);
    });

    document.getElementById("combat-options").classList.add("hidden");
    attackOptions.classList.remove("hidden");
}

// Attaque du joueur
function playerAttack(move) {
    const damage = calculateDamage(move, playerPokemon, opponentPokemon);
    opponentPokemon.hp -= damage;
    if (opponentPokemon.hp < 0) opponentPokemon.hp = 0;

    updateHpBars();

    if (opponentPokemon.hp === 0) {
        endBattle("player");
        return;
    }

    currentTurn = "opponent";
    setTimeout(opponentTurn, 1000); // Délai avant que l'adversaire attaque
}

// Attaque de l'adversaire
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

    currentTurn = "player";
    document.getElementById("combat-options").classList.remove("hidden");
    document.getElementById("attack-options").classList.add("hidden");
}

// Calcul des dégâts
function calculateDamage(move, attacker, defender) {
    const baseDamage = move.power;
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const attackDefenseRatio = (baseDamage * levelFactor) / 50 + 2;
    return Math.floor(attackDefenseRatio * Math.random() * 0.85);
}

// Mettre à jour les barres de HP
function updateHpBars() {
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;

    document.getElementById("player-hp").style.width = `${playerHpPercent}%`;
    document.getElementById("opponent-hp").style.width = `${opponentHpPercent}%`;

    document.getElementById("player-hp").className = playerHpPercent > 50 ? "hp-bar hp-green" : playerHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
    document.getElementById("opponent-hp").className = opponentHpPercent > 50 ? "hp-bar hp-green" : opponentHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
}

// Changer de Pokémon (fonctionnalité future)
function changePokemon() {
    alert("Fonction non disponible pour l'instant.");
}

// Fuir le combat
function runAway() {
    alert("Tu ne peux pas fuir !");
}

// Fin du combat
function endBattle(winner) {
    if (winner === "player") {
        alert("Félicitations, tu as gagné !");
        document.getElementById("victory
