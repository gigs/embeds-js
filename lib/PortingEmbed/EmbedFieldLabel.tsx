import { FieldStore } from '@modular-forms/preact'

import { useEmbedOptions } from './Options'

type Props = {
  of: FieldStore<any, string> // eslint-disable-line @typescript-eslint/no-explicit-any
} & React.HTMLAttributes<HTMLLabelElement>

export function EmbedFieldLabel({ of: field, ...rest }: Props) {
  const options = useEmbedOptions()
  const customClassName =
    options.className?.label?.({
      name: field.name,
      touched: field.touched.value,
      dirty: field.dirty.value,
      valid: !field.error.value,
    }) || ''
  const id = `__ge_${field.name}`

  return (
    <label
      htmlFor={id}
      className={`GigsEmbeds GigsPortingEmbed GigsEmbeds-label ${customClassName}`}
      {...rest}
    />
  )
}
