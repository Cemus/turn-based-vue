export interface Player {
  id: number
  ws: WebSocket
  ready: boolean
  hp: number
}

export interface GameState {
  id: number
  players: Player[]
  player: Player
  turn: number
}
