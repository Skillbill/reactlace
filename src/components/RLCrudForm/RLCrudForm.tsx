import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { RLCrudFormProps, RLCrudFormRef, RLCrudFormFieldType } from './types'
import type { RLCrudInputValueType, RLCrudInputRef } from '../RLCrudInput'
import { RLCrudInput } from '../RLCrudInput'
import { RLButton } from '../RLButton'
import type { RLInputRuleType } from '../utils/types'

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype

// Copy of the containers only (arrays, plain objects, dates), enough to
// compare later against a value the side effects may have mutated meanwhile
const snapshot = (v: unknown): unknown => {
  if (v instanceof Date) return new Date(v.getTime())
  if (Array.isArray(v)) return v.map(snapshot)
  if (isPlainObject(v)) {
    return Object.fromEntries(Object.entries(v).map(([k, item]) => [k, snapshot(item)]))
  }
  return v
}

const sameContent = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => sameContent(item, b[i]))
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a)
    return (
      keys.length === Object.keys(b).length &&
      keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && sameContent(a[key], b[key]))
    )
  }
  return false
}

export const RLCrudForm = forwardRef<RLCrudFormRef, RLCrudFormProps>(
  (
    {
      className,
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
    const lastInitRef = useRef<{ fields: RLCrudFormFieldType[]; value: unknown; content: unknown } | null>(null)

    // Initialize fields from props
    useEffect(() => {
      // A parent building `value` on each render would otherwise wipe what was
      // typed at each of its renders: same fields and same content, nothing to do.
      // The same object is the StrictMode run again, after the side effects
      // below may have mutated it.
      const lastInit = lastInitRef.current
      if (
        lastInit &&
        lastInit.fields === initialFields &&
        (lastInit.value === value || sameContent(lastInit.content, value))
      ) {
        return
      }
      // Taken before the side effects below, which may mutate `value`
      lastInitRef.current = { fields: initialFields, value, content: snapshot(value) }

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
      } else {
        // Apply default values from fields when adding new item
        const defaultModel: { [key: string]: RLCrudInputValueType } = {}
        Object.values(fieldsMap).forEach((field) => {
          if (field.default_value !== undefined) {
            defaultModel[field.value] = field.default_value
          }
        })
        setModel(defaultModel)
      }
    }, [initialFields, value])

    const requiredRule: RLInputRuleType = useMemo(
      () => ({
        // 0 is a value; false stays missing, a required checkbox must be checked
        validateFn: (v: unknown) => v === 0 || (Array.isArray(v) ? v.length > 0 : !!v),
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
        // Render before the event returns. Shoelace events are not batched by
        // React as its own: the render would come in a later task, after the
        // next key or the click on confirm, which would still see the old model.
        flushSync(() => {
          setModel((prev) => {
            const newModel = { ...prev, [fieldKey]: fieldValue }
            // Run side effect
            fields[fieldKey]?.side_effect?.(newModel, fields)
            return newModel
          })
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
          className={`flex flex-col gap-8 ${className ?? ''}`}
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
                step={field.step}
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
