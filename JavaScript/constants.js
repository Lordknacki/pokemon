const typeChart = {
    fire: { water: 0.5, grass: 2, fire: 0.5, rock: 0.5 },
    water: { fire: 2, grass: 0.5, electric: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5 },
    // More types...
};

function calculateHP(baseHP) {
    const level = 100;
    const iv = 31; // Max IV
    const ev = 252; // Max EV
    const hp = Math.floor(((2 * baseHP + iv + Math.floor(ev / 4)) * level / 100) + level + 10);
    return hp;
}

function getTypeEffectiveness(moveType, defenderTypes) {
    let effectiveness = 1;
    defenderTypes.forEach(type => {
        effectiveness *= typeChart[moveType][type] || 1;
    });
    return effectiveness;
}
