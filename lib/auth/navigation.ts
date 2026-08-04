import { NAVIGATION_ITEMS, NavigationItem } from "@/constants/navigation";
import { UserRoleType } from "@/constants/roles";

/**
 * Dynamically builds and filters the navigation items based on the user's role.
 * Does not use switch statements or multiple if/else blocks.
 *
 * @param role The authenticated user's role
 * @returns Filtered navigation items for the given role
 */
export function buildNavigation(role?: UserRoleType | null): NavigationItem[] {
  if (!role) {
    return [];
  }

  return NAVIGATION_ITEMS
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      if (!item.children) {
        return item;
      }

      return {
        ...item,
        children: item.children.filter((child) => child.roles.includes(role)),
      };
    });
}
