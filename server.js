const WebSocket = require('ws')
const express = require('express')

// Serveur Glitch
const app = express()
const server = require('http').createServer(app)

app.get('/', (req, res) => {
  res.send('<h1>Serveur WebSocket en ligne</h1>')
})

const wss = new WebSocket.Server({ server })

// État du jeu
let players = []
let gameState = {
  player1: { health: 100, ready: false },
  player2: { health: 100, ready: false },
  turn: 1, // Tour du joueur : 1 ou 2
}

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: 'error', message: 'Partie complète !' }))
    ws.close()
    return
  }

  // Ajouter un nouveau joueur
  const playerId = players.length + 1
  players.push(ws)
  console.log(`Joueur ${playerId} connecté.`)

  ws.send(JSON.stringify({ type: 'connected', playerId }))

  // Listen
  ws.on('message', (message) => {
    const data = JSON.parse(message)

    if (data.type === 'action') {
      if (gameState.turn !== playerId) {
        ws.send(JSON.stringify({ type: 'error', message: "Ce n'est pas votre tour !" }))
        return
      }

      // Actions
      if (data.action === 'attack') {
        const target = gameState.turn === 1 ? 'player2' : 'player1'
        gameState[target].health -= Math.floor(Math.random() * 20) + 10
      } else if (data.action === 'heal') {
        const currentPlayer = gameState.turn === 1 ? 'player1' : 'player2'
        gameState[currentPlayer].health += Math.floor(Math.random() * 15) + 5
      }

      if (gameState.player1.health <= 0 || gameState.player2.health <= 0) {
        const winner = gameState.player1.health > 0 ? 'Player 1' : 'Player 2'
        broadcast({ type: 'gameOver', winner })
        resetGame()
        return
      }

      gameState.turn = gameState.turn === 1 ? 2 : 1

      // Envoi le state
      broadcast({ type: 'update', gameState })
    }
  })

  // Déco
  ws.on('close', () => {
    console.log(`Joueur ${playerId} déconnecté.`)
    resetGame()
  })
})

// Message à tous
function broadcast(data) {
  players.forEach((player) => player.send(JSON.stringify(data)))
}

function resetGame() {
  players = []
  gameState = {
    player1: { health: 100, ready: false },
    player2: { health: 100, ready: false },
    turn: 1,
  }
}

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Serveur WebSocket en ligne sur le port ${port}`)
})
