
import { parseBool, parseContactType } from "./parseContactsFilterParams.js";

export default function parseContactsFilter({isFavourite , contactType}) {
  const parsedIsFavourite = parseBool(isFavourite);
  const parsedType = parseContactType(contactType);


  return {isFavourite: parsedIsFavourite , contactType: parsedType};
}
