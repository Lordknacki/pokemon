let playerPokemon;
let opponentPokemon;
let currentTurn = "player"; // Le joueur commence toujours

// Initialisation du combat
function initializeCombat() {
    playerPokemon = selectedPokemon[0]; // Le premier Pokémon de l'équipe du joueur
    opponentPokemon = generateOpponentPokemon(); // Générer un Pokémon adverse aléatoire

    // Mise à jour des informations des Pokémon (nom, niveau, etc.)
    document.getElementById("player-pokemon-name").innerText = `${playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)} Lv. ${playerPokemon.level}`;
    document.getElementById("opponent-pokemon-name").innerText = `${opponentPokemon.name} Lv. ${opponentPokemon.level}`;

    // Mise à jour des barres de HP
    updateHpBars();

    // Gérer les événements pour les actions de combat
    document.getElementById("attack-button").addEventListener("click", showAttackOptions);
    document.getElementById("pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-button").addEventListener("click", runAway);
}

// Générer un Pokémon adverse aléatoire
async function generateOpponentPokemon() {
    const randomId = Math.floor(Math.random() * 386) + 1; // Générer un ID aléatoire entre 1 et 386 (Première Génération)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();

    // Retourner un Pokémon adverse avec des statistiques et des attaques
    return {
        name: pokemon.name,
        level: Math.floor(Math.random() * 50) + 1, // Générer un niveau aléatoire entre 1 et 50
        hp: pokemon.stats[0].base_stat, // Utiliser la statistique de HP de l'API
        maxHp: pokemon.stats[0].base_stat,
        type: pokemon.types[0].type.name, // Prendre le premier type
        moves: pokemon.moves.slice(0, 4).map(move => ({
            name: move.move.name,
            power: Math.floor(Math.random() * 100) + 50, // Générer une puissance aléatoire
            type: pokemon.types[0].type.name // Associer au type du Pokémon
        }))
    };
}

// Afficher les options d'attaque spécifiques du joueur
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
    setTimeout(opponentTurn, 1000); // Délai avant l'attaque de l'adversaire
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

// Calcul des dégâts ajusté en fonction des types de Pokémon
const typeEffectiveness = {
    Fire: { Grass: 2, Water: 0.5, Fire: 0.5, Dragon: 0.5 },
    Water: { Fire: 2, Grass: 0.5, Water: 0.5, Dragon: 0.5 },
    Grass: { Water: 2, Fire: 0.5, Grass: 0.5, Dragon: 0.5 },
    // Ajouter plus de types ici
};

function calculateDamage(move, attacker, defender) {
    const baseDamage = move.power;
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const attackDefenseRatio = (baseDamage * levelFactor) / 50 + 2;

    // Ajustement des dégâts selon les types
    let typeEffect = 1;
    if (typeEffectiveness[move.type] && typeEffectiveness[move.type][defender.type]) {
        typeEffect = typeEffectiveness[move.type][defender.type];
    }

    return Math.floor(attackDefenseRatio * Math.random() * 0.85 * typeEffect);
}

// Mettre à jour les barres de HP après chaque attaque
function updateHpBars() {
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;

    document.getElementById("player-hp").style.width = `${playerHpPercent}%`;
    document.getElementById("opponent-hp").style.width = `${opponentHpPercent}%`;

    document.getElementById("player-hp").className = playerHpPercent > 50 ? "hp-bar hp-green" : playerHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
    document.getElementById("opponent-hp").className = opponentHpPercent > 50 ? "hp-bar hp-green" : opponentHpPercent > 20 ? "hp-bar hp-orange" : "hp-bar hp-red";
}

// Gérer le changement de Pokémon (pour le joueur uniquement)
function changePokemon() {
    const pokemonMenu = document.getElementById("pokemon-change-options");
    pokemonMenu.innerHTML = '';

    // Afficher les Pokémon restants à sélectionner pour changer
    selectedPokemon.forEach((pokemon, index) => {
        if (pokemon.hp > 0 && pokemon !== playerPokemon) { // Seulement les Pokémon non KO et non utilisés
            const button = document.createElement('button');
            button.innerText = `${pokemon.name}`;
            button.addEventListener('click', () => {
                playerPokemon = pokemon;
                updateTeamDisplay(); // Mettre à jour l'affichage des Pokémon
                currentTurn = "opponent"; // L'adversaire attaque après le changement
                opponentTurn();
            });
            pokemonMenu.appendChild(button);
        }
    });

    document.getElementById("combat-options").classList.add("hidden");
    document.getElementById("pokemon-menu").classList.remove("hidden");
}

// Gérer la fuite du combat
function runAway() {
    alert("Tu ne peux pas fuir !");
}

// Fin du combat et affichage du résultat
function endBattle(winner) {
    if (winner === "player") {
        alert("Félicitations, tu as gagné !");
        document.getElementById("victory-animation").classList.remove("hidden");
    } else {
        alert("Tu as perdu !");
        document.getElementById("game-over-screen").classList.remove("hidden");
    }

    // Cacher la phase de combat
    document.getElementById("combat-phase").classList.add('hidden');
}
