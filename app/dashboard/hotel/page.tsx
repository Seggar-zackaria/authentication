import { getHotelList } from "@/lib/data";
import { columns } from "@/components/table-of-data/columns";
import { DataTable } from "@/components/table-of-data/data-table";

export default async function HotelPage() {
  const hotel = await getHotelList();

  return (
    <>
      
      <div className="mx-auto py-10 container">
        <DataTable columns={columns} data={hotel}/>
      </div>
    </>
  );
}
