const CUSTOMER_TOKEN_KEY = "padelbros_customer_token";

export function getStoredCustomerToken(): string | null {
  try {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredCustomerToken(token: string): void {
  try {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  } catch {
    // Almacenamiento no disponible (modo privado, etc.): simplemente no se recuerda.
  }
}
