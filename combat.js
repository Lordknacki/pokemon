<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pokémon Sélection et Combat</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <!-- Phase de sélection des Pokémon -->
    <section id="selection-phase">
        <header>
            <h1>Choisis ton Équipe Pokémon</h1>
        </header>
        <div id="team-container">
            <h2>Ton équipe Pokémon (Max 6) :</h2>
            <div id="team" class="team"></div>
        </div>
        <div id="pokemon-list" class="pokemon-list"></div>
        <button id="start-game" class="start-game" disabled>Commencer le Combat</button>

        <!-- Fenêtre modale pour les statistiques des Pokémon lors du survol -->
        <div id="stats-modal" class="hidden">
            <div class="pokemon-name"></div>
            <div class="pokemon-types"></div>
            <div class="pokemon-stats"></div>
        </div>
    </section>

    <!-- Phase de combat -->
    <section id="combat-phase" class="hidden">
        <header>
            <h1>Combat Pokémon</h1>
        </header>
        <div id="battlefield">
            <!-- Remplacement de l'image route-1.png par un lien fonctionnel -->
            <img id="terrain-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" alt="Terrain de combat">
            
            <!-- Dresseur adverse avec sprite fonctionnel -->
            <div id="opponent-trainer">
                <img id="trainer-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png" alt="Dresseur">
                <h2 id="trainer-name">Dresseur</h2>
            </div>

            <!-- Pokémon du joueur -->
            <div id="player-pokemon" class="pokemon-side">
                <img id="player-pokemon-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pokémon du Joueur" class="pokemon-sprite">
                <div class="pokemon-info">
                    <span id="player-pokemon-name" class="pokemon-name-level">Pikachu Lv. 50</span>
                    <div class="hp-bar-container">
                        <div id="player-hp" class="hp-bar hp-green" style="width: 100%;"></div>
                    </div>
                </div>
            </div>

            <!-- Pokémon adversaire -->
            <div id="opponent-pokemon" class="pokemon-side">
                <img id="opponent-pokemon-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" alt="Pokémon Adverse" class="pokemon-sprite">
                <div class="pokemon-info">
                    <span id="opponent-pokemon-name" class="pokemon-name-level">Dracaufeu Lv. 55</span>
                    <div class="hp-bar-container">
                        <div id="opponent-hp" class="hp-bar hp-green" style="width: 100%;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Menu de combat -->
        <div id="combat-menu">
            <div id="combat-options">
                <button id="attack-button">Combattre</button>
                <button id="pokemon-button">Pokémon</button>
                <button id="bag-button">Sac</button>
                <button id="run-button">Fuir</button>
            </div>
            <!-- Menu des attaques -->
            <div id="attack-menu" class="hidden">
                <h3>Choisissez une attaque :</h3>
                <div id="attack-options"></div>
            </div>

            <!-- Menu de changement de Pokémon -->
            <div id="pokemon-menu" class="hidden">
                <h3>Choisissez un Pokémon à envoyer au combat :</h3>
                <div id="pokemon-change-options"></div>
            </div>
        </div>
    </section>

    <!-- Écran de Game Over -->
    <section id="game-over-screen" class="hidden">
        <h1>Game Over</h1>
        <img src="https://i.imgur.com/V7bO6Gc.png" alt="Game Over">
        <p>Tu as perdu le combat.</p>
        <button id="retry-button">Revenir à la sélection</button>
    </section>

    <!-- Animation de Victoire -->
    <section id="victory-animation" class="hidden">
        <h1>Félicitations, tu as remporté la Ligue Pokémon !</h1>
        <img id="victory-animation-image" src="https://c.tenor.com/ze30msnkRfMAAAAC/pokemon-victory.gif" alt="Victoire Ligue Pokémon">
        <button id="victory-restart-button">Rejouer</button>
    </section>

    <!-- Appel des scripts externes -->
    <script src="selection.js"></script>
    <script src="combat.js"></script>

</body>
</html>
