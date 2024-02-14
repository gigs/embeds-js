import './App.css'

import { useEffect, useRef } from 'preact/hooks'

import { WelcomeEmbed } from '../lib/main'

function App() {
  const $welcomeEmbedEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function main() {
      const embed = await WelcomeEmbed('abc', { name: 'Jerry' })
      embed.mount($welcomeEmbedEl.current!)

      embed.on('count', (count) => {
        if (count > 5) {
          embed.update({ name: `Elaine ${count}` })
        }
      })
    }

    main()
  }, [])

  return (
    <>
      <div>
        <h1>WelcomeEmbed</h1>
        <div ref={$welcomeEmbedEl} />
      </div>
    </>
  )
}

export default App
