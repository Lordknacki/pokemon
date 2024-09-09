let playerTurn = true;

// Fonction pour démarrer le combat
document.getElementById('start-game').addEventListener('click', () => {
    document.getElementById('selection-phase').classList.add('hidden');
    document.getElementById('combat-phase').classList.remove('hidden');
    initializeBattle();
});

// Initialisation du combat
function initializeBattle() {
    // Configure les Pokémons et l'interface de combat
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

    // Stocker les statistiques et attaques
    playerPokemon.stats = { attack: 50, defense: 50, speed: 60 }; // Exemple de stats
    playerPokemon.attacks = [
        { name: 'Éclair', power: 40, type: 'electric' },
        { name: 'Queue de Fer', power: 100, type: 'steel' },
        { name: 'Vive-Attaque', power: 40, type: 'normal' },
        { name: 'Tonnerre', power: 90, type: 'electric' }
    ];
}

// Définit le Pokémon adverse
function setOpponentPokemon() {
    const opponentPokemonId = Math.floor(Math.random() * 386) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${opponentPokemonId}`)
        .then(response => response.json())
        .then(opponentPokemon => {
            document.getElementById('opponent-pokemon-name').innerText = `${capitalize(opponentPokemon.name)} Lv. 55`;
            document.getElementById('opponent-pokemon-sprite').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${opponentPokemon.id}.png`;
            document.getElementById('opponent-hp').style.width = '100%'; // HP complet au départ

            // Stocker les stats et attaques
            opponentPokemon.stats = { attack: 55, defense: 50, speed: 50 }; // Exemple de stats
            opponentPokemon.attacks = [
                { name: 'Lance-Flammes', power: 90, type: 'fire' },
                { name: 'Morsure', power: 60, type: 'dark' },
                { name: 'Cru-Aile', power: 60, type: 'flying' },
                { name: 'Draco-Rage', power: 40, type: 'dragon' }
            ];

            // Lance le combat
            opponentTurn(opponentPokemon);
        });
}

// Fonction pour gérer les attaques du joueur
function showAttackOptions() {
    const attackOptions = document.getElementById('attack-options');
    attackOptions.innerHTML = ''; // Réinitialiser les options d'attaque

    playerPokemon.attacks.forEach(attack => {
        const button = document.createElement('button');
        button.innerText = attack.name;
        button.addEventListener('click', () => handleAttack(attack));
        attackOptions.appendChild(button);
    });

    document.getElementById('combat-options').classList.add('hidden');
    document.getElementById('attack-menu').classList.remove('hidden');
}

// Fonction de gestion des attaques
function handleAttack(attack) {
    if (!playerTurn) return; // Attendre son tour

    const damage = calculateDamage(attack, playerPokemon, opponentPokemon);
    reduceOpponentHP(damage);

    playerTurn = false;

    // Après l'attaque du joueur, laisser l'adversaire attaquer
    setTimeout(() => opponentAttack(opponentPokemon), 2000); 
}

// Attaque de l'adversaire
function opponentAttack(opponentPokemon) {
    const attack = opponentPokemon.attacks[Math.floor(Math.random() * opponentPokemon.attacks.length)];
    alert(`L'adversaire utilise ${attack.name} !`);

    const damage = calculateDamage(attack, opponentPokemon, playerPokemon);
    reducePlayerHP(damage);

    playerTurn = true;
    document.getElementById('combat-options').classList.remove('hidden');
    document.getElementById('attack-menu').classList.add('hidden');
}

// Calcul des dégâts
function calculateDamage(attack, attacker, defender) {
    // Formule des dégâts Pokémon officiels
    const baseDamage = (((2 * 50 / 5 + 2) * attack.power * attacker.stats.attack / defender.stats.defense) / 50) + 2;

    // STAB (Same Type Attack Bonus)
    let stab = attack.type === attacker.types[0] ? 1.5 : 1;

    // Faiblesses/résistances (simplifié)
    let typeEffectiveness = getTypeEffectiveness(attack.type, defender.types);

    // Calcul des dégâts finaux
    return Math.floor(baseDamage * stab * typeEffectiveness);
}

// Calcul de l'efficacité de l'attaque (types)
function getTypeEffectiveness(attackType, defenderTypes) {
    // Un tableau avec les correspondances de types (simplifié)
    const typeChart = {
        fire: { water: 0.5, grass: 2, fire: 0.5 },
        water: { fire: 2, electric: 0.5, grass: 0.5 },
        // Ajoute les autres types ici
    };

    let effectiveness = 1;
    defenderTypes.forEach(type => {
        if (typeChart[attackType] && typeChart[attackType][type]) {
            effectiveness *= typeChart[attackType][type];
        }
    });

    return effectiveness;
}

// Réduire les HP de l'adversaire
function reduceOpponentHP(damage) {
    const opponentHPBar = document.getElementById('opponent-hp');
    let currentHPWidth = parseInt(opponentHPBar.style.width);
    let newHPWidth = Math.max(currentHPWidth - damage, 0);
    opponentHPBar.style.width = `${newHPWidth}%`;

    if (newHPWidth === 0) {
        alert("L'adversaire est KO !");
    }
}

// Réduire les HP du joueur
function reducePlayerHP(damage) {
    const playerHPBar = document.getElementById('player-hp');
    let currentHPWidth = parseInt(playerHPBar.style.width);
    let newHPWidth = Math.max(currentHPWidth - damage, 0);
    playerHPBar.style.width = `${newHPWidth}%`;

    if (newHPWidth === 0) {
        alert("Ton Pokémon est KO !");
    }
}

// Fonction utilitaire pour capitaliser les noms de Pokémon
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
