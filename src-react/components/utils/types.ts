export type {
  SlChangeEvent,
  SlInputEvent,
  SlInvalidEvent,
  SlShowEvent,
  SlBlurEvent,
  SlFocusEvent,
  SlHideEvent,
  SlClearEvent,
  SlAfterHideEvent,
  SlAfterShowEvent,
  SlInitialFocusEvent,
  SlRequestCloseEvent
} from '@shoelace-style/shoelace'

export type {
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent
} from 'primereact/autocomplete'

export interface RLInputRuleType {
  validateFn: (value: unknown) => boolean
  message: string
}
