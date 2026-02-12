import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const applicationSchema = z.object({
  applicationId: z.uuidv7(),
  leadId: z.uuidv7(),
  propertyId: z.uuidv7(),
  status: z.string().max(25),
  notes: z.string().nullable(),
  createdAt: z.date(),
  reviewStartedAt: z.string().nullable(),
  approvedAt: z.string().nullable(),
  rejectedAt: z.string().nullable(),
  rejectedReason: z.string().nullable(),
  withdrawnAt: z.string().nullable(),
  withdrawnReason: z.string().nullable(),
  contractSignedAt: z.string().nullable(),
  leadName: z.string().max(200).nullable(),
  propertyAddress: z.string().max(1000).nullable(),
});

export type Application = z.infer<typeof applicationSchema>;

export const addApplicationSchema = applicationSchema.omit({
  applicationId: true,
  status: true,
  notes: true,
  createdAt: true,
  reviewStartedAt: true,
  approvedAt: true,
  rejectedAt: true,
  rejectedReason: true,
  withdrawnAt: true,
  withdrawnReason: true,
  contractSignedAt: true,
  leadName: true,
  propertyAddress: true,
});

export type AddApplication = z.infer<typeof addApplicationSchema>;

export const editApplicationSchema = z.object({
  applicationId: z.uuidv7(),
  notes: z.string().nullable(),
});

export type EditApplication = z.infer<typeof editApplicationSchema>;

export const startReviewApplicationSchema = z.object({
  reviewStartedAt: z.string().min(1),
});

export type StartReviewApplication = z.infer<
  typeof startReviewApplicationSchema
>;

export const approveApplicationSchema = z.object({
  approvedAt: z.string().min(1),
});

export type ApproveApplication = z.infer<typeof approveApplicationSchema>;

export const rejectApplicationSchema = z.object({
  rejectedReason: z.string().min(1),
  rejectedAt: z.string().min(1),
});

export type RejectApplication = z.infer<typeof rejectApplicationSchema>;

export const withdrawApplicationSchema = z.object({
  withdrawnReason: z.string().min(1),
  withdrawnAt: z.string().min(1),
});

export type WithdrawApplication = z.infer<typeof withdrawApplicationSchema>;

export const signContractApplicationSchema = z.object({
  contractSignedAt: z.string().min(1),
});

export type SignContractApplication = z.infer<
  typeof signContractApplicationSchema
>;

export const listApplicationsSchema = paginationSchema.extend({
  propertyId: z.uuidv7().optional(),
  leadId: z.uuidv7().optional(),
  startCreatedAt: z.string().optional(),
});

export type ListApplications = z.infer<typeof listApplicationsSchema>;
