import {SORT_ORDER} from '../constants/index.js';

export default function parseSortParams({sortBy , sortFields  ,  sortOrder}) {

  const parsedSortOrder = SORT_ORDER.includes(sortOrder) ? sortOrder : SORT_ORDER[0];
  const parsedSortBy =  sortFields.includes(sortBy) ? sortBy : "_id";

  return {sortOrder: parsedSortOrder , sortBy: parsedSortBy};
}
