"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Custom hook to synchronize state with URL query parameters.
 *
 * @param key The query parameter key.
 * @param defaultValue The default value if the query parameter is not present.
 * @param options.parse Function to parse the string value from the URL.
 * @param options.serialize Function to serialize the value to a string for the URL.
 * @returns A tuple [state, setState] similar to useState.
 */
export function useQueryState<T>(
	key: string,
	defaultValue: T,
	options: {
		parse: (value: string | null) => T;
		serialize: (value: T) => string | undefined;
	},
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const state = useMemo(() => {
		const value = searchParams.get(key);
		return value !== null ? options.parse(value) : defaultValue;
	}, [searchParams, key, defaultValue, options.parse]);

	const setState = useCallback(
		(newValue: T | ((prev: T) => T)) => {
			const nextValue =
				typeof newValue === "function"
					? (newValue as (prev: T) => T)(state)
					: newValue;

			const params = new URLSearchParams(searchParams.toString());
			const serializedValue = options.serialize(nextValue);

			if (serializedValue === undefined || serializedValue === "") {
				params.delete(key);
			} else {
				params.set(key, serializedValue);
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[router, pathname, searchParams, key, state, options.serialize],
	);

	return [state, setState] as const;
}

/**
 * Hook to manage multiple query parameters at once to avoid race conditions.
 */
export function useQueryStates() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setStates = useCallback(
		(updates: Record<string, string | number | undefined | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (value === undefined || value === null || value === "") {
					params.delete(key);
				} else {
					params.set(key, String(value));
				}
			}
			router.replace(`${pathname}?${params.toString()}`);
		},
		[router, pathname, searchParams],
	);

	return { searchParams, setStates };
}

// Helper parsers and serializers
export const queryParsers = {
	string: (v: string | null) => v ?? "",
	number: (v: string | null) => (v ? Number.parseInt(v, 10) : 0),
	optionalString: (v: string | null) => v ?? undefined,
};

export const querySerializers = {
	string: (v: string) => v || undefined,
	number: (v: number) => String(v),
	optionalString: (v: string | undefined) => v,
};
