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
      setStatus('idle')

      if (!$mount.current) {
        alert('Element mount does not exist')
        return
      }

      embed.mount($mount.current)
    }

    main().catch((error) => alert(error?.toString()))

    return () => {
      embed?.unmount()
    }
  }, [connectSession, project, didInitialize])

  useEffect(() => {
    if (!embed) return

    const handleSubmitStatus = ({ status }: Events['submitStatus']) => {
      if (status === 'loading') {
        setStatus('submitting')
      } else {
        setStatus('idle')
      }
    }

    const handleCompleted = ({ porting }: Events['completed']) => {
      onCompleted(porting)
    }

    embed.on('submitStatus', handleSubmitStatus)
    embed.on('completed', handleCompleted)

    return () => {
      embed.off('submitStatus', handleSubmitStatus)
      embed.off('completed', handleCompleted)
    }
  }, [embed, onCompleted])

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        {status === 'initializing' && (
          <div className="text-gray-600">
            <Spinner />
          </div>
        )}
        <div ref={$mount} />
      </div>
      <div className="flex items-center gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="submit"
          disabled={status === 'submitting'}
          form="gigsPortingEmbedForm"
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
