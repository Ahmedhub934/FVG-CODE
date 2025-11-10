import { z } from 'zod';

const RequestFormaSchema = z.object({
  memberId: z.string().min(1),
  memberName: z.string().min(1),
  requestDetails: z.string().min(1),
});

export type RequestForma = z.infer<typeof RequestFormaSchema>;

export function buildRequestForma(input: unknown): RequestForma {
  const parsed = RequestFormaSchema.parse(input);
  return parsed;
}
