export interface ListJobInputDto {
  /*** filter by ***/
  firstName?: string;
  lastName?: string;
  //.... others
  /*** order by ***/
  orderBy?: string;
  sortBy?: string;
  /*** pagination ***/
  pageSize?: number;
  offset?: number;
}
