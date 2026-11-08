"use client";

import AttendanceChart from "@/components/dashboard/care/AttendanceChart";
import CoverageCard from "@/components/dashboard/admin/overview/CoverageCard";
import PaymentsCard from "@/components/dashboard/admin/overview/PaymentsCard";
import StatTiles from "@/components/dashboard/admin/overview/StatTiles";
import TodoCard from "@/components/dashboard/admin/overview/TodoCard";
import UpcomingCard from "@/components/dashboard/admin/overview/UpcomingCard";
import { Card, PageHead } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";
import { paymentBreakdown } from "@/lib/domain/finance";

/** The director's overview of the day. */
export default function AdminHome() {
  const { data } = useGanli();
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present" || c.status === "left");
  const absent = data.children.filter((c) => c.status === "absent");
  const { month, paid, late, pending } = paymentBreakdown(data.charges, data.currentPeriod);
  const openInquiries = data.inquiries.filter((q) => !q.done);
  const consentMissing = data.children.filter((c) => c.consentMissing);

  return (
    <>
      <PageHead kicker={`${data.dayLabel} · ${data.now}`} title={data.institution} />

      <StatTiles
        data={data}
        present={present.length}
        absent={absent.length}
        openInquiries={openInquiries.length}
        paid={paid.length}
        billed={month.length}
      />

      <div className="grid grid-cols-[repeat(2,1fr)] gap-5 narrow:grid-cols-[1fr]">
        <CoverageCard data={data} />
        <PaymentsCard data={data} />
        <TodoCard consentMissing={consentMissing} unpaid={[...pending, ...late]} openInquiries={openInquiries} />
        <Card title="נוכחות השבוע" note="ילדים שהגיעו בכל יום">
          <AttendanceChart week={data.attendanceWeek} />
        </Card>
        <UpcomingCard upcoming={data.upcoming} />
      </div>
    </>
  );
}
