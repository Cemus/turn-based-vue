import WebSocket, { WebSocket as WsType } from 'ws'
import { createServer } from 'http'
import express, { Request, Response } from 'express'
import { resetIds } from './src/utils/IdManager'
import Player from './src/entities/Player'

/* SERVEUR */
const app = express()
const server = createServer(app)

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Serveur WebSocket en ligne</h1>')
})

const wss = new WebSocket.Server({ server })

interface Message {
  type: string
  playerId?: number
  action?: string
  value?: boolean
  gameState?: GameState
  winner?: number
  playerName?: string
}

interface GameState {
  players: Player[]
  turn: number
}

const gameState: GameState = {
  players: [],
  turn: -1,
}

wss.on('connection', (ws: WsType) => {
  if (gameState.players.length >= 2) {
    ws.send(JSON.stringify({ type: 'error', message: 'Partie complète !' }))
    ws.close()
    return
  }

  ws.on('message', (message: string) => {
    const data: Message = JSON.parse(message)

    if (data.type === 'setName') {
      try {
        const username = data.action

        console.log(typeof username)
        console.log(data)
        if (typeof username === 'string') {
          const player = new Player(username, ws)
          const playerId = player.id
          gameState.players.push(player)
          console.log(`Joueur ${playerId} (${username}) connecté.`)
          ws.send(JSON.stringify({ type: 'connected', playerId: playerId, gameState: gameState }))
        } else {
          throw new Error('Mauvais type de donnée ?')
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (data.type === 'ready') {
      const player = gameState.players.find((p) => p.id === data.playerId)
      if (player) {
        player.toggleReadiness()
        const isPlayerReady = player?.getReadiness()
        player.getWs().send(JSON.stringify({ type: 'toggleReady', value: isPlayerReady }))
        console.log(
          `Joueur ${data.playerId} est ${player.getReadiness() ? 'prêt' : "loin d'être prêt"}`,
        )

        if (
          gameState.players.length === 2 &&
          gameState.players[0].getReadiness() &&
          gameState.players[1].getReadiness()
        ) {
          broadcast({
            type: 'setBothReady',
            value: true,
            gameState: {
              ...gameState,
              turn: Math.floor(Math.random() * gameState.players.length),
            },
          })
          console.log(gameState)
        }
      }
    }

    if (data.type === 'action') {
      const player = gameState.players.find((p) => p.id === data.playerId)
      if (player) {
        if (gameState.turn !== player.id) {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: "Ce n'est pas votre tour !",
            }),
          )
          return
        }

        if (data.action === 'attack') {
          const target = gameState.players.find((p) => p.id !== player.id)
          if (target) {
            target.stats.hp -= Math.floor(Math.random() * 20) + 10
          }
        } else if (data.action === 'heal') {
          player.stats.hp += Math.floor(Math.random() * 15) + 5
        }

        if (gameState.players[0].stats.hp <= 0 || gameState.players[1].stats.hp <= 0) {
          const winner =
            gameState.players[0].stats.hp > 0 ? gameState.players[0].id : gameState.players[1].id
          broadcast({ type: 'gameOver', winner })
          resetGame()
          return
        }

        gameState.turn =
          gameState.turn + 1 <= gameState.players.length ? gameState.turn++ : (gameState.turn = 0)

        broadcast({ type: 'update', gameState: gameState })
      }
    }
  })

  ws.on('close', () => {
    const index = gameState.players.findIndex((p) => p.getWs() === ws)
    if (index !== -1) {
      console.log(
        `Joueur ${gameState.players[index].id} (${gameState.players[index].name}) déconnecté.`,
      )

      broadcast({
        type: 'playerDisconnected',
        playerId: gameState.players[index].id,
      })
      gameState.players.splice(index, 1)
    }
    resetGame()
  })
})

function broadcast(data: Message) {
  console.log('gameState.players', gameState.players)
  gameState.players.forEach((player) => player.getWs().send(JSON.stringify(data)))
}

function resetGame() {
  gameState.players = []
  gameState.turn = -1
  resetIds()
}

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Serveur WebSocket en ligne sur le port ${port}`)
})

module.exports = { wss }
