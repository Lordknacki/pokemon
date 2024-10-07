async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386');
        const data = await response.json();
        const pokemonList = data.results;

        const pokemonDetailsPromises = pokemonList.map(pokemon => {
            const id = pokemon.url.split("/").filter(Boolean).pop();
            return fetchPokemonDetails(parseInt(id));
        });

        allPokemonData = await Promise.all(pokemonDetailsPromises);
        renderAllPokemonCards(allPokemonData);
    } catch (error) {
        console.error("Erreur lors de la récupération des données Pokémon:", error);
    }
}

async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();

        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const frenchName = speciesData.names.find(name => name.language.name === 'fr').name;

        const typesPromises = pokemon.types.map(async (type) => {
            const typeResponse = await fetch(type.type.url);
            const typeData = await typeResponse.json();
            const frenchTypeName = typeData.names.find(name => name.language.name === 'fr').name;
            return { type: frenchTypeName };
        });

        const types = await Promise.all(typesPromises);
        const pokemonSprite = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        const moves = getRandomMoves(pokemon.moves, 4); // S'assurer que getRandomMoves est défini avant cet appel

        const baseHP = pokemon.stats[0].base_stat;
        const maxHP = calculateHP(baseHP);

        console.log("Détails du Pokémon récupérés :", {
            id: pokemon.id,
            name: frenchName,
            sprite: pokemonSprite,
            stats: pokemon.stats,
            maxHP: maxHP,
            currentHP: maxHP,
            types: types,
            moves: moves
        });

        return {
            id: pokemon.id,
            name: frenchName,
            sprite: pokemonSprite,
            stats: pokemon.stats,
            maxHP: maxHP,
            currentHP: maxHP,
            types: types,
            moves: moves
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du Pokémon ID ${id}:`, error);
        return null; // Retourne null pour éviter les erreurs en aval si le Pokémon n'est pas récupéré
    }
}



async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 386) + 1;
    const opponent = await fetchPokemonDetails(randomId);
    if (!opponent || !opponent.stats) {
        console.error("Erreur lors de la récupération des détails du Pokémon adverse :", opponent);
        return null; // Retourne `null` si le Pokémon n'a pas été récupéré correctement
    }
    return opponent;
}

