import { getHealthStatus } from '@/lib/data/repository';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const status = await getHealthStatus();
    return successResponse(status);
  } catch (error) {
    return errorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal Server Error',
      500
    );
  }
}
