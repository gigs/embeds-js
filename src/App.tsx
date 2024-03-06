import { useCallback, useState } from 'preact/hooks'

import { Porting } from '../lib/types'
import { CompletedScreen } from './CompletedScreen'
import { ConnectSessionInitForm } from './ConnectSessionInitForm'
import { PortingEmbedExample } from './PortingEmbedExample'

type DemoStep = 'intro' | 'embed' | 'completed'

function App() {
  const [demoStep, setDemoStep] = useState<DemoStep>('intro')
  const [connectSession, setConnectSession] = useState<string>()
  const [project, setProject] = useState<string>()
  const [finalPorting, setFinalPorting] = useState<Porting>()

  const handleCompleted = useCallback((porting: Porting) => {
    setFinalPorting(porting)
    setDemoStep('completed')
  }, [])

  const handleReset = useCallback(() => {
    setDemoStep('intro')
    setFinalPorting(undefined)
    setConnectSession(undefined)
    setProject(undefined)
  }, [])

  return (
    <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            {demoStep === 'intro' && (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Provide a Connect Session
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  To initialize the Embed, a Connect Session is necessary. This
                  is not part of the Embed.
                </p>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  For the purpose of this demo, create a Connect Session for a
                  Porting which requires information, and paste the returned
                  object.
                </p>
              </>
            )}
            {demoStep === 'embed' && (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Porting Embed
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  You can now complete the Porting.
                  <br />
                  The text fields on the right are completely rendered by the
                  Embed.
                </p>
                <button
                  type="button"
                  className="rounded bg-white mt-4 px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </>
            )}
            {demoStep === 'completed' && (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  After Porting Embed
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  The Porting is completed and the Porting Embed is not mounted
                  anymore.
                </p>
                <button
                  type="button"
                  className="rounded bg-white mt-4 px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </>
            )}
          </div>
          {demoStep === 'intro' && (
            <ConnectSessionInitForm
              onSubmit={({ connectSession, project }) => {
                setConnectSession(connectSession)
                setProject(project)
                setDemoStep('embed')
              }}
            />
          )}
          {demoStep === 'embed' && (
            <PortingEmbedExample
              connectSession={connectSession!}
              project={project!}
              onCompleted={handleCompleted}
            />
          )}
          {demoStep === 'completed' && (
            <CompletedScreen porting={finalPorting!} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
