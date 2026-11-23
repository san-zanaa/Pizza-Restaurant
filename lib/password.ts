

export const PASSWORD_MIN_LENGTH = 6

export function passwordError(value: string): string | null {
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter."
  }
  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter."
  }
  return null
}
