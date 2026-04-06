import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a value with a specified delay.
 * Returns the debounced value after the delay has passed without changes.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delayMs);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delayMs]);

	return debouncedValue;
}
