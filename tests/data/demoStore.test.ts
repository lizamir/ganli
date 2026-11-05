import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoActions, readDemo } from "@/lib/data/demoStore";
import { createDemoSnapshot } from "@/lib/mock/demoSnapshot";

beforeEach(() => {
  vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {} });
  demoActions.reset?.();
});

describe("demo actions", () => {
  it("adds a care event", async () => {
    const before = readDemo().data.events.length;
    await demoActions.addEvent({ childId: "k1", kind: "meal", start: "10:00", title: "ארוחה", detail: "" });
    expect(readDemo().data.events).toHaveLength(before + 1);
  });

  it("never records more than the amount of a charge", async () => {
    const charge = readDemo().data.charges[0];
    await demoActions.recordPayment(charge.id, charge.amount * 10);
    expect(readDemo().data.charges[0].paid).toBe(charge.amount);
  });

  it("marks a child absent when the parent reports it", async () => {
    await demoActions.sendInquiry({ kind: "absence", text: "לא מגיעה", childId: "k1" });
    expect(readDemo().data.children.find((c) => c.id === "k1")?.status).toBe("absent");
  });

  it("changing an answer moves the count", async () => {
    const event = createDemoSnapshot().upcoming.find((u) => u.rsvp)!;
    await demoActions.setRsvp(event.id, "yes");
    await demoActions.setRsvp(event.id, "no");
    const after = readDemo().data.upcoming.find((u) => u.id === event.id)!.rsvp!;
    expect(after.mine).toBe("no");
    expect(after.going).toBe(event.rsvp!.going);
    expect(after.notGoing).toBe(event.rsvp!.notGoing + 1);
  });

  it("collects a child with the time of checkout", async () => {
    await demoActions.checkOut("k1", "דנה");
    const data = readDemo().data;
    const child = data.children.find((c) => c.id === "k1")!;
    expect(child.status).toBe("left");
    expect(child.pickup).toBe(data.now);
  });
});
