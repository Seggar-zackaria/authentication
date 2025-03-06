"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon} from "lucide-react";
import { useState } from "react";
import {User} from "@/lib/definitions"
  
  
  interface UsersTableProps {
    users: User[];
  }
  
  export function UsersTable({ users }: UsersTableProps) {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const filteredUsers = users.filter((user)=>{
      const searchLower = searchTerm.toLowerCase();
      return(
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)

      )
    })

    const handleSearch =(e: React.FormEvent) => {
        e.preventDefault()
    }
    return (
      <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between space-x-2">
        <div>
          <Input type="text" placeholder="Search" onChange={(e)=> setSearchTerm(e.target.value)} />
        </div>
        <Button variant="outline" size={'lg'}>
          <PlusIcon />
           Add User
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    );
  }