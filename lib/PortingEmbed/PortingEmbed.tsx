import { Porting, UpdatePortingBody } from '../types'
import { PortingForm } from './PortingForm'

export type CustomizableEmbedProps = {
  // TODO: add styling options
  styleConfig?: {
    foo?: string
  }
}

export type ValidationChangeEvent = {
  isValid: boolean
}

type CoreEmbedProps = {
  porting: Porting
  onValidationChange?: (event: ValidationChangeEvent) => unknown
  onPortingUpdate?: (updatedFields: UpdatePortingBody) => unknown
}

type PortingEmbedProps = CoreEmbedProps & CustomizableEmbedProps

export function PortingEmbed({
  porting,
  onPortingUpdate,
  onValidationChange,
}: PortingEmbedProps) {
  return (
    <div className="__ge_portingRoot">
      <PortingForm
        porting={porting}
        onValidationChange={onValidationChange}
        onSubmit={async (updatedFields) => {
          await onPortingUpdate?.(updatedFields)
        }}
      />
    </div>
  )
}
