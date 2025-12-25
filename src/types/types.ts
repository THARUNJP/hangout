import type { CallType } from "../lib/constant";

export type Participant = {
  id: string;
  name: string;
};


export type CallType =(typeof CallType)[keyof typeof CallType];