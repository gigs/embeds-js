import { Porting } from '../types'

export type CustomizableEmbedProps = {
  // TODO: add styling options
  styleConfig?: {
    foo?: string
  }
}

type CoreEmbedProps = {
  token: string
  initialPorting: Porting
}

type PortingEmbedProps = CoreEmbedProps & CustomizableEmbedProps

export function PortingEmbed({ token: _, initialPorting }: PortingEmbedProps) {
  return <div className="__gigsPortingEmbed">Hello {initialPorting.id}!</div>
}
