import 'dotenv/config';

export class AppConfig {
  public static get(propertyPath: string): string | undefined {
    return process.env[propertyPath] ?? undefined;
  }

  public static getOrThrow(propertyPath: string): string {
    const propertyValue = process.env[propertyPath] ?? undefined;

    if (propertyValue) {
      return propertyValue;
    }

    throw new Error(`${propertyPath} is not a valid environment variable.`);
  }
}
