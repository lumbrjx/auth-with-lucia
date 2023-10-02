import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

const prismaClient = new PrismaClient();

export default prismaClient;
