import { WebSocket as WsType } from 'ws'
import { getNewId } from '../utils/IdManager'

export default class Player {
  id: number
  name: string | null
  connection: Connection
  stats: Stats

  constructor(name: string | null, ws: WsType) {
    this.id = getNewId()
    this.name = name
    this.connection = new Connection(ws)
    this.stats = new Stats()
  }

  getReadiness() {
    return this.connection.getReadiness()
  }

  getWs() {
    return this.connection.getWs()
  }

  getStats() {
    return this.stats.getStats()
  }

  toggleReadiness() {
    this.connection.toggleReadiness()
  }
}

class Connection {
  ws: WsType
  isReady: boolean

  constructor(ws: WsType) {
    this.ws = ws
    this.isReady = false
  }

  getWs() {
    return this.ws
  }

  getReadiness() {
    return this.isReady
  }

  toggleReadiness() {
    this.isReady = !this.isReady
  }
}

class Stats {
  hp: number
  atk: number
  def: number
  mag: number

  constructor() {
    this.hp = 100
    this.atk = 50
    this.def = 25
    this.mag = 35
  }

  getStats() {
    return {
      hp: this.hp,
      atk: this.atk,
      def: this.def,
      mag: this.mag,
    }
  }
}
