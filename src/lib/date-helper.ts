/**
 * Konversi tanggal dari format (misal: 2026-04-10T08:03:38)
 * menjadi format "10 April 2026 08:03:38" (Bahasa Indonesia).
 *
 * @param dateString - String tanggal
 * @returns String tanggal yang sudah diformat
 */
export function formatIndonesianDate(dateString: string | undefined | null): string {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Output: "10 April 2026 08:03:38"
    // Assuming day should not be padded to 2 digits if it's single digit?
    // User example: "10 April 2026", let's parse 1, 2, ..., 10 without 0-padding for days if prefered.
    // Actually, standard usually has no 0-padding for single digit days, e.g. "1 April".
    // Let's use `date.getDate()` without padStart.
    const dayStr = date.getDate().toString();

    return `${dayStr} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}
