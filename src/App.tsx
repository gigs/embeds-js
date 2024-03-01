import './App.css'

import { useRef, useState } from 'preact/hooks'
import * as React from 'react'

import { PortingEmbed } from '../lib'

function App() {
  const $portingEmbedEl = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<'idle' | 'loading' | 'loaded'>('idle')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(
    event: React.JSX.TargetedSubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setLoading('loading')
      const formData = new FormData(event.currentTarget)
      const csn = formData.get('csn')!.toString()
      const project = formData.get('project')!.toString()

      const embed = await PortingEmbed(JSON.parse(csn), {
        project,
        options: {
          className: {
            field: ({ valid }) =>
              valid ? 'hey-custom-class' : 'hey-this-is-invalid',
          },
        },
      })
      setLoading('loaded')

      embed.mount($portingEmbedEl.current!)

      embed.on('submitStatus', (evt) => {
        console.log('submit status changed:', evt)
        setSubmitting(evt.status === 'loading')
      })
      embed.on('validationChange', (evt) => {
        console.log('Porting Form is valid: ', evt)
      })
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
      <button type="submit" form="gigsPortingEmbedForm" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Save porting'}
      </button>
    </>
  )
}

export default App
