// Constantes pour les sprites animés et la base de l'URL API
const spriteBaseUrl = "https://play.pokemonshowdown.com/sprites/xyani/";
const apiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

// Variables pour gérer les Pokémon du joueur et de l'adversaire
let playerPokemon, opponentPokemon;
let currentTurn = "player"; // Le joueur commence

// Fonction pour démarrer le combat
async function startBattle() {
    playerPokemon = selectedPokemon[0]; // Premier Pokémon sélectionné par le joueur
    opponentPokemon = await generateOpponentPokemon(); // Générer un Pokémon adverse aléatoire
    updateBattleUI();
    document.getElementById('combat-phase').classList.remove('hidden');
}

// Générer un Pokémon adverse aléatoire
async function generateOpponentPokemon() {
    const randomId = Math.floor(Math.random() * 386) + 1;
    const response = await fetch(`${apiBaseUrl}${randomId}`);
    const data = await response.json();
    return mapPokemonData(data);
}

// Fonction pour mapper les données de l'API à notre format
function mapPokemonData(data) {
    return {
        name: data.name,
        level: Math.floor(Math.random() * 50) + 1,
        hp: data.stats[0].base_stat,
        maxHp: data.stats[0].base_stat,
        type: data.types[0].type.name,
        moves: data.moves.slice(0, 4).map(move => ({
            name: move.move.name,
            power: Math.floor(Math.random() * 50) + 50, // Puissance entre 50 et 100
            type: data.types[0].type.name,
            accuracy: Math.random() > 0.1 ? 100 : 80 // 10% de chance d'avoir une précision réduite
        }))
    };
}

// Mettre à jour l'interface utilisateur du combat
function updateBattleUI() {
    updatePokemonSprites();
    updateHpBars();
    showCurrentTurn();
}

// Mettre à jour les sprites des Pokémon
function updatePokemonSprites() {
    document.getElementById("player-pokemon-sprite").src = `${spriteBaseUrl}${playerPokemon.name.toLowerCase()}.gif`;
    document.getElementById("opponent-pokemon-sprite").src = `${spriteBaseUrl}${opponentPokemon.name.toLowerCase()}.gif`;
}

// Afficher le tour actuel
function showCurrentTurn() {
    const statusText = currentTurn === "player" ? "À ton tour de jouer!" : "Tour de l'adversaire...";
    document.getElementById("battle-status").textContent = statusText;
    if (currentTurn === "opponent") {
        setTimeout(opponentTurn, 1000);
    }
}

// Tour de l'adversaire avec IA améliorée
function opponentTurn() {
    const move = chooseMoveIA(opponentPokemon, playerPokemon);
    executeMove(opponentPokemon, playerPokemon, move);
}

// Choix de mouvement par l'IA
function chooseMoveIA(pokemon, opponent) {
    const effectiveMoves = pokemon.moves.filter(move => getTypeEffectiveness(move.type, opponent.type) > 1);
    return effectiveMoves.length > 0 && Math.random() < 0.75 ? effectiveMoves[Math.floor(Math.random() * effectiveMoves.length)] : pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
}

// Exécution d'un mouvement
function executeMove(attacker, defender, move) {
    if (Math.random() * 100 > move.accuracy) {
        alert(`${attacker.name} a raté son attaque!`);
        return endTurn();
    }
    const damage = calculateDamage(move, attacker, defender);
    defender.hp -= damage;
    alert(`${attacker.name} utilise ${move.name} et inflige ${damage} dégâts!`);
    applyHitAnimation(defender === playerPokemon ? "player" : "opponent");
    if (defender.hp <= 0) {
        defender.hp = 0;
        endBattle(attacker === playerPokemon ? "player" : "opponent");
    } else {
        endTurn();
    }
    updateHpBars();
}

// Calcul des dégâts avec coups critiques
function calculateDamage(move, attacker, defender) {
    const critical = Math.random() < 0.1 ? 2 : 1; // 10% chance de coup critique
    const typeEffect = getTypeEffectiveness(move.type, defender.type);
    return Math.floor(((move.power * (attacker.level / defender.level) * typeEffect * critical) / 50) + 2);
}

// Obtention de l'efficacité du type
function getTypeEffectiveness(moveType, defenderType) {
    const effectiveness = {
        fire: { grass: 2, water: 0.5 },
        water: { fire: 2, grass: 0.5 },
        grass: { water: 2, fire: 0.5 }
        // Ajouter plus de types ici
    };
    return effectiveness[moveType][defenderType] || 1; // Retourne 1 si pas de correspondance spécifique
}

// Animer un Pokémon qui reçoit un coup
function applyHitAnimation(target) {
    const elementId = target === "player" ? "player-pokemon" : "opponent-pokemon";
    const pokemonElement = document.getElementById(elementId);
    pokemonElement.classList.add('pokemon-hit');
    setTimeout(() => pokemonElement.classList.remove('pokemon-hit'), 500);
}

// Mettre à jour les barres de HP
function updateHpBars() {
    const playerHpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
    const opponentHpPercent = (opponentPokemon.hp / opponentPokemon.maxHp) * 100;
    document.getElementById("player-hp").style.width = `${playerHpPercent}%`;
    document.getElementById("opponent-hp").style.width = `${opponentHpPercent}%`;
}

// Terminer le tour
function endTurn() {
    currentTurn = currentTurn === "player" ? "opponent" : "player";
    showCurrentTurn();
}

// Terminer le combat
function endBattle(winner) {
    const message = winner === "player" ? "Félicitations, tu as gagné!" : "Tu as perdu le combat!";
    alert(message);
    document.getElementById('combat-phase').classList.add('hidden');
    document.getElementById(winner === "player" ? "victory-animation" : "game-over-screen").classList.remove('hidden');
}

// Démarrer un nouveau combat
function restartBattle() {
    selectedPokemon.forEach(p => p.hp = p.maxHp); // Réinitialiser les HP
    startBattle();
}
