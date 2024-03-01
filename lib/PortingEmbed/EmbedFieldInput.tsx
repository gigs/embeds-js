import { FieldStore } from '@modular-forms/preact'

import { useEmbedOptions } from './Options'

type Props = {
  of: FieldStore<any, string> // eslint-disable-line @typescript-eslint/no-explicit-any
} & React.HTMLAttributes<HTMLInputElement>

export function EmbedFieldInput({ of: field, ...rest }: Props) {
  const options = useEmbedOptions()
  const customClassName =
    options.className?.input?.({
      name: field.name,
      touched: field.touched.value,
      dirty: field.dirty.value,
      valid: !field.error.value,
    }) || ''
  const id = `__ge_${field.name}`

  return (
    <input
      className={`GigsEmbeds GigsPortingEmbed GigsEmbeds-input ${customClassName}`}
      id={id}
      {...rest}
    />
  )
}
