/**
 * Maps ASP.NET Identity error messages to specific form field keys.
 * Returns { fieldErrors, formError } where formError is for errors
 * that can't be attributed to a single field.
 */
export function parseIdentityErrors<TField extends string>(
  raw: string,
  fieldMap: Partial<Record<"email" | "password", TField>>,
): { fieldErrors: Partial<Record<TField, string>>; formError: string | null } {
  const messages = raw.split(/\.\s+|\. *$/).map((s) => s.trim()).filter(Boolean);

  const fieldErrors: Partial<Record<TField, string>> = {};
  const unmatched: string[] = [];

  for (const msg of messages) {
    const lower = msg.toLowerCase();

    if (fieldMap.password && (
      lower.includes("password") ||
      lower.includes("digit") ||
      lower.includes("uppercase") ||
      lower.includes("lowercase") ||
      lower.includes("non alphanumeric") ||
      lower.includes("unique characters")
    )) {
      // Show the first password error on the field, append subsequent ones
      const key = fieldMap.password;
      fieldErrors[key] = fieldErrors[key]
        ? `${fieldErrors[key]} ${msg}.`
        : `${msg}.`;
      continue;
    }

    if (fieldMap.email && (
      lower.includes("email") ||
      lower.includes("user name") ||
      lower.includes("username") ||
      lower.includes("already taken")
    )) {
      const key = fieldMap.email;
      fieldErrors[key] = `${msg}.`;
      continue;
    }

    unmatched.push(`${msg}.`);
  }

  return {
    fieldErrors,
    formError: unmatched.length > 0 ? unmatched.join(" ") : null,
  };
}
