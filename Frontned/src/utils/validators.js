export function isValidEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}
