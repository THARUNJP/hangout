export type Participant = {
  id: string;
  name: string;
};

export const CallType = {
  RTC: "RTC",
  SFU: "SFU",
} as const;

export type CallType =(typeof CallType)[keyof typeof CallType];