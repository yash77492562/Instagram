import { PrismaClient } from "@prisma/client";

const prismaClientSingleton=()=>{
    return new PrismaClient()
}

declare global{
    var prismaGlobal:ReturnType<typeof prismaClientSingleton>|undefined;
}
const prisma: ReturnType<typeof prismaClientSingleton> =
    globalThis.prismaGlobal?? prismaClientSingleton();

if(process.env.NODE_ENV ! == "production"){
    globalThis.prismaGlobal = prisma
}

export {prisma}