import { FieldStore } from '@modular-forms/preact'

import { useEmbedOptions } from './Options'

type Props = {
  children: React.ReactNode
  of: FieldStore<any, string> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function EmbedField({ children, of: field }: Props) {
  const options = useEmbedOptions()
  const customClassName =
    options.className?.field?.({
      name: field.name,
      touched: field.touched.value,
      dirty: field.dirty.value,
      valid: !field.error.value,
    }) || ''

  return (
    <div
      className={`GigsEmbeds GigsPortingEmbed GigsEmbeds-field ${customClassName}`}
    >
      {children}
    </div>
  )
}
