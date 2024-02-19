import './App.css'

import { useRef, useState } from 'preact/hooks'
import * as React from 'react'

import { PortingEmbed } from '../lib/PortingEmbed'

function App() {
  const $portingEmbedEl = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<'idle' | 'loading' | 'loaded'>('idle')

  async function handleSubmit(
    event: React.JSX.TargetedSubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setLoading('loading')
      const formData = new FormData(event.currentTarget)
      const csn = formData.get('csn')!.toString()
      const project = formData.get('project')!.toString()

      const embed = await PortingEmbed(JSON.parse(csn), { project })
      embed.mount($portingEmbedEl.current!)
    } catch (error) {
      console.error(error)
      setLoading('idle')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          <div>Project</div>
          <input name="project" type="text" defaultValue="dev" />
        </label>
        <label>
          <div>Connect Session</div>
          <textarea rows={5} cols={40} name="csn" defaultValue="" />
        </label>
        <br />
        <button type="submit">Initialize!</button>
      </form>
      <hr />
      {loading === 'idle' && <div>Fill out form first</div>}
      {loading === 'loading' && <div>Loading...</div>}
      <div ref={$portingEmbedEl} />
    </>
  )
}

export default App
