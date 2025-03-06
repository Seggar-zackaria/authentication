import { getUsers } from "@/lib/data";
import { PageWrapper } from "@/components/PageWrapper";
import { UsersTable } from "@/app/dashboard/_component/UsersTable";


export default async function CustomerPage() {
  const users = await getUsers();

  return (
    <PageWrapper>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UsersTable users={users} /> 
      </div>
    </PageWrapper>
  );
}
