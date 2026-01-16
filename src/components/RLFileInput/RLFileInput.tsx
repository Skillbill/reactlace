import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
  useEffect,
  type MouseEvent,
  type ChangeEvent,
  type KeyboardEvent
} from 'react'
import type { RLFileInputProps, RLFileInputRef, RLFileInputErrorEvent } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { FileBadge } from '../utils/FileBadge'
import { RLIcon } from '../RLIcon'
import { useValidation } from '../../hooks/useValidation'

export const RLFileInput = forwardRef<RLFileInputRef, RLFileInputProps>(
  (
    {
      className,
      value,
      onChange,
      name,
      label = '',
      placeholder,
      error,
      helpText,
      required = false,
      disabled = false,
      accept,
      multiple = false,
      acceptedTypes,
      maxFileSize,
      fileLimit,
      rules = [],
      onError,
      prefix,
      suffix
    },
    ref
  ) => {
    const hiddenInputRef = useRef<HTMLInputElement>(null)
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    useEffect(() => {
      if (value !== undefined) {
        validate(value)
      }
    }, [value, validate])

    useEffect(() => {
      if (disabled) {
        onChange?.(null)
      }
    }, [disabled, onChange])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(value)
    }))

    const openFileSelection = useCallback(() => {
      if (!disabled && hiddenInputRef.current) {
        hiddenInputRef.current.click()
      }
    }, [disabled])

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          openFileSelection()
        }
      },
      [openFileSelection]
    )

    const checkConstraints = useCallback(
      (files: FileList): boolean => {
        if (multiple && fileLimit) {
          const filesCount = Array.isArray(value) ? value.length : 0
          if (filesCount + files.length > fileLimit) {
            onError?.({
              count: filesCount + files.length,
              message: 'file_limit_exceeded'
            } as RLFileInputErrorEvent)
            return false
          }
        }

        for (const file of Array.from(files)) {
          if (maxFileSize && file.size > maxFileSize) {
            onError?.({
              file: file.name,
              size: file.size,
              message: 'size_limit_exceeded'
            } as RLFileInputErrorEvent)
            return false
          }

          if (acceptedTypes && acceptedTypes.length) {
            const accepted = acceptedTypes.includes(file.type)
            if (!accepted) {
              onError?.({
                file: file.name,
                type: file.type,
                message: 'invalid_file_type'
              } as RLFileInputErrorEvent)
              return false
            }
          }
        }

        return true
      },
      [multiple, fileLimit, value, maxFileSize, acceptedTypes, onError]
    )

    const readFile = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files

        if (!files?.length || !checkConstraints(files)) {
          return
        }

        if (multiple) {
          if (Array.isArray(value) && value.length) {
            onChange?.([...value, ...Array.from(files)])
          } else {
            onChange?.([...Array.from(files)])
          }
        } else {
          onChange?.(files[0])
        }

        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = ''
        }
      },
      [checkConstraints, multiple, value, onChange]
    )

    const clearFile = useCallback(
      (event: MouseEvent, index?: number) => {
        event.stopPropagation()
        if (Array.isArray(value)) {
          const clearedModel = value.filter((_, i) => i !== index)
          onChange?.(clearedModel.length ? clearedModel : null)
        } else {
          onChange?.(null)
        }
      },
      [value, onChange]
    )

    return (
      <div className={`relative ${className ?? ''}`}>
        <label
          htmlFor={name}
          className={`pb-4 ${errorMessage ? 'error' : ''}`}
          style={errorMessage ? { color: 'var(--sl-color-danger-500)' } : undefined}
        >
          {label} {required && <span>*</span>}
        </label>
        <div
          className={`input-like ${disabled ? 'disabled' : ''} ${errorMessage ? 'error' : ''}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={openFileSelection}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: 'var(--sl-input-height-medium)',
            padding: '0.25rem 1rem',
            backgroundColor: disabled
              ? 'var(--sl-color-neutral-100)'
              : 'var(--sl-input-background-color)',
            border: `solid var(--sl-input-border-width) ${errorMessage ? 'var(--sl-color-danger-500)' : 'var(--sl-input-border-color)'}`,
            borderRadius: '0.25rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled ? 'var(--sl-color-neutral-400)' : undefined
          }}
        >
          {prefix || (
            <RLIcon
              className={`pr-4 min-w-4 ${disabled ? 'disabled' : ''}`}
              library="system"
              name="paperclip"
            />
          )}
          <div className="flex flex-wrap items-center gap-2 overflow-y-auto cursor-default max-h-32">
            {value ? (
              Array.isArray(value) ? (
                value.map((file, i) => (
                  <FileBadge key={i} onRemove={(evt) => clearFile(evt, i)}>
                    {file.name}
                  </FileBadge>
                ))
              ) : (
                <FileBadge onRemove={(evt) => clearFile(evt)}>{value.name}</FileBadge>
              )
            ) : (
              <span className="text-sm text-neutral-400">{placeholder}</span>
            )}
          </div>
          {suffix}
        </div>
        {helpText && <span className="text-xs line-clamp-2 text-neutral-600">{helpText}</span>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <input
          ref={hiddenInputRef}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          onChange={readFile}
        />
      </div>
    )
  }
)

RLFileInput.displayName = 'RLFileInput'
