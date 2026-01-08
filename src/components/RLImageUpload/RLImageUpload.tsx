import { forwardRef, useImperativeHandle, useCallback, useState, useEffect } from 'react'
import type { RLImageUploadProps, RLImageUploadRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { RLFileInput } from '../RLFileInput'
import { RLIcon } from '../RLIcon'
import { useValidation } from '../../hooks/useValidation'

export const RLImageUpload = forwardRef<RLImageUploadRef, RLImageUploadProps>(
  (
    {
      value,
      onChange,
      className,
      name = '',
      label = '',
      placeholder = '',
      error = '',
      clearable = true,
      required = false,
      disabled = false,
      imgStyle,
      rules = [],
      onError
    },
    ref
  ) => {
    const [fileModel, setFileModel] = useState<File | null>(null)
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    useEffect(() => {
      if (value !== undefined) {
        validate(value)
      }
    }, [value, validate])

    useEffect(() => {
      if (fileModel) {
        const reader = new FileReader()
        reader.onload = (e) => {
          onChange?.(e.target?.result as string)
        }
        reader.readAsDataURL(fileModel)
      }
    }, [fileModel, onChange])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(value)
    }))

    const clear = useCallback(() => {
      if (disabled) return

      onChange?.(null)
      setFileModel(null)
    }, [disabled, onChange])

    const handleFileChange = useCallback((files: File | File[] | null) => {
      if (files && !Array.isArray(files)) {
        setFileModel(files)
      } else {
        setFileModel(null)
      }
    }, [])

    if (value) {
      return (
        <div className={`flex flex-col ${className || ''}`}>
          <span>
            {label}
            {required && <span>*</span>}
          </span>
          <div
            className={`flex items-center justify-between ${disabled ? 'hover:cursor-not-allowed' : ''}`}
          >
            <div style={imgStyle} className="w-fit h-fit">
              <div
                className="w-20 h-20 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${value})` }}
              />
            </div>
            <RLIcon
              className={`text-2xl hover:opacity-40 ${disabled ? 'opacity-40' : ''}`}
              name="delete"
              onClick={clear}
            />
          </div>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
      )
    }

    return (
      <RLFileInput
        value={fileModel}
        onChange={handleFileChange}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={errorMessage}
        rules={rules}
        accept="image/*"
        acceptedTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']}
        onError={onError}
      />
    )
  }
)

RLImageUpload.displayName = 'RLImageUpload'
