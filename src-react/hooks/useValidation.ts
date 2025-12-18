import { useState, useCallback } from 'react'

export interface RLInputRuleType {
  validateFn: (value: unknown) => boolean
  message: string
}

export interface UseValidationOptions {
  rules?: RLInputRuleType[]
  externalError?: string
}

export interface UseValidationResult {
  errorMessage: string
  isValid: boolean
  validate: (value: unknown) => boolean
  clearError: () => void
}

export function useValidation({ rules = [], externalError = '' }: UseValidationOptions = {}): UseValidationResult {
  const [validationError, setValidationError] = useState('')

  const validate = useCallback((value: unknown): boolean => {
    for (const rule of rules) {
      if (!rule.validateFn(value)) {
        setValidationError(rule.message)
        return false
      }
    }
    setValidationError('')
    return true
  }, [rules])

  const clearError = useCallback(() => {
    setValidationError('')
  }, [])

  const errorMessage = externalError || validationError
  const isValid = !errorMessage

  return {
    errorMessage,
    isValid,
    validate,
    clearError
  }
}
