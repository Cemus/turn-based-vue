const handleConnexion = (ws, gameState) => {
  // FULL
  if (gameState.players.length >= 2) {
    ws.send(JSON.stringify({ type: "error", message: "Partie complète !" }));
    ws.close();
    return;
  }

  const playerId = gameState.players.length + 1;
  gameState.players.push({ ws, playerId, ready: false });
  console.log(`Joueur ${playerId} connecté.`);

  ws.send(JSON.stringify({ type: "connected", playerId }));
};

const handleStart = (ws, gameState) => {
  const player = gameState.players.find((p) => p.playerId === data.playerId);
  console.log(player);

  if (player) {
    console.log("player : ", player);
    player.ready = true;
    console.log(`Joueur ${data.playerId} est prêt`);
    // Vérifier si les deux joueurs sont prêts
    if (
      gameState.players.length === 2 &&
      gameState.players[0].ready &&
      gameState.players[1].ready
    ) {
      broadcast({
        type: "gameStart",
        message: "Les deux joueurs sont prêts. Le jeu commence !",
      });
    }
  }
};

function broadcast(data, ws) {
  console.log("gameState.players", gameState.players);
  console.log("DATA", data);
  gameState.players.forEach((player) => player.ws.send(JSON.stringify(data)));
}

// Listen
ws.on("message", (message) => {
  const data = JSON.parse(message);
  if (data.type === "status" && data.action === "ready") {
    ready(gameState);
  }

  if (data.type === "action") {
    if (gameState.turn !== playerId) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Ce n'est pas votre tour !",
        })
      );
      return;
    }

    // Actions
    if (data.action === "attack") {
      const target = gameState.turn === 1 ? "player2" : "player1";
      gameState[target].health -= Math.floor(Math.random() * 20) + 10;
    } else if (data.action === "heal") {
      const currentPlayer = gameState.turn === 1 ? "player1" : "player2";
      gameState[currentPlayer].health += Math.floor(Math.random() * 15) + 5;
    }

    if (gameState.player1.health <= 0 || gameState.player2.health <= 0) {
      const winner = gameState.player1.health > 0 ? "Player 1" : "Player 2";
      broadcast({ type: "gameOver", winner });
      resetGame();
      return;
    }

    gameState.turn = gameState.turn === 1 ? 2 : 1;

    // Envoi le state
    broadcast({ type: "update", gameState: gameState });
  }
});

module.exports = { handleStart, handleConnexion, broadcast };
