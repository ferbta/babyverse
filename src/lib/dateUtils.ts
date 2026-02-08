/**
 * Date utility functions that handle timezone-aware date operations
 * Ensures dates are handled in local timezone to prevent off-by-one errors
 */

/**
 * Get current date in YYYY-MM-DD format using local timezone
 */
export function getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Get current datetime in YYYY-MM-DDTHH:mm format using local timezone
 */
export function getLocalDateTimeString(date: Date = new Date()): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Parse a date string and return a Date object at midnight local time
 */
export function parseLocalDate(dateString: string): Date {
    // For date-only strings (YYYY-MM-DD), create date at midnight local time
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number)
        return new Date(year, month - 1, day, 0, 0, 0, 0)
    }
    // For datetime strings, parse normally
    return new Date(dateString)
}

/**
 * Check if two dates are on the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

/**
 * Get the difference in days between two dates (ignoring time)
 * Returns positive if date2 is after date1, negative if before
 */
export function getDaysDifference(date1: Date, date2: Date): number {
    // Create dates at midnight to compare only the day part
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())

    const diffMs = d2.getTime() - d1.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Convert a date from database (ISO string) to local date string for input fields
 */
export function formatDateForInput(isoString: string | Date): string {
    const date = typeof isoString === 'string' ? new Date(isoString) : isoString
    return getLocalDateString(date)
}
