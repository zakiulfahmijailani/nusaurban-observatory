import { getMetrics, getDatasetVersion } from '@/lib/data/repository';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const querySchema = z.object({
  city: z.string().min(1),
  from: z.coerce.number().optional(),
  to: z.coerce.number().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      city: searchParams.get('city'),
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
    };
    
    const { city, from, to } = querySchema.parse(query);
    
    const [metrics, versionData] = await Promise.all([
      getMetrics(city, from, to),
      getDatasetVersion()
    ]);
    
    return successResponse(metrics, {
      dataset_version: versionData?.version_key || 'published_2017_2025',
      reconciliation_status: versionData?.status || 'pending'
    });
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
