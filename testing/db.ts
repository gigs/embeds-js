import { ConnectSession, Porting, Subscription } from '../lib/types'

type TestDb = {
  subscriptions: Subscription[]
  portings: Porting[]
  connectSessions: ConnectSession[]
}

export const db: TestDb = {
  subscriptions: [],
  portings: [],
  connectSessions: [],
}

export function clearDb() {
  db.subscriptions = []
  db.portings = []
  db.connectSessions = []
}
