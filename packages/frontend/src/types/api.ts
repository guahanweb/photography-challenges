export interface ApiItemResponse<T> {
  success: boolean;
  data: {
    item: T;
    success: boolean;
    error?: string;
  };
}

export interface ApiListResponse<T> {
  success: boolean;
  data: {
    items: T[];
    success: boolean;
    lastEvaluatedKey?: Record<string, unknown>;
    error?: string;
  };
}
