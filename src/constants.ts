export const GENERIC_INTERNAL_ERROR = new Error("INTERNAL SERVER ERROR");
export const UNKNOWN_ERROR = new Error("UNKNOWN ERROR");
export enum OPERATION {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ZADD = "ZADD",
}
