import type { AppwriteRole, Permission } from "@/types/auth";

export const ROLE_PERMISSIONS: Record<AppwriteRole, Permission[]> = {
	SYSTEM: [
		"menu:dashboard",
		"menu:persuratan",
		"menu:arsip_surat",
		"menu:publikasi",
		"menu:master",
		"publikasi:write",
	],
	ADMIN: [
		"menu:dashboard",
		"menu:persuratan",
		"menu:arsip_surat",
		"menu:publikasi",
		"publikasi:write",
	],
	USER: ["menu:dashboard", "menu:persuratan", "menu:publikasi"],
};

export const ROLE_PRIORITY: Record<AppwriteRole, number> = {
	SYSTEM: 1,
	ADMIN: 2,
	USER: 3,
};

export const ROLE_DISPLAY_NAMES: Record<AppwriteRole, string> = {
	SYSTEM: "Sistem",
	ADMIN: "Administrator",
	USER: "Pengguna",
};

/**
 * Checks if a user with the given roles has a specific permission.
 */
export function hasPermission(
	roles: AppwriteRole[],
	permission: Permission,
): boolean {
	return roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

/**
 * Returns the join permissions from all roles.
 */
export function getAllPermissions(roles: AppwriteRole[]): Permission[] {
	const permissions = new Set<Permission>();
	for (const role of roles) {
		for (const p of ROLE_PERMISSIONS[role]) {
			permissions.add(p);
		}
	}
	return Array.from(permissions);
}

/**
 * Returns the display name for the highest priority role.
 */
export function getJabatan(roles: AppwriteRole[]): string {
	if (roles.length === 0) return ROLE_DISPLAY_NAMES.USER;

	const highestRole = roles.reduce((prev, curr) => {
		return ROLE_PRIORITY[curr] < ROLE_PRIORITY[prev] ? curr : prev;
	});

	return ROLE_DISPLAY_NAMES[highestRole];
}
