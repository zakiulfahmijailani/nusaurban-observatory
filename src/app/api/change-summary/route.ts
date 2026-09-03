import { getChangeSummary } from '@/lib/data/repository';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const querySchema = z.object({
  city: z.string().min(1).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      city: searchParams.get('city') || undefined,
    };
    
    const { city } = querySchema.parse(query);
    
    const summary = await getChangeSummary(city);
    
    return successResponse(summary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid parameters', 400);
    }
    return errorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal Server Error',
      500
    );
  }
}
