import { DateTime } from "luxon";

export const formatedDate = (date: string, timestamp?: boolean) => {
  let dateFormated = timestamp
    ? DateTime.fromMillis(Number(date))
    : DateTime.fromISO(date);

  return dateFormated.setZone(`America/New_York`).toFormat(`MM-dd-yy hh:mm a`);

};
