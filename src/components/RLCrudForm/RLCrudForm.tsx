import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { RLCrudFormProps, RLCrudFormRef, RLCrudFormFieldType } from './types'
import type { RLCrudInputValueType, RLCrudInputRef } from '../RLCrudInput'
import { RLCrudInput } from '../RLCrudInput'
import { RLButton } from '../RLButton'
import type { RLInputRuleType } from '../utils/types'

export const RLCrudForm = forwardRef<RLCrudFormRef, RLCrudFormProps>(
  (
    {
      value,
      type,
      fields: initialFields,
      title,
      cancelLabel,
      confirmLabel,
      requiredRuleMessage,
      validateAll = false,
      primaryKey,
      onClose,
      onCancel,
      onConfirm,
      onError
    },
    ref
  ) => {
    const [model, setModel] = useState<{ [key: string]: RLCrudInputValueType }>({})
    const [fields, setFields] = useState<{ [key: string]: RLCrudFormFieldType }>({})
    const fieldRefs = useRef<Map<string, RLCrudInputRef>>(new Map())

    // Initialize fields from props
    useEffect(() => {
      const fieldsMap = initialFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.value]: { ...field, ...(field.options ? { options: [...field.options] } : {}) }
        }),
        {} as { [key: string]: RLCrudFormFieldType }
      )
      setFields(fieldsMap)

      // Initialize model with value or default values
      if (value) {
        setModel({ ...value })
        // Run side effects for existing values
        Object.keys(fieldsMap).forEach((fieldKey) => {
          if (value[fieldKey] !== undefined) {
            fieldsMap[fieldKey].side_effect?.(value, fieldsMap)
          }
        })
      }
    }, [initialFields, value])

    const requiredRule: RLInputRuleType = useMemo(
      () => ({
        validateFn: (v: unknown) => !!v,
        message: requiredRuleMessage
      }),
      [requiredRuleMessage]
    )

    const isVisible = useCallback(
      (field: RLCrudFormFieldType) => {
        if (field.hidden) {
          return false
        }
        if (field.hidden_on_create && type === 'add') {
          return false
        }
        return true
      },
      [type]
    )

    const isDisabled = useCallback(
      (field: RLCrudFormFieldType) => {
        if (field.disabled) {
          return true
        }
        if (type === 'edit' && (field.disabled_on_edit || field.value === primaryKey)) {
          return true
        }
        return false
      },
      [type, primaryKey]
    )

    const handleFieldChange = useCallback(
      (fieldKey: string, fieldValue: RLCrudInputValueType) => {
        setModel((prev) => {
          const newModel = { ...prev, [fieldKey]: fieldValue }
          // Run side effect
          fields[fieldKey]?.side_effect?.(newModel, fields)
          return newModel
        })
      },
      [fields]
    )

    const closeDialog = useCallback(() => {
      onClose?.()
    }, [onClose])

    const handleConfirm = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()

        let valid = true
        const visibleFields = Object.values(fields).filter(isVisible)

        for (const field of visibleFields) {
          const fieldRef = fieldRefs.current.get(field.value)
          if (fieldRef && !fieldRef.validate()) {
            valid = false
            if (!validateAll) break
          }
        }

        if (valid) {
          onConfirm?.({ ...model })
          closeDialog()
        }
      },
      [fields, isVisible, model, onConfirm, validateAll, closeDialog]
    )

    const handleCancel = useCallback(() => {
      onCancel?.()
      closeDialog()
    }, [onCancel, closeDialog])

    useImperativeHandle(ref, () => ({
      validate: () => {
        let valid = true
        const visibleFields = Object.values(fields).filter(isVisible)

        for (const field of visibleFields) {
          const fieldRef = fieldRefs.current.get(field.value)
          if (fieldRef && !fieldRef.validate()) {
            valid = false
            if (!validateAll) break
          }
        }
        return valid
      }
    }))

    return (
      <>
        <div slot="label">{title}</div>
        <form
          name={`${type}-crud-form`}
          className="flex flex-col gap-8"
          onSubmit={handleConfirm}
        >
          {Object.values(fields).map((field) => (
            <div
              key={field.value}
              className={`w-full ${field.class || ''}`}
              style={{ display: isVisible(field) ? undefined : 'none' }}
            >
              <RLCrudInput
                ref={(el) => {
                  if (el) {
                    fieldRefs.current.set(field.value, el)
                  } else {
                    fieldRefs.current.delete(field.value)
                  }
                }}
                inputName={field.value}
                type={field.input_type}
                label={field.label}
                options={field.options}
                rules={!field.required ? field.rules : [...(field.rules ?? []), requiredRule]}
                disabled={isDisabled(field)}
                placeholder={field.placeholder}
                required={field.required}
                multiple={field.multiple}
                imgStyle={field.img_style}
                forceSelection={field.forceSelection}
                withTime={field.withTime}
                value={model[field.value]}
                onChange={(v) => handleFieldChange(field.value, v)}
                onError={onError}
              />
            </div>
          ))}
          <div className="sticky bottom-0 flex justify-end w-full gap-2 pb-4 bg-white">
            <RLButton onClick={handleCancel}>{cancelLabel}</RLButton>
            <RLButton variant="primary" type="submit">
              <span>{confirmLabel}</span>
            </RLButton>
          </div>
        </form>
      </>
    )
  }
)

RLCrudForm.displayName = 'RLCrudForm'
