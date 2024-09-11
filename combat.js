class Pokemon {
    constructor(name, type, hp, level, moves) {
        this.name = name;
        this.type = type;
        this.hp = hp;
        this.maxHp = hp;
        this.level = level;
        this.moves = moves; // Ceci est un tableau d'objets représentant les attaques
    }
}

class Move {
    constructor(name, type, power, accuracy) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.accuracy = accuracy; // Probabilité que l'attaque réussisse, de 0 à 100
    }
}

function getSelectedPokemon() {
    const selectedPokemonElements = document.querySelectorAll('.pokemon-card.selected');
    const selectedPokemon = Array.from(selectedPokemonElements).map(pokemonElement => {
        return {
            name: pokemonElement.getAttribute('data-name'),
            imageUrl: pokemonElement.querySelector('img').src
        };
    });

    return selectedPokemon;
}

function displaySelectedPokemon() {
    const selectedPokemon = getSelectedPokemon();
    const displayArea = document.getElementById('selected-pokemon-display'); // Assure-toi que cet élément existe dans ton HTML

    // Nettoyer l'affichage précédent
    displayArea.innerHTML = '';

    selectedPokemon.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-info');
        pokemonDiv.innerHTML = `
            <img src="${pokemon.imageUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;
        displayArea.appendChild(pokemonDiv);
    });
}

// Création de quelques mouvements
let flamethrower = new Move("Flamethrower", "fire", 90, 100);
let hydroPump = new Move("Hydro Pump", "water", 110, 80);
let vineWhip = new Move("Vine Whip", "grass", 45, 100);

// Création de quelques Pokémon
let charizard = new Pokemon("Charizard", "fire", 360, 50, [flamethrower]);
let blastoise = new Pokemon("Blastoise", "water", 362, 50, [hydroPump]);
let venusaur = new Pokemon("Venusaur", "grass", 364, 50, [vineWhip]);

function executeMove(attacker, defender, move) {
    console.log(`${attacker.name} utilise ${move.name}!`);

    // Vérifier si l'attaque réussit
    if (Math.random() * 100 > move.accuracy) {
        console.log(`${attacker.name} rate son attaque.`);
        return;
    }

    // Calculer les dégâts
    let damage = move.power;
    console.log(`${defender.name} subit ${damage} points de dégâts.`);
    defender.hp -= damage;

    if (defender.hp <= 0) {
        defender.hp = 0;
        console.log(`${defender.name} est hors combat!`);
    } else {
        console.log(`${defender.name} a maintenant ${defender.hp} HP restants.`);
    }
}

executeMove(charizard, blastoise, flamethrower);
