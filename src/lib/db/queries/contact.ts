import { db } from '../index'
import { contactSubmissions } from '../schema'
import type { NewContactSubmission } from '../schema'

export async function insertContact(data: NewContactSubmission) {
  const [inserted] = await db
    .insert(contactSubmissions)
    .values(data)
    .returning()
  return inserted
}
