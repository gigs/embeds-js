type Props = {
  onSubmit: (data: { connectSession: string; project: string }) => unknown
}

export function ConnectSessionInitForm({ onSubmit }: Props) {
  return (
    <form
      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        onSubmit({
          connectSession: formData.get('csn')!.toString(),
          project: formData.get('project')!.toString(),
        })
      }}
    >
      <div className="px-4 py-6 sm:p-8 space-y-4">
        <div>
          <label
            htmlFor="project"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Project ID
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="project"
              id="project"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="your-project-id"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="csn"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Connect Session{' '}
            <span className="text-gray-500 font-normal">
              with intent <code>completePorting</code>
            </span>
          </label>
          <div className="mt-2">
            <textarea
              id="csn"
              name="csn"
              rows={5}
              className="block w-full font-mono rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={`{"object":"connectSession","id":"csn_...`}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Start
        </button>
      </div>
    </form>
  )
}
