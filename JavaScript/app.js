document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    selectedPokemon = []; // Initialiser la variable avant toute utilisation
    toggleStartButton();
});

let playerTeam = []; // Tableau contenant les Pokémon du joueur (jusqu'à 6)
let opponentTeam = []; // Tableau contenant les Pokémon de l'adversaire (jusqu'à 6)
let playerPokemonIndex = 0; // Index du Pokémon actuel du joueur
let opponentPokemonIndex = 0; // Index du Pokémon actuel de l'adversaire
let selectedPokemon = []; // Tableau pour stocker les Pokémon sélectionnés par le joueur

document.getElementById('start-game').addEventListener('click', async () => {
    if (selectedPokemon.length === 6) {
        try {
            // Convertit les Pokémon sélectionnés en équipe du joueur
            const playerTeamArray = selectedPokemon.map(pokemon => ({
                ...pokemon, // Copie toutes les données du Pokémon
                animatedSprite: getEmeraldSpriteUrl(pokemon.id) // Ajoute l'URL du sprite animé
            }));

            // Démarre le combat avec l'équipe du joueur
            await startBattle(playerTeamArray);
        } catch (error) {
            console.error("Erreur lors de la conversion des Pokémon sélectionnés :", error);
        }
    } else {
        alert("Tu dois sélectionner 6 Pokémon pour commencer le combat !");
    }
});


function toggleStartButton() {
    const startButton = document.getElementById('start-game');
    
    if (selectedPokemon.length === 0) {
        startButton.textContent = 'Sélectionne tes Pokémon 0/6';
    } else if (selectedPokemon.length < 6) {
        startButton.textContent = `Sélectionne tes Pokémon ${selectedPokemon.length}/6`;
    } else {
        startButton.textContent = 'Commencer le Combat';
    }

    startButton.disabled = selectedPokemon.length !== 6;
}

