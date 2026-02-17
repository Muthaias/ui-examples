export function toLocalTime(date: Date): string {
    return date.toLocaleString("sv-SE", { timeZone: "UTC" })
}

export function toLocalDate(date: Date) {
    return date.toLocaleDateString("sv-SE", { timeZone: "UTC" })
}
