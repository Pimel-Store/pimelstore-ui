export interface ApiResponse<T> {
    message: string;
    pagination?: string;
    data: T;
}
