import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDirtyValues<T extends Record<string, unknown>>(
  data: T,
  dirtyFields: Partial<Record<keyof T, boolean>>
): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => dirtyFields[key as keyof T])
  ) as Partial<T>
}
