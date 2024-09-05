// import { z } from "zod";
// import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// import {
//   getSalesByDate,
//   getSalesByRange,
//   getSalesByProduct,
//   getSalesByCategory,
//   getSalesByLocation,
//   getSalesByPaymentMethod,
//   getSalesByTimeOfDay,
//   getRevenueVsProfit,
//   getCustomerLifetimeValue,
//   getAverageOrderValue,
//   getCustomerRetentionRate,
//   getCustomerSegmentation,
//   getInventoryTurnover,
//   getStockLevel,
//   getOutOfStockAlerts,
//   getOverstockReports,
//   getTopSellingProducts,
//   getDeadStockReports,
//   getEmployeeSales,
//   getEmployeeEfficiency,
//   getGrossProfitMargin,
//   getNetProfitMargin,
//   getDiscountImpact,
//   getTaxAnalysis,
//   getCOGS,
// } from "@/server/models/analytics";

// export const analyticsRouter = createTRPCRouter({
//   // Sales Data Analytics
//   getSalesByDate: protectedProcedure
//     .input(z.object({ date: z.date() }))
//     .query(async ({ input }) => await getSalesByDate(input.date)),

//   getSalesByRange: protectedProcedure
//     .input(z.object({ startDate: z.date(), endDate: z.date() }))
//     .query(async ({ input }) => await getSalesByRange(input)),

//   getSalesByProduct: protectedProcedure
//     .input(z.object({ productId: z.string() }))
//     .query(async ({ input }) => await getSalesByProduct(input.productId)),

//   getSalesByCategory: protectedProcedure
//     .input(z.object({ categoryId: z.string() }))
//     .query(async ({ input }) => await getSalesByCategory(input.categoryId)),

//   getSalesByLocation: protectedProcedure
//     .input(z.object({ locationId: z.string() }))
//     .query(async ({ input }) => await getSalesByLocation(input.locationId)),

//   getSalesByPaymentMethod: protectedProcedure
//     .input(z.object({ paymentMethod: z.string() }))
//     .query(
//       async ({ input }) => await getSalesByPaymentMethod(input.paymentMethod),
//     ),

//   getSalesByTimeOfDay: protectedProcedure
//     .input(z.object({ timeOfDay: z.string() }))
//     .query(async ({ input }) => await getSalesByTimeOfDay(input.timeOfDay)),

//   getRevenueVsProfit: protectedProcedure
//     .input(
//       z.object({
//         dateRange: z.object({ startDate: z.date(), endDate: z.date() }),
//       }),
//     )
//     .query(async ({ input }) => await getRevenueVsProfit(input.dateRange)),

//   // Customer Analytics
//   getCustomerLifetimeValue: protectedProcedure
//     .input(z.object({ customerId: z.string() }))
//     .query(
//       async ({ input }) => await getCustomerLifetimeValue(input.customerId),
//     ),

//   getAverageOrderValue: protectedProcedure
//     .input(z.object({ customerId: z.string().optional() }))
//     .query(async ({ input }) => await getAverageOrderValue(input.customerId)),

//   getCustomerRetentionRate: protectedProcedure
//     .input(
//       z.object({
//         dateRange: z.object({ startDate: z.date(), endDate: z.date() }),
//       }),
//     )
//     .query(
//       async ({ input }) => await getCustomerRetentionRate(input.dateRange),
//     ),

//   getCustomerSegmentation: protectedProcedure
//     .input(z.object({ segmentCriteria: z.string() }))
//     .query(
//       async ({ input }) => await getCustomerSegmentation(input.segmentCriteria),
//     ),

//   // Inventory Analytics
//   getInventoryTurnover: protectedProcedure
//     .input(z.object({ productId: z.string().optional() }))
//     .query(async ({ input }) => await getInventoryTurnover(input.productId)),

//   getStockLevel: protectedProcedure
//     .input(z.object({ productId: z.string() }))
//     .query(async ({ input }) => await getStockLevel(input.productId)),

//   getOutOfStockAlerts: protectedProcedure.query(
//     async () => await getOutOfStockAlerts(),
//   ),

//   getOverstockReports: protectedProcedure.query(
//     async () => await getOverstockReports(),
//   ),

//   getTopSellingProducts: protectedProcedure.query(
//     async () => await getTopSellingProducts(),
//   ),

//   getDeadStockReports: protectedProcedure.query(
//     async () => await getDeadStockReports(),
//   ),

//   // Employee Performance Analytics
//   getEmployeeSales: protectedProcedure
//     .input(z.object({ employeeId: z.string() }))
//     .query(async ({ input }) => await getEmployeeSales(input.employeeId)),

//   getEmployeeEfficiency: protectedProcedure
//     .input(z.object({ employeeId: z.string() }))
//     .query(async ({ input }) => await getEmployeeEfficiency(input.employeeId)),

//   // Financial Analytics
//   getGrossProfitMargin: protectedProcedure
//     .input(
//       z.object({
//         dateRange: z.object({ startDate: z.date(), endDate: z.date() }),
//       }),
//     )
//     .query(async ({ input }) => await getGrossProfitMargin(input.dateRange)),

//   getNetProfitMargin: protectedProcedure
//     .input(
//       z.object({
//         dateRange: z.object({ startDate: z.date(), endDate: z.date() }),
//       }),
//     )
//     .query(async ({ input }) => await getNetProfitMargin(input.dateRange)),

//   getDiscountImpact: protectedProcedure
//     .input(z.object({ discountCode: z.string().optional() }))
//     .query(async ({ input }) => await getDiscountImpact(input.discountCode)),

//   getTaxAnalysis: protectedProcedure
//     .input(
//       z.object({
//         dateRange: z.object({ startDate: z.date(), endDate: z.date() }),
//       }),
//     )
//     .query(async ({ input }) => await getTaxAnalysis(input.dateRange)),

//   getCOGS: protectedProcedure
//     .input(
//       z.object({
//         dateRange: z.object({ startDate: z.date(), endDate: z.date() }),
//       }),
//     )
//     .query(async ({ input }) => await getCOGS(input.dateRange)),
// });
