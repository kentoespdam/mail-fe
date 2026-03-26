/**
 * Email validation helper
 * Validates email format using RFC 5322 compliant regex pattern
 */

/**
 * Validates email format
 * @param email - The email address to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }

  const trimmedEmail = email.trim()

  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email is required' }
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email must be less than 254 characters' }
  }

  // RFC 5322 compliant email pattern
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailPattern.test(trimmedEmail)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  // Additional checks
  const [localPart, domain] = trimmedEmail.split('@')

  if (!localPart || !domain) {
    return { isValid: false, error: 'Email must contain @ symbol' }
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Local part cannot start or end with a dot' }
  }

  if (localPart.includes('..')) {
    return { isValid: false, error: 'Local part cannot contain consecutive dots' }
  }

  if (!domain.includes('.')) {
    return { isValid: false, error: 'Domain must contain at least one dot' }
  }

  return { isValid: true }
}

/**
 * Simple boolean validation (returns true/false only)
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function isEmailValid(email: string): boolean {
  return validateEmail(email).isValid
}
