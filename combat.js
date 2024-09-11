// Lien pour les sprites animés
const spriteBaseUrl = "https://play.pokemonshowdown.com/sprites/xyani/";

// Variables pour les Pokémon du joueur et de l'adversaire
let playerPokemon;
let opponentPokemon;
let currentTurn = "player"; // Le joueur commence toujours

// Fonction pour mettre à jour les sprites des Pokémon avec les Pokémon sélectionnés et adverses
function updatePokemonSprites() {
    // Sprite animé du Pokémon du joueur
    document.getElementById("player-pokemon-sprite").src = `${spriteBaseUrl}${playerPokemon.name.toLowerCase()}.gif`;

    // Sprite animé du Pokémon adverse
    document.getElementById("opponent-pokemon-sprite").src = `${spriteBaseUrl}${opponentPokemon.name.toLowerCase()}.gif`;

    // Mettre à jour l'équipe avec les sprites animés
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; // Vider l'affichage actuel de l'équipe

    selectedPokemon.forEach(pokemon => {
        const img = document.createElement('img');
        img.src = `${spriteBaseUrl}${pokemon.name.toLowerCase()}.gif`; // Sprite animé
        img.alt = pokemon.name;
        teamContainer.appendChild(img);
    });
}

// Fonction pour démarrer le combat
async function startBattle() {
    // Initialiser les Pokémon du joueur et de l'adversaire
    playerPokemon = selectedPokemon[0]; // Premier Pokémon sélectionné par le joueur
    opponentPokemon = await generateOpponentPokemon(); // Générer un Pokémon adverse aléatoire

    // Mettre à jour les informations des Pokémon (nom, niveau, etc.)
    document.getElementById("player-pokemon-name").innerText = `${capitalize(playerPokemon.name)} Lv. ${playerPokemon.level}`;
    document.getElementById("opponent-pokemon-name").innerText = `${capitalize(opponentPokemon.name)} Lv. ${opponentPokemon.level}`;

    // Mettre à jour les barres de HP
    updateHpBars();

    // Mettre à jour les sprites animés
    updatePokemonSprites();

    // Gérer les événements pour les actions de combat
    document.getElementById("attack-button").addEventListener("click", showAttackOptions);
    document.getElementById("pokemon-button").addEventListener("click", changePokemon);
    document.getElementById("run-button").addEventListener("click", runAway);
}

// Générer un Pokémon adverse aléatoire
async function generateOpponentPokemon() {
    const randomId = Math.floor(Math.random() * 386) + 1; // Pokémon aléatoire entre 1 et 386
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemonData = await response.json();

    // Retourner le Pokémon adverse avec ses statistiques et ses attaques
    return {
        name: pokemonData.name,
        level: Math.floor(Math.random() * 50) + 1, // Niveau aléatoire entre 1 et 50
        hp: pokemonData.stats[0].base_stat,
        maxHp: pokemonData.stats[0].base_stat,
        type: pokemonData.types[0].type.name,
        moves: pokemonData.moves.slice(0, 4).map(move => ({
            name: move.move.name,
            power: Math.floor(Math.random() * 50) + 50, // Puissance aléatoire entre 50 et 100
            type: pokemonData.types[0].type.name
        }))
    };
}

// Afficher les options d'attaque du joueur
function showAttackOptions() {
    const attackOptions = document.getElementById("attack-options");
    attackOptions.innerHTML = ''; // Vider les options précédentes

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

// Calcul des dégâts en fonction des types de Pokémon
const typeEffectiveness = {
    fire: { grass: 2, water: 0.5, fire: 0.5 },
    water: { fire: 2, grass: 0.5, water: 0.5 },
    grass: { water: 2, fire: 0.5, grass: 0.5 },
    // Ajouter plus de types si nécessaire
};

function calculateDamage(move, attacker, defender) {
    const baseDamage = move.power;
    const levelFactor = (2 * attacker.level) / 5 + 2;
    const attackDefenseRatio = baseDamage * (attacker.level / defender.level);
    let typeEffect = 1;

    const moveType = move.type.toLowerCase();
    const defenderType = defender.type.toLowerCase();

    if (typeEffectiveness[moveType] && typeEffectiveness[moveType][defenderType]) {
        typeEffect = typeEffectiveness[moveType][defenderType];
    }

    return Math.floor(((attackDefenseRatio / 50) + 2) * typeEffect);
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
    pokemonMenu.innerHTML = ''; // Vider les options précédentes

    selectedPokemon.forEach(pokemon => {
        if (pokemon.hp > 0 && pokemon !== playerPokemon) {
            const button = document.createElement('button');
            button.innerText = pokemon.name;
            button.addEventListener('click', () => {
                playerPokemon = pokemon;
                updatePokemonSprites();
                updateHpBars();
                currentTurn = "opponent";
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

// Terminer le combat et afficher le résultat
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

// Fonction utilitaire pour capitaliser la première lettre
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
