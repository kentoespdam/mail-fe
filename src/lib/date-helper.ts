/**
 * Konversi tanggal dari format (misal: 2026-04-10T08:03:38)
 * menjadi format "10 April 2026 08:03:38" (Bahasa Indonesia).
 *
 * @param dateString - String tanggal
 * @returns String tanggal yang sudah diformat
 */
export function formatIndonesianDate(
	dateString: string | undefined | null,
): string {
	if (!dateString) return "-";

	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return "-";

	const months = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];

	const day = date.getDate().toString().padStart(2, "0");
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");

	return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}
