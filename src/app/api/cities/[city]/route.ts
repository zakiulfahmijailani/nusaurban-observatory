import { getCityBySlug } from '@/lib/data/repository';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const paramsSchema = z.object({
  city: z.string().min(1),
});

export async function GET(
  request: Request,
  props: { params: Promise<{ city: string }> }
) {
  try {
    const rawParams = await props.params;
    const { city } = paramsSchema.parse(rawParams);
    const cityData = await getCityBySlug(city);
    
    if (!cityData) {
      return errorResponse('City not found', 404);
    }
    
    return successResponse(cityData);
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
