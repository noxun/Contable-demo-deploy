import { createParser } from "nuqs";

/**
 * Custom date parser for nuqs that handles dates in local timezone.
 * 
 * **Why this is necessary:**
 * 
 * The default `parseAsIsoDate` from nuqs uses standard ISO date parsing, which treats
 * date strings like "2025-07-18" as UTC midnight (00:00:00 UTC). When JavaScript
 * converts this to the local timezone, it can shift the date to the previous day.
 * 
 * For example, in GMT-4 timezone:
 * - URL shows: "2025-07-18" 
 * - `parseAsIsoDate` creates: 2025-07-18T00:00:00Z (UTC)
 * - Local timezone conversion: 2025-07-17T20:00:00-04:00 (July 17th, 8 PM)
 * - Result: Wrong date displayed (July 17th instead of July 18th)
 * 
 * **Our solution:**
 * 
 * This custom parser manually splits the date string and creates a Date object
 * using the local timezone constructor `new Date(year, month, day)`, which treats
 * the date components as being in the user's local timezone from the start.
 * 
 * @example
 * ```typescript
 * // URL: "?date=2025-07-18"
 * // With parseAsIsoDate: July 17th (in GMT-4)
 * // With parseAsLocalDate: July 18th (correct)
 * ```
 */
export const parseAsLocalDate = createParser({
  parse(queryValue) {
    if (!queryValue) return null;
    
    // Split the ISO date string (YYYY-MM-DD format)
    const parts = queryValue.split('-').map(part => parseInt(part, 10));
    if (parts.length !== 3) return null;
    
    // Create date in local timezone (month is 0-indexed in JavaScript)
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  },
  serialize(value) {
    if (!value) return '';
    
    // Format as YYYY-MM-DD using local date components
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});