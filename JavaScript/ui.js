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

    playerSprite.src = playerPokemon.standardSprite;
    opponentSprite.src = opponentPokemon.standardSprite;

    document.getElementById('player-pokemon-name').textContent = playerPokemon.name;
    document.getElementById('opponent-pokemon-name').textContent = opponentPokemon.name;

    updateHPBar(playerPokemon, playerPokemon.currentHP, playerPokemon.maxHP, 'player-hp', 'player-hp-text');
    updateHPBar(opponentPokemon, opponentPokemon.currentHP, opponentPokemon.maxHP, 'opponent-hp', 'opponent-hp-text');

    // Afficher les attaques du joueur
    displayMoves(playerPokemon.moves);
}

function updateHPBar(pokemon, currentHP, maxHP, hpBarId, hpTextId) {
    const hpBar = document.getElementById(hpBarId);
    const hpText = document.getElementById(hpTextId);

    // Calcul du pourcentage de PV restants
    const hpPercentage = (currentHP / maxHP) * 100;

    // Mise à jour de la largeur de la barre en fonction du pourcentage
    hpBar.style.width = `${hpPercentage}%`;

    // Changement de couleur selon le pourcentage de PV (vert, jaune, rouge)
    if (hpPercentage > 50) {
        hpBar.style.background = 'linear-gradient(to bottom, #76c7c0, #4caf50)'; // Vert dégradé
    } else if (hpPercentage > 20) {
        hpBar.style.background = 'linear-gradient(to bottom, #f7e987, #ffeb3b)'; // Jaune dégradé
    } else {
        hpBar.style.background = 'linear-gradient(to bottom, #f77b7b, #f44336)'; // Rouge dégradé
    }

    // Mise à jour du texte des PV
    hpText.textContent = `${currentHP}/${maxHP}`;
}

// Fonction pour mettre à jour l'état du bouton
function updateStartButtonState() {
    if (selectedPokemon.length < 6) {
        startBattleButton.disabled = true;
        startBattleButton.classList.add('tooltip-trigger');
    } else {
        startBattleButton.disabled = false;
        tooltip.classList.add('hidden');
        startBattleButton.classList.remove('tooltip-trigger');
    }
}









