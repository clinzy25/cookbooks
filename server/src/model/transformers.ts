import { ITagResult } from "../types/@types.tags";

export const transformTags = (sqlResult: ITagResult[]) =>
  sqlResult.map((result: ITagResult) => Object.values(result)[0])
