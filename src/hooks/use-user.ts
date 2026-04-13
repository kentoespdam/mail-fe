import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/actions/auth";

export function useUser() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["user-profile"],
		queryFn: () => getUserProfile(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes
		retry: false,
	});

	return {
		user: data,
		isLoading,
		error,
	};
}
