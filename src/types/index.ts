export interface Player {
  id: number
  name: string
  ws: WebSocket
  ready: boolean
  stats: Stats
}

export interface GameState {
  players: Player[]
  turn: number
}

interface Stats {
  hp: number
  atk: number
  def: number
  mag: number
}
