import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {Card} from "@/components/ui/card" 

  import {User} from "@/lib/definitions"
  
  
  interface UsersTableProps {
    users: User[];
  }
  
export const DataTable = ({users}: UsersTableProps) => {
return (
    <Card className="p-4">
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </TableRow>
            ))}
          </TableBody>
        </Table>
    </Card>
    )
}  
