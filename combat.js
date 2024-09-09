// Fonction pour démarrer le combat
document.getElementById('start-game').addEventListener('click', () => {
    document.getElementById('selection-phase').classList.add('hidden');
    document.getElementById('combat-phase').classList.remove('hidden');
    initializeBattle();
});

// Initialisation du combat
function initializeBattle() {
    // Ajoute ici les configurations initiales du combat
    setPlayerPokemon();
    setOpponentPokemon();
    setupCombatUI();
}

// Définit le Pokémon du joueur
function setPlayerPokemon() {
    const playerPokemon = selectedPokemon[0]; // Le premier Pokémon sélectionné
    document.getElementById('player-pokemon-name').innerText = `${capitalize(playerPokemon.name)} Lv. 50`;
    document.getElementById('player-pokemon-sprite').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${playerPokemon.id}.png`;
    document.getElementById('player-hp').style.width = '100%'; // HP complet au départ
}

// Définit le Pokémon adverse (aléatoire)
function setOpponentPokemon() {
    const opponentPokemonId = Math.floor(Math.random() * 150) + 1; // Pokémon aléatoire entre 1 et 150
    fetch(`https://pokeapi.co/api/v2/pokemon/${opponentPokemonId}`)
        .then(response => response.json())
        .then(opponentPokemon => {
            document.getElementById('opponent-pokemon-name').innerText = `${capitalize(opponentPokemon.name)} Lv. 55`;
            document.getElementById('opponent-pokemon-sprite').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${opponentPokemon.id}.png`;
            document.getElementById('opponent-hp').style.width = '100%'; // HP complet au départ
        });
}

// Configure l'interface de combat
function setupCombatUI() {
    document.getElementById('attack-button').addEventListener('click', () => {
        showAttackOptions();
    });

    document.getElementById('pokemon-button').addEventListener('click', () => {
        alert("Changer de Pokémon");
    });

    document.getElementById('bag-button').addEventListener('click', () => {
        alert("Ouvrir le sac");
    });

    document.getElementById('run-button').addEventListener('click', () => {
        alert("Fuite impossible !");
    });
}

// Affiche les options d'attaque
function showAttackOptions() {
    document.getElementById('combat-options').classList.add('hidden');
    document.getElementById('attack-menu').classList.remove('hidden');

    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = ''; // Réinitialiser les options d'attaque

    const attacks = ['Éclair', 'Queue de Fer', 'Vive-Attaque', 'Tonnerre']; // Exemples d'attaques
    attacks.forEach(attack => {
        const button = document.createElement('button');
        button.innerText = attack;
        button.addEventListener('click', () => handleAttack(attack));
        attackOptions.appendChild(button);
    });
}

// Gestion des attaques
function handleAttack(attack) {
    alert(`Tu as utilisé ${attack} !`);

    // Exemple de calcul des dégâts
    const damage = Math.floor(Math.random() * 20) + 10;
    reduceOpponentHP(damage);

    // Après l'attaque, revenir au menu principal de combat
    document.getElementById('combat-options').classList.remove('hidden');
    document.getElementById('attack-menu').classList.add('hidden');
}

// Réduire les HP du Pokémon adverse
function reduceOpponentHP(damage) {
    const opponentHPBar = document.getElementById('opponent-hp');
    let currentHPWidth = parseInt(opponentHPBar.style.width);
    let newHPWidth = Math.max(currentHPWidth - damage, 0); // Ne pas aller en dessous de 0
    opponentHPBar.style.width = `${newHPWidth}%`;

    if (newHPWidth === 0) {
        alert("L'adversaire est KO !");
    }
}

// Fonction utilitaire pour capitaliser les noms de Pokémon
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
