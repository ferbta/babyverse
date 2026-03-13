/**
 * Date utility functions that handle timezone-aware date operations
 * Ensures dates are handled in GMT+7 (Asia/Ho_Chi_Minh) timezone
 */

const TIMEZONE = 'Asia/Ho_Chi_Minh'

/**
 * Get current date in YYYY-MM-DD format using GMT+7 timezone
 */
export function getLocalDateString(date: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date)
}

/**
 * Get current datetime in YYYY-MM-DDTHH:mm format using GMT+7 timezone
 */
export function getLocalDateTimeString(date: Date = new Date()): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })

    const parts = formatter.formatToParts(date)
    const getPart = (type: string) => parts.find(p => p.type === type)?.value

    const year = getPart('year')
    const month = getPart('month')
    const day = getPart('day')
    const hour = getPart('hour')
    const minute = getPart('minute')

    return `${year}-${month}-${day}T${hour}:${minute}`
}

/**
 * Parse a date string and return a Date object at midnight GMT+7
 */
export function parseLocalDate(dateString: string): Date {
    // For date-only strings (YYYY-MM-DD), create date at midnight in GMT+7
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number)
        // Create as UTC first then adjust if needed, or use a library. 
        // For simplicity with vanilla JS, we can use the constructor but be careful with local time.
        // A more robust way is to create it and then force the timezone or use date-fns-tz
        const date = new Date(year, month - 1, day, 0, 0, 0, 0)
        return date
    }
    // For datetime strings, parse normally
    return new Date(dateString)
}

/**
 * Check if two dates are on the same day in GMT+7
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    const d1Str = getLocalDateString(date1)
    const d2Str = getLocalDateString(date2)
    return d1Str === d2Str
}

/**
 * Get the difference in days between two dates in GMT+7
 * Returns positive if date2 is after date1, negative if before
 */
export function getDaysDifference(date1: Date, date2: Date): number {
    const d1Str = getLocalDateString(date1)
    const d2Str = getLocalDateString(date2)

    const d1 = new Date(d1Str)
    const d2 = new Date(d2Str)

    const diffMs = d2.getTime() - d1.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Format a date string or Date object into localized Vietnamese string with GMT+7
 */
export function formatDate(date: string | Date | null, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }): string {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('vi-VN', {
        ...options,
        timeZone: TIMEZONE
    }).format(d)
}

/**
 * Convert a date from database (ISO string) to local date string for input fields
 */
export function formatDateForInput(isoString: string | Date): string {
    const date = typeof isoString === 'string' ? new Date(isoString) : isoString
    return getLocalDateString(date)
}
/**
 * Convert a local datetime/date string (from input fields) to ISO string with GMT+7 offset.
 * Example: '2024-03-20T10:00' -> '2024-03-20T10:00:00.000+07:00'
 */
export function toISOWithTimezone(dateString: string): string {
    if (!dateString) return ''

    // If it's just a date (YYYY-MM-DD), add midnight and the offset
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return `${dateString}T00:00:00.000+07:00`
    }

    // If it's a datetime-local (YYYY-MM-DDTHH:mm), add seconds and the offset
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
        return `${dateString}:00.000+07:00`
    }

    // Fallback for other formats
    return new Date(dateString).toISOString()
}
