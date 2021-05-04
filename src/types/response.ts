
export interface GeneralResponse<T> {
    code: string;
    message: string;
    data: T
}