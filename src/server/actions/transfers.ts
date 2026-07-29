"use server";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { z } from "zod";
export async function createStockTransfer(formData: FormData) { try { const data=z.object({toBranchId:z.string().min(1),transferNote:z.string().optional()}).parse(Object.fromEntries(formData)); const t=await getCurrentTenant(); if(data.toBranchId===t.branchId)return{success:false as const,error:"Choose a different destination branch."}; const branch=await prisma.branch.findFirst({where:{id:data.toBranchId,organisationId:t.organisationId,isActive:true}}); if(!branch)return{success:false as const,error:"Invalid destination branch."}; await prisma.stockTransfer.create({data:{organisationId:t.organisationId,fromBranchId:t.branchId,toBranchId:data.toBranchId,sentById:t.userId??"system",transferNote:data.transferNote}}); revalidatePath("/transfers");return{success:true as const}}catch{return{success:false as const,error:"Unable to create transfer."}} }
