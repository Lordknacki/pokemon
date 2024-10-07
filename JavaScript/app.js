document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonData();
    toggleStartButton();
});

let selectedPokemon = [];
let playerPokemon;
let selectedOpponent;

document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    if (selectedPokemon.length === 6) {
        playerPokemon = selectedPokemon[0];
        startBattle(playerPokemon);
    } else {
        alert("Tu dois sélectionner 6 Pokémon pour commencer le combat !");
    }
}

function toggleStartButton() {
    const startButton = document.getElementById('start-game');
    startButton.disabled = selectedPokemon.length !== 6;
    startButton.textContent = selectedPokemon.length === 6 ? 'Commencer le Combat' : `Sélectionne tes Pokémon ${selectedPokemon.length}/6`;
}
