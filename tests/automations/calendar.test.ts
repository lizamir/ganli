import { describe, expect, it } from "vitest";
import { calendarTimes, googleCalendarLink, icsBody, waLink, waPhone } from "@/lib/automations/calendar";

const booking = {
  id: "b1",
  name: "דנה",
  phone: "050-1234567",
  date: "2026-11-08",
  time: "08:30",
  topic: "היכרות",
  created: "",
};

describe("calendar", () => {
  it("computes the meeting's start and end", () => {
    expect(calendarTimes("2026-11-08", "08:30", 30)).toEqual({ start: "20261108T083000", end: "20261108T090000" });
  });

  it("writes an invitation with a reminder a day before", () => {
    const ics = icsBody(booking);
    expect(ics).toContain("DTSTART;TZID=Asia/Jerusalem:20261108T083000");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });

  it("links to Google Calendar", () => {
    expect(googleCalendarLink(booking)).toContain("dates=20261108T083000%2F20261108T090000");
  });
});

describe("whatsapp", () => {
  it("encodes the text", () => {
    expect(waLink("שלום עולם", "972501234567")).toBe(
      `https://wa.me/972501234567?text=${encodeURIComponent("שלום עולם")}`,
    );
  });

  it("converts an Israeli number to international format", () => {
    expect(waPhone("050-1234567")).toBe("972501234567");
  });
});
