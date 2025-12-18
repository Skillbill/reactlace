import { forwardRef } from 'react'
import type { RLButtonProps } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: string
        size?: string
        caret?: boolean
        disabled?: boolean
        loading?: boolean
        outline?: boolean
        pill?: boolean
        circle?: boolean
        type?: string
        name?: string
        value?: string
        href?: string
        target?: string
        form?: string
        class?: string
      }
    }
  }
}

export const RLButton = forwardRef<HTMLElement, RLButtonProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      caret,
      disabled,
      loading,
      outline,
      pill,
      circle,
      type = 'button',
      name,
      value,
      href,
      target,
      form,
      children,
      prefix,
      suffix,
      className,
      onClick
    },
    ref
  ) => {
    return (
      <sl-button
        ref={ref}
        class={className}
        variant={variant}
        size={size}
        caret={caret || undefined}
        disabled={disabled || undefined}
        loading={loading || undefined}
        outline={outline || undefined}
        pill={pill || undefined}
        circle={circle || undefined}
        type={type}
        name={name || undefined}
        value={value}
        href={href || undefined}
        target={target}
        form={form}
        onClick={onClick}
      >
        {prefix && <span slot="prefix">{prefix}</span>}
        {children}
        {suffix && <span slot="suffix">{suffix}</span>}
      </sl-button>
    )
  }
)

RLButton.displayName = 'RLButton'
