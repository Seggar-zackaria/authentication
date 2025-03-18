import { getHotelList } from "@/lib/data";
import { columns } from "@/components/table-of-data/columns";
import { DataTable } from "@/components/table-of-data/data-table";
import { PageWrapper } from "@/components/PageWrapper";

export default async function HotelPage() {
  const hotel = await getHotelList();

  return (
    <>
      
      <PageWrapper >
        <DataTable columns={columns} data={hotel}/>
      </PageWrapper>
    </>
  );
}
