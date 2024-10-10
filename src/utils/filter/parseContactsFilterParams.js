import { enumContactType } from "../../constants/contacts.js";

export function parseNumber(value) {
  if(typeof value !== "string") return;

  const parsedInteger = parseInt(value);
  if(Number.isNaN(parsedInteger)) return;

  return parsedInteger;
}
export function parseBool(value) {
  if(typeof value !== "string") return;

  console.log(value);

  // const parsedBool = Boolean(value);
  // console.log("🚀 ~ parseBool ~ parsedBool:", parsedBool);
  if(value === "true" || value === "false") return value;

  return;
}
export function parseContactType(value) {
  if(typeof value !== "string") return;
  const parsedContactsType = enumContactType.includes(value);
  if(!parsedContactsType) return;
  return value;
}
