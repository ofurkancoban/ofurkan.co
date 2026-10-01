// About page content lives in cv.json so it can be edited from the admin panel (/admin).
import data from "./cv.json";

type Row = { when: string; what: string; where: string };

export const CV = data as {
  cvUrl: string;
  bio: { lead: string; rest: string[] };
  education: Row[];
  experience: Row[];
  skills: { group: string; items: string[] }[];
  coursework: string[];
};
