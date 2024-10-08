async function buildPokemonObject(pokemon, name) {
    const types = await getTypesInFrench(pokemon);
    const sprite = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    const randomMoves = getRandomMoves(pokemon.moves, 4);
    const baseHP = pokemon.stats[0].base_stat;
    const maxHP = calculateHP(baseHP);

    console.log(`Mouvements pour ${name}:`, randomMoves); // Ajoute ce log pour vérifier les mouvements
    console.log(`Statistiques pour ${name}:`, pokemon.stats); // Ajoute ce log pour vérifier les statistiques

    return {
        id: pokemon.id,
        name,
        sprite,
        stats: pokemon.stats,
        maxHP,
        currentHP: maxHP,
        types: types,
        moves: randomMoves // S'assurer que `moves` est bien défini ici
    };
}


async function getTypesInFrench(pokemon) {
    const typesPromises = pokemon.types.map(async (type) => {
        const typeResponse = await fetch(type.type.url);
        const typeData = await typeResponse.json();
        const frenchTypeName = typeData.names.find(name => name.language.name === 'fr').name;
        return { type: frenchTypeName };
    });

    return await Promise.all(typesPromises);
}

async function getTypesInFrench(pokemon) {
    const typesPromises = pokemon.types.map(async (type) => {
        const typeResponse = await fetch(type.type.url);
        const typeData = await typeResponse.json();
        const frenchTypeName = typeData.names.find(name => name.language.name === 'fr').name;
        return { type: frenchTypeName };
    });

    return await Promise.all(typesPromises);
}

function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.setAttribute('data-id', pokemon.id);
    const pokemonImage = pokemon.standardSprite; // Utilise le sprite standard ici
    card.innerHTML = `
        <img src="${pokemonImage}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    `;

    card.addEventListener('mouseenter', () => showPokemonStats(pokemon, card));
    card.addEventListener('mouseleave', () => hidePokemonStats());
    card.addEventListener('click', () => togglePokemonSelection(pokemon, card));

    return card;
}


function renderAllPokemonCards(pokemonList) {
    const container = document.getElementById("pokemon-list");
    pokemonList.forEach(pokemon => {
        if (pokemon) {
            container.appendChild(createPokemonCard(pokemon));
        }
    });
}

function togglePokemonSelection(pokemon, element) {
    const isSelected = selectedPokemon.find(p => p.id === pokemon.id);

    if (isSelected) {
        // Supprime le Pokémon de la sélection
        selectedPokemon = selectedPokemon.filter(p => p.id !== pokemon.id);
        document.querySelectorAll(`[data-id="${pokemon.id}"]`).forEach(el => el.classList.remove('selected'));
    } else if (selectedPokemon.length < 6) {
        // Ajoute le Pokémon à la sélection si le nombre est inférieur à 6
        selectedPokemon.push(pokemon);
        document.querySelectorAll(`[data-id="${pokemon.id}"]`).forEach(el => el.classList.add('selected'));
    }

    updateTeamDisplay();
    toggleStartButton();
}




function updateTeamDisplay() {
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = ''; // Efface le contenu actuel pour le réinitialiser

    selectedPokemon.forEach(pokemon => {
        // Crée un élément d'image pour chaque Pokémon sélectionné
        const img = document.createElement('img');
        img.src = pokemon.standardSprite; // Utilise le sprite standard pour l'affichage dans l'équipe
        img.alt = pokemon.name;
        img.classList.add('team-pokemon', 'selected');
        img.setAttribute('data-id', pokemon.id);

        // Ajoute un événement de clic pour permettre de désélectionner un Pokémon
        img.addEventListener('click', () => togglePokemonSelection(pokemon, img));

        // Ajoute l'image au conteneur de l'équipe
        teamContainer.appendChild(img);
    });
}


