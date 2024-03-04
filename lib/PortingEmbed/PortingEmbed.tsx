import { Porting, UpdatePortingBody } from '../types'
import { EmbedOptions, OptionsContext } from './Options'
import { PortingForm } from './PortingForm'

export type CustomizableEmbedProps = EmbedOptions

export type ValidationChangeEvent = {
  isValid: boolean
}

type CoreEmbedProps = {
  porting: Porting
  onValidationChange?: (event: ValidationChangeEvent) => unknown
  onPortingUpdate?: (updatedFields: UpdatePortingBody) => unknown
}

type PortingEmbedProps = CoreEmbedProps & { options?: CustomizableEmbedProps }

export function PortingEmbed({
  porting,
  onPortingUpdate,
  onValidationChange,
  options,
}: PortingEmbedProps) {
  return (
    <OptionsContext.Provider value={options || {}}>
      <div className="__ge_portingRoot GigsEmbeds-root">
        <PortingForm
          porting={porting}
          onValidationChange={onValidationChange}
          onSubmit={async (updatedFields) => {
            await onPortingUpdate?.(updatedFields)
          }}
        />
      </div>
    </OptionsContext.Provider>
  )
}
