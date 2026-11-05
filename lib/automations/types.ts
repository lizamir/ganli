export type Booking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  topic: string;
  created: string;
};
export type Signup = { id: string; title: string; deadline: string; signed: string[] };
export type LogItem = { id: string; at: string; text: string };
export type AutoState = { bookings: Booking[]; signups: Signup[]; log: LogItem[]; on: Record<string, boolean> };
