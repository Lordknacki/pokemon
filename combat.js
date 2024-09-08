document.addEventListener('DOMContentLoaded', () => {
    let playerHp = 100; // Santé du Pokémon du joueur
    let opponentHp = 100; // Santé du Pokémon adverse

    // Initialisation du combat (appelée depuis la phase de sélection)
    function initCombat() {
        console.log("Le combat commence !");
        // Démarrage du combat avec les sprites et noms de l'équipe
        updateHpBar('player', playerHp);
        updateHpBar('opponent', opponentHp);
    }

    // Fonction d'attaque
    function attack(damage) {
        opponentHp = Math.max(0, opponentHp - damage); // Réduire les PV de l'adversaire
        updateHpBar('opponent', opponentHp);

        if (opponentHp === 0) {
            alert('L\'adversaire est K.O. !');
        }
    }

    // Fonction pour mettre à jour la barre de santé
    function updateHpBar(side, hp) {
        const hpBar = document.querySelector(`#${side}-hp .hp-bar`);
        const hpPercentage = (hp / 100) * 100;

        hpBar.style.width = `${hpPercentage}%`;

        if (hpPercentage > 50) {
            hpBar.classList.remove('hp-orange', 'hp-red');
            hpBar.classList.add('hp-green');
        } else if (hpPercentage > 20) {
            hpBar.classList.remove('hp-green', 'hp-red');
            hpBar.classList.add('hp-orange');
        } else {
            hpBar.classList.remove('hp-green', 'hp-orange');
            hpBar.classList.add('hp-red');
        }
    }

    // Attaquer lors du clic sur le bouton de combat
    document.getElementById('attack-button').addEventListener('click', () => {
        const damage = Math.floor(Math.random() * 20) + 5; // Dégâts aléatoires entre 5 et 25
        attack(damage);
    });
});
