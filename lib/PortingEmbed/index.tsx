import mitt from 'mitt'
import { render } from 'preact'

import { assert } from '../core/assert'
import { fetchSubscription } from '../core/subscription'
import { exchangeSessionWithToken } from '../core/token'
import { PortingStatus } from '../types'
import {
  CustomizableEmbedProps,
  PortingEmbed as PortingEmbedComponent,
} from './PortingEmbed'

type PortingEmbedInit = { project: string }
export type PortingEmbedOptions = CustomizableEmbedProps

type Events = never

export async function PortingEmbed(
  initConnectSession: unknown,
  {
    options: initialOptions,
    project,
  }: { options?: PortingEmbedOptions } & PortingEmbedInit,
) {
  // Ensure embed was initialized with proper options.
  assert(
    project,
    'NO_PROJECT: Cannot initialize PortingEmbed without a project.',
  )

  // Ensure that the ConnectSession is valid and obtain a token.
  const { connectSession, token } = await exchangeSessionWithToken(
    initConnectSession,
    'completePorting',
  )

  let element: Element | null = null
  let options = initialOptions
  const emitter = mitt<Events>()

  // Fetch the necessary data before the embed can be mounted. While the embed
  // is loading, the embedder can show their own loading state.
  const subscription = await fetchSubscription(
    connectSession.intent.completePorting.subscription,
    { project, token },
  )
  const { porting } = subscription
  assert(porting, 'NOT_FOUND: The given subscription has no porting.')

  const supportedPortingStatus: PortingStatus[] = [
    'informationRequired',
    'declined',
  ]
  assert(
    supportedPortingStatus.includes(porting.status),
    `UNSUPPORTED: Porting status "${porting.status}" is not supported by the embed.`,
  )

  /**
   * Mount the embed into a container.
   * @param container The HTML Element or selector in which the embed should be
   * mounted to.
   */
  const mount = (container: Element | string) => {
    assert(container, 'Cannot call mount() without specifying a container.')

    element =
      typeof container === 'string'
        ? document.querySelector(container)
        : container
    assert(element, 'Element to mount to could not be found.')

    renderWithCurrentOptions()
  }

  /**
   * Unmount the mounted embed.
   */
  const unmount = () => {
    assert(element, 'Cannot call unmount() on an unmounted embed.')

    render(null, element)
    element = null
  }

  /**
   * Update the mounted embed with new options.
   * @param newOptions New options for the embed
   */
  const update = (newOptions: PortingEmbedOptions) => {
    assert(element, 'Cannot call update() on an unmounted embed.')

    options = newOptions
    renderWithCurrentOptions()
  }

  const renderWithCurrentOptions = () => {
    assert(element, 'No element present to render embed into.')

    render(
      <PortingEmbedComponent
        {...options}
        token={token}
        initialPorting={porting}
      />,
      element,
    )
  }

  return {
    mount,
    update,
    unmount,
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
  }
}
