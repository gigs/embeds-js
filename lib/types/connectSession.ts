export type ConnectSession = {
  object: 'connectSession'
  id: string
  callbackUrl: string | null
  intent: ConnectSessionIntent
  url: string | null
  user: string | null
}

export type ConnectSessionIntent = ConnectSessionCompletePortingIntent

export type ConnectSessionCompletePortingIntent = {
  type: 'completePorting'
  completePorting: {
    subscription: string
  }
}
