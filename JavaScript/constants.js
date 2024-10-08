function calculateHP(baseHP) {

    if (baseHP === 1) {
    return 1; // Munja a toujours 1 PV
    }
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


function getEffectiveness(moveType, defenderTypes) {
    const typeChart = {
        normal: { roche: 0.5, spectre: 0, acier: 0.5 },
        feu: { feu: 0.5, eau: 0.5, plante: 2, glace: 2, insecte: 2, roche: 0.5, dragon: 0.5, acier: 2 },
        eau: { feu: 2, eau: 0.5, plante: 0.5, sol: 2, roche: 2, dragon: 0.5 },
        électrique: { eau: 2, électrique: 0.5, plante: 0.5, sol: 0, vol: 2, dragon: 0.5 },
        plante: { feu: 0.5, eau: 2, plante: 0.5, poison: 0.5, sol: 2, vol: 0.5, insecte: 0.5, roche: 2, dragon: 0.5, acier: 0.5 },
        glace: { feu: 0.5, eau: 0.5, plante: 2, glace: 0.5, sol: 2, vol: 2, dragon: 2, acier: 0.5 },
        combat: { normal: 2, glace: 2, roche: 2, ténèbres: 2, acier: 2, poison: 0.5, vol: 0.5, psy: 0.5, insecte: 0.5, spectre: 0, fée: 0.5 },
        poison: { plante: 2, poison: 0.5, sol: 0.5, roche: 0.5, spectre: 0.5, acier: 0, fée: 2 },
        sol: { feu: 2, électrique: 2, plante: 0.5, poison: 2, vol: 0, insecte: 0.5, roche: 2, acier: 2 },
        vol: { électrique: 0.5, plante: 2, combat: 2, insecte: 2, roche: 0.5, acier: 0.5 },
        psy: { combat: 2, poison: 2, psy: 0.5, ténèbres: 0, acier: 0.5 },
        insecte: { feu: 0.5, plante: 2, combat: 0.5, poison: 0.5, vol: 0.5, psy: 2, spectre: 0.5, ténèbres: 2, acier: 0.5, fée: 0.5 },
        roche: { feu: 2, glace: 2, combat: 0.5, sol: 0.5, vol: 2, insecte: 2, acier: 0.5 },
        spectre: { normal: 0, psy: 2, spectre: 2, ténèbres: 0.5 },
        dragon: { dragon: 2, acier: 0.5, fée: 0 },
        ténèbres: { combat: 0.5, psy: 2, spectre: 2, ténèbres: 0.5, fée: 0.5 },
        acier: { feu: 0.5, eau: 0.5, électrique: 0.5, glace: 2, roche: 2, acier: 0.5, fée: 2 },
        fée: { feu: 0.5, combat: 2, poison: 0.5, dragon: 2, ténèbres: 2, acier: 0.5 }
    };

    // Calcul de l'efficacité de l'attaque en fonction des types défensifs
    let effectiveness = 1;
    defenderTypes.forEach(type => {
        const defenderType = type.type.toLowerCase();
        effectiveness *= typeChart[moveType]?.[defenderType] || 1;
    });
    return effectiveness;
}
