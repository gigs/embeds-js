import { useEffect, useRef, useState } from 'preact/hooks'

import { Events, PortingEmbed, PortingEmbedInstance } from '../lib'
import { Porting } from '../lib/types'
import { Spinner } from './Spinner'

type Props = {
  connectSession: string
  project: string
  onCompleted: (porting: Porting) => unknown
}

type Status = 'initializing' | 'idle' | 'submitting' | 'completed'

export function PortingEmbedExample({
  connectSession,
  project,
  onCompleted,
}: Props) {
  const [didInitialize, setDidInitialize] = useState(false)
  const $mount = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('initializing')
  const [embed, setEmbed] = useState<PortingEmbedInstance>()

  // Initialize and mount the embed
  useEffect(() => {
    if (didInitialize) return
    setDidInitialize(true)

    let embed: PortingEmbedInstance | null

    async function main() {
      embed = await PortingEmbed(JSON.parse(connectSession), {
        project,
        options: {
          className: {
            form: ({ submitting }) =>
              submitting
                ? 'transition-opacity opacity-50'
                : 'transition-opacity opacity-100',
          },
        },
      })
      setEmbed(embed)

      // After initializing the embed, and before mounting the Embed,
      // you can remove any loading spinners.
      setStatus('idle')

      if (!$mount.current) {
        alert('Element mount does not exist')
        return
      }

      embed.mount($mount.current)
    }

    main().catch((error) => {
      // Any errors that happen during initialization.
      // This might be due to an invalid ConnectSession or unsupported Porting.
      alert(error?.toString())
    })

    return () => {
      embed?.unmount()
    }
  }, [connectSession, project, didInitialize])

  useEffect(() => {
    if (!embed) return

    // Handle changes of the form submit status.
    // For example by showing a loading status on the button.
    embed.on('submitStatus', handleSubmitStatus)
    function handleSubmitStatus({ status }: Events['submitStatus']) {
      if (status === 'loading') {
        setStatus('submitting')
      } else {
        setStatus('idle')
      }
    }

    // When the porting is completed, continue in your app.
    embed.on('completed', handleCompleted)
    function handleCompleted({ porting }: Events['completed']) {
      onCompleted(porting)
    }

    return () => {
      embed.off('submitStatus', handleSubmitStatus)
      embed.off('completed', handleCompleted)
    }
  }, [embed, onCompleted])

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        {/* Show a loading spinner initially */}
        {status === 'initializing' && (
          <div className="text-gray-600">
            <Spinner />
          </div>
        )}

        {/* This is where the embed will be mounted into */}
        <div ref={$mount} />
      </div>
      <div className="flex items-center gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        {/* You have full control over the styling and placing of the submit button in your app */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          form="gigsPortingEmbedForm" // this ID connects the button to the embed
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {status === 'submitting' && (
            <div className="inline-block -mt-4 -mb-1 mr-1">
              <Spinner />
            </div>
          )}
          Continue
        </button>
      </div>
    </div>
  )
}
