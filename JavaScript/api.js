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

function getEmeraldSpriteUrl(id) {
    const formattedId = String(id).padStart(3, '0');
    const animatedUrl = `https://www.pokencyclopedia.info/sprites/gen3/ani_emerald/ani_e_${formattedId}.gif`;
    return animatedUrl;
}

async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();

        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const frenchName = speciesData.names.find(name => name.language.name === 'fr')?.name || pokemon.name;

        const types = await Promise.all(
            pokemon.types.map(async (type) => {
                const typeResponse = await fetch(type.type.url);
                const typeData = await typeResponse.json();
                const frenchTypeName = typeData.names.find(name => name.language.name === 'fr')?.name || type.type.name;
                return { type: frenchTypeName };
            })
        );

        // Récupérer le sprite animé et le sprite standard depuis la PokeAPI
        const animatedSprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
        const standardSprite = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        console.log(`Sprites pour le Pokémon ID ${id}:`, {
            name: frenchName,
            animatedSprite,
            standardSprite,
            types
        });

        const moves = getRandomMoves(pokemon.moves, 4);
        const baseHP = pokemon.stats[0].base_stat;
        const maxHP = calculateHP(baseHP);

        return {
            id: pokemon.id,
            name: frenchName,
            standardSprite: standardSprite || 'default-sprite.gif',
            animatedSprite: animatedSprite || 'default-sprite.gif',
            stats: pokemon.stats,
            maxHP,
            currentHP: maxHP,
            types,
            moves
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du Pokémon ID ${id}:`, error);
        return null;
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

async function getOpponentTeam() {
    const opponentTeam = [];
    const opponentTeamSize = 6; // Par exemple, 6 Pokémon pour l'équipe de l'adversaire

    // Récupérer les détails de chaque Pokémon pour l'équipe adverse
    for (let i = 0; i < opponentTeamSize; i++) {
        const randomId = Math.floor(Math.random() * 386) + 1; // Choisir un ID aléatoire parmi les 386 premiers Pokémon
        const opponentPokemon = await fetchPokemonDetails(randomId);
        
        if (opponentPokemon) {
            opponentTeam.push(opponentPokemon);
        }
    }

    return opponentTeam;
}


