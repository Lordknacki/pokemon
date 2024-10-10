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

const startBattleButton = document.querySelector('.start-game');
const tooltip = document.getElementById('tooltip');

// Fonction pour mettre à jour l'état du bouton
function updateStartButtonState() {
    if (selectedPokemon.length < 6) {
        startBattleButton.disabled = true;
        tooltip.classList.remove('hidden');
    } else {
        startBattleButton.disabled = false;
        tooltip.classList.add('hidden');
    }
}

// Événement pour afficher le tooltip si moins de 6 Pokémon sont sélectionnés
if (startBattleButton) {
    startBattleButton.addEventListener('mouseenter', (event) => {
        if (selectedPokemon.length < 6) {
            // Affiche le tooltip
            tooltip.style.opacity = '1';
            tooltip.classList.remove('hidden');

            // Positionne le tooltip au-dessus du bouton
            const rect = event.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        }
    });

    startBattleButton.addEventListener('mouseleave', () => {
        // Cache le tooltip
        tooltip.style.opacity = '0';
    });
}

// Assure de vérifier l'état du bouton au chargement et après chaque sélection de Pokémon
updateStartButtonState();

