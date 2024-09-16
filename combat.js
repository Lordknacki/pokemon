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

function displaySelectedPokemon() {
    const selectedPokemonElements = document.querySelectorAll('.pokemon-card.selected');
    const displayArea = document.getElementById('selected-pokemon-display'); // Assure-toi que cet élément existe dans ton HTML

    // Nettoyer l'affichage précédent
    displayArea.innerHTML = '';

    selectedPokemon.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-info');

        // Créer le lien et l'image avec les données correctes du Pokémon
        const pokemonNameLower = pokemon.name.toLowerCase().replace(' ', ''); // Assure que le nom est bien formaté pour l'URL
        const pokemonImageURL = `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemonNameLower}.gif`;
        const pokemonPageURL = `https://pokemondb.net/pokedex/${pokemonNameLower}`;

        pokemonDiv.innerHTML = `
            <a href="${pokemonPageURL}">
                <img src="${pokemonImageURL}" alt="${pokemon.name}">
            </a>
            <h3>${pokemon.name}</h3>
        `;
        displayArea.appendChild(pokemonDiv);
    });
}

function displaySelectedPokemon() {
    const selectedPokemonElements = document.querySelectorAll('.pokemon-card.selected');
    const displayArea = document.getElementById('selected-pokemon-display'); // Assure-toi que cet élément existe dans ton HTML

    // Nettoyer l'affichage précédent
    displayArea.innerHTML = '';

    // Utiliser les ID pour récupérer et afficher des informations spécifiques pour chaque Pokémon
    selectedPokemonElements.forEach(element => {
        const pokemonId = element.getAttribute('data-id');  // Récupérer l'ID stocké dans un attribut data
        const pokemonName = element.getAttribute('data-name');  // Récupérer le nom pour l'affichage
        const pokemonNameLower = pokemonName.toLowerCase().replace(/\s+/g, ''); // Nettoyer le nom pour l'URL

        const pokemonImageURL = `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemonNameLower}.gif`;
        const pokemonPageURL = `https://pokemondb.net/pokedex/${pokemonNameLower}`;

        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-info');
        pokemonDiv.innerHTML = `
            <a href="${pokemonPageURL}" target="_blank">
                <img src="${pokemonImageURL}" alt="${pokemonName}">
            </a>
            <h3>${pokemonName}</h3>
        `;
        displayArea.appendChild(pokemonDiv);
    });
}

function updatePokemonSprite(pokemonId) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${pokemonId}.gif`;
  document.getElementById('player-pokemon-sprite').src = spriteUrl;
}

document.getElementById('player-pokemon-sprite').onerror = function() {
  console.log("Erreur de chargement du sprite du Pokémon.");
  this.src = 'chemin/vers/une/image/par/défaut.png'; // Fournis une image de remplacement
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
