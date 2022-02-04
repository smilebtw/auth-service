import { PrismaClient, Prisma } from '@prisma/client'

export interface Database extends PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> {
}
const database = new PrismaClient

export default database