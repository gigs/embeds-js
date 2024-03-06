import { Porting } from '../lib/types'

type Props = {
  porting: Porting
}

export function CompletedScreen({ porting }: Props) {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <p>The porting was completed. 🎉</p>

        <div className="mt-4">
          <textarea
            rows={20}
            readOnly
            defaultValue={JSON.stringify(porting, null, 2)}
            className="block w-full font-mono rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  )
}
