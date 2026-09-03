import { getMetricsByCityAndYear, getDatasetVersion } from '@/lib/data/repository';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { z } from 'zod';

const paramsSchema = z.object({
  city: z.string().min(1),
  year: z.coerce.number(),
});

export async function GET(
  request: Request,
  props: { params: Promise<{ city: string; year: string }> }
) {
  try {
    const rawParams = await props.params;
    const { city, year } = paramsSchema.parse(rawParams);
    
    const [metrics, versionData] = await Promise.all([
      getMetricsByCityAndYear(city, year),
      getDatasetVersion()
    ]);
    
    if (!metrics) {
      return errorResponse('Metrics not found', 404);
    }
    
    return successResponse(metrics, {
      dataset_version: versionData?.version_key || 'published_2017_2025',
      reconciliation_status: metrics.reconciliation_status || versionData?.status || 'pending'
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
