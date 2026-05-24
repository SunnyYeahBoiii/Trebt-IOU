export const USERS = {
  "1": "Phương",
  "2": "Pha",
  "3": "Thịnh",
  "4": "Tuấn",
} as const;

export type UserId = keyof typeof USERS;

export function getUserName(id: string): string {
  return USERS[id as UserId] ?? id;
}

export function getUserIds(): UserId[] {
  return Object.keys(USERS) as UserId[];
}

export function getUserEntries(): [UserId, string][] {
  return Object.entries(USERS) as [UserId, string][];
}
