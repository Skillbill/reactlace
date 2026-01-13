import { forwardRef } from 'react'
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js'
import type SlButtonElement from '@shoelace-style/shoelace/dist/components/button/button.js'
import type { RLButtonProps } from './types'

export const RLButton = forwardRef<SlButtonElement, RLButtonProps>(
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
      <SlButton
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        caret={caret}
        disabled={disabled}
        loading={loading}
        outline={outline}
        pill={pill}
        circle={circle}
        type={type}
        name={name}
        value={value}
        href={href}
        target={target}
        form={form}
        onClick={onClick}
      >
        {prefix && <span slot="prefix">{prefix}</span>}
        {children}
        {suffix && <span slot="suffix">{suffix}</span>}
      </SlButton>
    )
  }
)

RLButton.displayName = 'RLButton'
