import { abVariantEnum } from '@/lib/db/schema'

export const VARIANTS = abVariantEnum.enumValues
export type Variant = (typeof VARIANTS)[number]
