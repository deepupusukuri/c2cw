import { Prisma } from "@prisma/client";

// Prisma's InputJsonValue rejects plain interfaces/arrays typed with an index
// signature mismatch even though they're valid JSON at runtime — this cast
// point keeps that friction out of every service that writes a Json column.
export function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
