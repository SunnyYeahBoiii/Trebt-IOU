import { getUserName } from "../config/users";

/** @deprecated use getUserName from config/users instead */
export const idToName = getUserName;

export function idsToNames(ids: string | string[] | null | undefined): string {
  if (!ids) {
    return "";
  }

  const idList = Array.isArray(ids)
    ? ids
    : ids.split(",").map((id) => id.trim()).filter(Boolean);
  return idList.map(getUserName).join(", ");
}
