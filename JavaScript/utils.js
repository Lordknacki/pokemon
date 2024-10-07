function getRandomMoves(moves, count) {
    if (!Array.isArray(moves) || moves.length === 0) {
        console.error("Erreur : Aucun mouvement disponible pour ce Pokémon.");
        return [{ name: "Charge", power: 40, accuracy: 100, type: "Normal", description: "Attaque basique." }];
    }

    const randomMoves = [];
    const availableMoves = moves
        .filter(move => move.move && move.move.url)
        .map(move => ({ name: move.move.name, url: move.move.url }));

    while (randomMoves.length < count && availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        randomMoves.push(availableMoves[randomIndex]);
        availableMoves.splice(randomIndex, 1);
    }

    // Compléter avec des mouvements par défaut si nécessaire
    while (randomMoves.length < count) {
        randomMoves.push({ name: "Charge", power: 40, accuracy: 100, type: "Normal", description: "Attaque basique." });
    }

    return randomMoves;
}
