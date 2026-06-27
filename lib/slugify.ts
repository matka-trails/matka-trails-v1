/**
 * Convert a string to a URL-safe slug.
 * "Kedarnath 2D/3N Package" → "kedarnath-2d-3n-package"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "")   // Remove non-word chars (except hyphens)
    .replace(/\-\-+/g, "-")     // Collapse multiple hyphens
    .replace(/^-+/, "")         // Trim leading hyphens
    .replace(/-+$/, "");        // Trim trailing hyphens
}

/**
 * Generate a unique slug by appending a counter if the base slug already exists.
 * Uses a callback to check existence in the database.
 *
 * @param text - The text to slugify
 * @param checkExists - Async function that returns true if the slug is already taken
 * @returns A unique slug string
 */
export async function generateUniqueSlug(
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(text);
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
