import { DataTable } from "@/app/components/data-table/data-table"
import { bookingColumns } from "@/app/components/data-table/columns"
import { type Booking } from "@/app/components/data-table/columns"

export default function BookingsPage() {
  // Example data
  const bookingsData: Booking[] = [
    {
      id: "1",
      customerName: "John Doe",
      destination: "Paris",
      date: "2024-04-01",
      status: "confirmed" as const,
      amount: 1200
    },
    // ... more bookings
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTable<Booking>
        columns={bookingColumns}
        data={bookingsData}
        searchKey="customerName"
        searchPlaceholder="Search customers..."
      />
    </div>
  )
} 