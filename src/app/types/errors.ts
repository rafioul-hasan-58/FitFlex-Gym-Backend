export type TErrorSources = {
    path: string | number;
    message: string;
  }[];
export type TZodErrorSources = {
    field: string | number;
    message: string;
  }[];
  
  export type TZodGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorDetails: TZodErrorSources;
  };
  export type TGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorDetails: TErrorSources;
  };
  