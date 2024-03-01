import { FieldStore } from '@modular-forms/preact'

import { useEmbedOptions } from './Options'

type Props = {
  of: FieldStore<any, string> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function EmbedFieldError({ of: field }: Props) {
  const options = useEmbedOptions()
  const customClassName =
    options.className?.error?.({
      name: field.name,
      touched: field.touched.value,
      dirty: field.dirty.value,
    }) || ''

  const error = field.error.value

  if (!error) {
    return null
  }

  return (
    <div
      className={`GigsEmbeds GigsPortingEmbed GigsEmbeds-error ${customClassName}`}
    >
      {error}
    </div>
  )
}
