import mitt from 'mitt'
import { render } from 'preact'

import { WelcomeEmbed as WelcomeEmbedComponent } from './WelcomeEmbed'

export type WelcomeEmbedOptions = {
  name?: string
}

type Events = {
  count: number
}

/** Just a POC */
export async function WelcomeEmbed(
  session: string,
  initialOptions: WelcomeEmbedOptions = {},
) {
  const token = await tokenExchange(session)

  let element: Element | null = null
  let options = initialOptions
  const emitter = mitt<Events>()

  /**
   * Mount the embed into a container.
   * @param container The HTML Element or selector in which the embed should be
   * mounted to.
   */
  function mount(container: Element | string) {
    if (!container) {
      throw new Error('Cannot call mount() without specifying a container.')
    }

    element =
      typeof container === 'string'
        ? document.querySelector(container)
        : container

    if (!element) {
      throw new Error('Element to mount to could not be found.')
    }

    renderWithCurrentOptions()
  }

  /**
   * Unmount the mounted embed.
   */
  function unmount() {
    if (!element) {
      throw new Error('Cannot call unmount() on an unmounted embed.')
    }

    render(null, element)
    element = null
  }

  /**
   * Update the mounted embed with new options.
   * @param newOptions New options for the embed
   */
  function update(newOptions: WelcomeEmbedOptions) {
    if (!element) {
      throw new Error('Cannot call update() on an unmounted embed.')
    }

    options = newOptions
    renderWithCurrentOptions()
  }

  function renderWithCurrentOptions() {
    if (!element) {
      throw new Error('No element present to render embed into.')
    }

    render(
      <WelcomeEmbedComponent
        {...options}
        token={token}
        onCounterChange={(count) => emitter.emit('count', count)}
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

// Placeholder
async function tokenExchange(session: string) {
  return 'token:'.concat(session)
}
