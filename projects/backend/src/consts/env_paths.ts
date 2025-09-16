import path from "path";

export const ENV_PATHS: 
  {
    ROOT: string; 
    BACKEND: string
  } 
  = 
  {
    ROOT: path.resolve(__dirname, '../../../../.env'),
    BACKEND: path.resolve(__dirname, '../../.env'),
  };