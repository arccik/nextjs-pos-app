import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import Link from "next/link";
import AddNewUserButton from "./AddNewUserButton";
import Image from "next/image";

export default async function UserPage() {
  const users = await api.user.getAll();
  return (
    <main className="p-2">
      <Card>
        <div className="flex justify-between p-2">
          <CardHeader className="text-3xl font-bold text-slate-500">
            User List
          </CardHeader>
          <div>
            <AddNewUserButton />
          </div>
        </div>
        <CardContent>
          <p className="mb-4 text-sm text-slate-500">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
            hic magni soluta dolorem nulla.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      className="font-medium underline"
                      href={`/user/edit?id=${user.id}`}
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  {user.image && (
                    <TableCell className="flex justify-center">
                      <Image
                        className="rounded-lg shadow-lg"
                        src={user.image}
                        width={120}
                        height={100}
                        alt={user.name + " Image"}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
