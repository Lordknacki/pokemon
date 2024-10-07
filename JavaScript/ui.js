document.getElementById('pokemon-search').addEventListener('input', function(e) {
    const searchQuery = e.target.value.toLowerCase();
    const pokemonCards = document.querySelectorAll('#pokemon-list .pokemon-card');
    let found = false;

    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('h3').textContent.toLowerCase();
        if (pokemonName.includes(searchQuery)) {
            card.style.display = ''; // Afficher la carte si elle correspond à la requête
            found = true;
        } else {
            card.style.display = 'none'; // Masquer la carte sinon
        }
    });

    const noResultMsg = document.getElementById('no-result-msg');
    if (!found && searchQuery !== '') {
        noResultMsg.style.display = 'block';
    } else {
        noResultMsg.style.display = 'none';
    }
});

function showPokemonStats(pokemon, card) {
    const statsModal = document.getElementById("stats-modal");

    const types = pokemon.types || [];
    const typesHtml = Array.isArray(types)
        ? types.map(type => `<span class="pokemon-type type-${type.type.toLowerCase()}">${type.type}</span>`).join(' ')
        : '';

    statsModal.innerHTML = `
        <div class="pokemon-name">${pokemon.name}</div>
        <div class="pokemon-types">${typesHtml}</div>
        <div class="pokemon-stats">
            <p>HP: ${pokemon.stats[0].base_stat}</p>
            <p>Attaque: ${pokemon.stats[1].base_stat}</p>
            <p>Défense: ${pokemon.stats[2].base_stat}</p>
            <p>Attaque Spéciale: ${pokemon.stats[3].base_stat}</p>
            <p>Défense Spéciale: ${pokemon.stats[4].base_stat}</p>
            <p>Vitesse: ${pokemon.stats[5].base_stat}</p>
        </div>
    `;

    statsModal.classList.add("show");

    const rect = card.getBoundingClientRect();
    const topPosition = window.scrollY + rect.top - statsModal.offsetHeight - 15;
    let leftPosition = rect.left + (rect.width / 2) - (statsModal.offsetWidth / 2);

    if (leftPosition + statsModal.offsetWidth > window.innerWidth) {
        leftPosition = window.innerWidth - statsModal.offsetWidth - 30;
    }
    if (leftPosition < 0) {
        leftPosition = 30;
    }

    statsModal.style.top = `${Math.max(10, topPosition)}px`;
    statsModal.style.left = `${leftPosition}px`;
}

function hidePokemonStats() {
    const statsModal = document.getElementById("stats-modal");
    statsModal.classList.remove("show");
}


function positionStatsModal(modal, card) {
    const rect = card.getBoundingClientRect();
    modal.style.top = `${window.scrollY + rect.top - modal.offsetHeight - 15}px`;
    modal.style.left = `${rect.left}px`;
}

function updateHPBar(pokemon, currentHP, maxHP, barId, textId) {
    const hpBar = document.getElementById(barId);
    const hpText = document.getElementById(textId);
    const percentage = (currentHP / maxHP) * 100;
    hpBar.style.width = `${percentage}%`;
    hpText.textContent = `${currentHP} / ${maxHP}`;
}

function displayPokemonOnBattlefield(playerPokemon, opponentPokemon) {
    const playerSprite = document.getElementById('player-pokemon-sprite');
    const opponentSprite = document.getElementById('opponent-pokemon-sprite');

    // Met à jour les sprites des Pokémon
    playerSprite.src = playerPokemon.sprite;
    opponentSprite.src = opponentPokemon.sprite;

    document.getElementById('player-pokemon-name').textContent = playerPokemon.name;
    document.getElementById('opponent-pokemon-name').textContent = opponentPokemon.name;

    // Initialise les barres de vie
    updateHPBar(playerPokemon, playerPokemon.currentHP, playerPokemon.maxHP, 'player-hp', 'player-hp-text');
    updateHPBar(opponentPokemon, opponentPokemon.currentHP, opponentPokemon.maxHP, 'opponent-hp', 'opponent-hp-text');

    // Affiche le menu des attaques pour le joueur
    displayMoves(playerPokemon.moves);

    // Rend visible le menu des attaques
    document.getElementById('attack-menu').classList.remove('hidden');
}
