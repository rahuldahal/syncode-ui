import axios, { AxiosResponse } from 'axios';

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface QueryOptions<T> {
  method: Methods;
  endpoint: string;
  accessToken?: string;
  expectedStatus: number;
  beforeStart?: () => void;
  onSuccess: (data: T) => void;
  onError: (error: any) => void;
  afterDone?: () => void;
}

export async function query<T>(
  {
    method,
    endpoint,
    accessToken,
    expectedStatus,
    beforeStart,
    onSuccess,
    onError,
    afterDone,
  }: QueryOptions<T>,
  { body }: { body: any },
): Promise<void> {
  if (beforeStart) beforeStart();

  try {
    const fullEndpoint = `${import.meta.env.VITE_API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response: AxiosResponse<T>;

    switch (method) {
      case 'GET':
        response = await axios.get<T>(fullEndpoint, { headers });
        break;
      case 'POST':
        response = await axios.post<T>(fullEndpoint, body, { headers });
        break;
      case 'PATCH':
        response = await axios.patch<T>(fullEndpoint, body, { headers });
        break;
      case 'PUT':
        response = await axios.put<T>(fullEndpoint, body, { headers });
        break;
      case 'DELETE':
        response = await axios.delete<T>(fullEndpoint, { headers });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    const responseData = response.data;

    if (response.status === expectedStatus) {
      onSuccess(responseData);
    } else {
      onError(responseData);
    }
  } catch (error) {
    console.error('Error during request:', error);
    onError(error);
  } finally {
    if (afterDone) afterDone();
  }
}
