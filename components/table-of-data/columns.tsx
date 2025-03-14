"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Hotel } from "@/lib/definitions";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Badge } from "@/components/ui/badge";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {useLocation} from "@/hooks/useLocation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { deleteHotel } from "@/actions/hotel";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/table-of-data/Column-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export const columns: ColumnDef<Hotel>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="name" />
            )
        }
    },
    {
        header: "Rating",
        accessorKey: "rating",
        cell: ({ row }) => {
            const rating = row.original.rating
            return (
                <div className="text-left flex items-center gap-2">
                    <FaStar 
                        className={`w-4 h-4 ${rating > 0 ? 'text-yellow-500' : 'text-gray-400'}`} 
                    />
                    {rating}
                </div>
            )
        }
    },
    {
        accessorKey: "price",
        header: () => <div className="text-left">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("fr-DZ", {
                style: "currency",
                currency: "DZD",
            }).format(price)
            return <div className="text-left">{formatted}</div>
        }
    },
    {
        header: "Amenities",
        accessorKey: "amenities",
        cell: ({ row }) => {
            const amenities = row.original.amenities
            const amenitiesLength = amenities.length
            return <HoverCard>
                <HoverCardTrigger>
                    <Button variant="link" size="lg" className="text-left">{amenitiesLength} </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit flex flex-wrap gap-2 border border-neutral-400 rounded-md p-6 bg-muted text-primary">
                    {amenities.map((amenity) => (
                            <Badge key={amenity}>{amenity}</Badge>
                    ))}
                </HoverCardContent>
            </HoverCard>
        }
    },
    {
        header: "Country",
        accessorKey: "country",
        cell: ({ row }) => {
            const country = row.original.country
            return <div className="text-left">{country}</div>
        }
    },
    {
        header: "State",
        accessorKey: "state",
        cell: ({ row }) => {
            const { getStateByCode } = useLocation()
            const state = getStateByCode(row.original.country ?? '', row.original.state ?? '')
            return <div className="text-left">{state?.name}</div>
        }
    },
    {
        header: "City",
        accessorKey: "city",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const hotel = row.original
            return <div className="text-left">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="size-8 p-0 inline-flex items-center justify-center rounded-md border border-transparent hover:bg-neutral-100 hover:border hover:border-neutral-400">
                            <span className="sr-only">open menu</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(hotel?.name || "")
                            }}
                        >
                            Copy hotel name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/hotel/edit/${hotel.id}`}>
                            <DropdownMenuItem>
                                    Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e)=> e.preventDefault()}>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <span>
                                        Delete
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the hotel.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={async () => {
                                                if (!hotel.id) return;
                                                const result = await deleteHotel(hotel.id);
                                                if (!result.success) {
                                                    alert(result.message);
                                                }
                                            }}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        }
    }
]