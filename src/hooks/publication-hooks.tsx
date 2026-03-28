import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	createPublication,
	deletePublication,
	fetchPublications,
	updatePublication,
} from "@/lib/publication-api";
import {
	type CreatePublicationPayload,
	CreatePublicationSchema,
	type PublicationDto,
	type PublicationFilter,
	type UpdatePublicationPayload,
} from "@/types/publication";

const QUERY_KEY = "publications";

export function usePublications(
	filter: PublicationFilter = {},
	offset = 0,
	limit = 20,
) {
	return useQuery({
		queryKey: [QUERY_KEY, filter, offset, limit],
		queryFn: () => fetchPublications(filter, offset, limit),
	});
}

export function useCreatePublication(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<CreatePublicationPayload>({
		resolver: zodResolver(CreatePublicationSchema),
		defaultValues: {
			title: "",
			description: "",
			documentTypeId: 0,
			publish: false,
		},
	});

	const mutation = useMutation({
		mutationFn: ({
			data,
			file,
		}: {
			data: CreatePublicationPayload;
			file?: File;
		}) => createPublication(data, file),
		onSuccess: () => {
			toast.success("Publikasi berhasil dibuat");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			form.reset();
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const onSubmit = (file?: File) =>
		form.handleSubmit((data) => mutation.mutate({ data, file }))();

	return { form, mutation, onSubmit };
}

export function useUpdatePublication(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<UpdatePublicationPayload>({
		resolver: zodResolver(CreatePublicationSchema),
		defaultValues: {
			title: "",
			description: "",
			documentTypeId: 0,
			publish: false,
		},
	});

	const mutation = useMutation({
		mutationFn: ({
			id,
			data,
			file,
		}: {
			id: number;
			data: UpdatePublicationPayload;
			file?: File;
		}) => updatePublication(id, data, file),
		onSuccess: () => {
			toast.success("Publikasi berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = (pub: PublicationDto) => {
		form.reset({
			title: pub.title,
			description: pub.description ?? "",
			documentTypeId: pub.documentTypeId,
			publish: pub.status === "PUBLISHED",
		});
	};

	const onSubmit = (id: number, file?: File) =>
		form.handleSubmit((data) => mutation.mutate({ id, data, file }))();

	return { form, mutation, populate, onSubmit };
}

export function useDeletePublication(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deletePublication(id),
		onSuccess: () => {
			toast.success("Publikasi berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
