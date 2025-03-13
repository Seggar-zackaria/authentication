import { auth } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { redirect } from "next/navigation";
import { PageWrapper } from "@/components/PageWrapper";
import {FlightCount, getUsers, HotelCount, UserCount, getUserCountsByMonth } from '@/lib/data'
import {Users, Plane, Hotel} from "lucide-react" 
import { StatsCard } from "./_component/StaticCard";
import { Chart } from "./_component/chart-area-stacked";
import {DataTable} from "./_component/dataTable"
export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

export default async function DashboardPage() {

  const users = await getUsers();


  const session = await auth();
  if (!session) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }

  const userCount = await UserCount();
  const flightBookingsCount = await FlightCount()
  const hotelBookingsCount = await HotelCount()
  const userCounts = await getUserCountsByMonth();
  return (
    <PageWrapper>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="Total Users"
          value={userCount}
          icon={<Users className="size-4" />}
        />
        <StatsCard 
          title="Flight Bookings"
          value={flightBookingsCount}
          icon={<Plane className="size-4" />}
        />
        <StatsCard 
          title="Hotel Bookings"
          value={hotelBookingsCount}
          icon={<Hotel className="size-4" />}
        />
      </div>
      <section className="grid lg:grid-cols-2 gap-4">
        <Chart data={userCounts} />
        {/* <DataTable users={users}/> */}
      </section>
    </PageWrapper>
  );
}
