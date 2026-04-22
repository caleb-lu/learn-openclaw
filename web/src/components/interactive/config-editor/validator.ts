export interface ValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  warnings: Array<{ path: string; message: string }>;
}

export function validateConfig(json5Content: string): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (!json5Content.trim()) {
    return { valid: false, errors: [{ path: "", message: "Configuration is empty" }], warnings };
  }

  // Basic checks
  if (!json5Content.includes("name")) {
    warnings.push({ path: "name", message: "Missing 'name' field" });
  }
  if (!json5Content.includes("model")) {
    errors.push({ path: "model", message: "Missing 'model' configuration" });
  }
  if (!json5Content.includes("channels")) {
    warnings.push({ path: "channels", message: "No channels configured" });
  }

  // Check for common issues
  if (json5Content.includes("${") && json5Content.includes("}")) {
    const envVars = json5Content.match(/\$\{([^}]+)\}/g) || [];
    envVars.forEach((v) => {
      const name = v.slice(2, -1);
      warnings.push({ path: "env", message: `Environment variable ${name} needs to be set` });
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}
