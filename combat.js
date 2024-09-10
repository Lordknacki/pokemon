let playerPokemon;
let opponentPokemon;
let currentTurn = "player"; // Le joueur commence toujours

// Fonction pour initialiser le combat
function initializeCombat() {
    // Choisir le premier Pokémon du joueur et définir un Pokémon adverse
    playerPokemon = selectedPokemon[0]; // Le premier Pokémon de l'équipe du joueur
    opponentPokemon = generateOpponentPokemon(); // Génère un Pokémon adverse aléatoire

    // Mise à jour des informations de combat (nom, niveau, etc.)
    document.getElementById("player-pokemon-name").innerText = `${playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)} Lv. ${playerPokemon.level}`;
    document.getElementById("opponent-pokemon-name").innerText = `${opponentPokemon.name} Lv. ${opponentPokemon.level}`;

    updateHpBars();

    // Gestion des événements pour les boutons
    document.getElementById("attack-button").addEventListener("click", showAttackOptions);
    document.getElementById("pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-button").addEventListener("click", runAway);
}

// Générer un Pokémon adverse aléatoire pour le combat
function generateOpponentPokemon() {
    const opponentPokemonList = [
        { name: "Dracaufeu", level: 50, hp: 150, maxHp: 150, moves: [ { name: "Flamethrower", power: 90, type: "Fire" }, { name: "Dragon Claw", power: 80, type: "Dragon" }, { name: "Fly", power: 70, type: "Flying" }, { name: "Slash", power: 70, type: "Normal" } ] },
        { name: "Tortank", level: 50, hp: 160, maxHp: 160, moves: [ { name: "Hydro Pump", power: 110, type: "Water" }, { name: "Ice Beam", power: 90, type: "Ice" }, { name: "Bite", power: 60, type: "Dark" }, { name: "Surf", power: 90, type: "Water" } ] },
        // Ajouter d'autres Pokémon adversaires ici...
    ];
    
    return opponentPokemonList[Math.floor(Math.random() * opponentPokemonList.length)];
}

// Afficher les options d'attaque du joueur
function showAttackOptions() {
    const attackOptions = document.getElementById("attack-options");
    attackOptions.innerHTML = ''; // Réinitialiser les options

    playerPokemon.moves.forEach((move) => {
        const button = document.createElement("button");
        button.innerText = move.name;
        button.addEventListener("click", () => playerAttack(move));
        attackOptions.appendChild(button);
    });

    document.getElementById("combat-options").classList.add("hidden");
    attackOptions.classList.remove("hidden");
}

// Gérer l'attaque du joueur
function playerAttack(move) {
    const damage = calculateDamage(move, playerPokemon, opponentPokemon);
    opponentPokemon.hp -= damage;
    if (opponentPokemon.hp < 0) opponentPokemon.hp = 0;

    updateHpBars();

    if (opponentPokemon.hp === 0) {
        endBattle("player");
        return;
    }

    // Passer au tour de l'adversaire
    currentTurn = "opponent";
    setTimeout(opponentTurn, 1000); // Attente d'une seconde avant l'attaque de l'adversaire
}

// Gérer l'attaque de l'adversaire
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

    // Retour au tour du joueur
    currentTurn = "player";
    document.getElementById("combat-options").classList.remove("hidden");
    document.getElementById("attack-options").classList.add("hidden");
}

// Calculer les dégâts infligés
function calculateDamage(move, attacker, defender) {
    const baseDamage = move.power;
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const attackDefenseRatio = (baseDamage * levelFactor) / 50 + 2;
    return Math.floor(attackDefenseRatio * Math.random() * 0.85); // Les dégâts sont ajustés par un facteur aléatoire
}

// Mettre à jour les barres de HP après chaque attaque
function updateHpBars() {
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;

    document.getElementById("player-hp").style.width = `${playerHpPercent}%`;
    document.getElementById("opponent-hp").style.width = `${opponentHpPercent}%`;

    // Modifier les couleurs des barres de HP selon la santé restante
    document.getElementById("player-hp").className = playerHpPercent > 50 ? "hp-bar hp-green" : playerHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
    document.getElementById("opponent-hp").className = opponentHpPercent > 50 ? "hp-bar hp-green" : opponentHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
}

// Gérer le changement de Pokémon (fonctionalité à implémenter)
function changePokemon() {
    alert("Fonction de changement de Pokémon non encore disponible.");
}

// Gérer la fuite du combat
function runAway() {
    alert("Tu ne peux pas fuir !");
}

// Fin du combat et affichage du résultat (victoire ou défaite)
function endBattle(winner) {
    if (winner === "player") {
        alert("Félicitations, tu as gagné !");
        document.getElementById("victory-animation").classList.remove("hidden");
    } else {
        alert("Tu as perdu !");
        document.getElementById("game-over-screen").classList.remove("hidden");
    }

    // Cacher la phase de combat
    document.getElementById("combat-phase").classList.add("hidden");
}
