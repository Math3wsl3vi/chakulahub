"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/configs/firebaseConfig";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  // Count users by userType
  const userTypeCounts = users.reduce<Record<string, number>>((acc, user) => {
    const type = user.userType?.toLowerCase() || "unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 font-bab">
      <h1 className="text-2xl font-bold mb-2">Registered Users</h1>
      <p className="mb-2 text-muted-foreground">Total: {users.length} users</p>

      {/* User type summary */}
      <div className="mb-4 text-sm text-gray-700 space-y-1 grid grid-cols-3 w-1/3 border">
        {Object.entries(userTypeCounts).map(([type, count]) => (
          <div key={type} className="border-r p-2 flex items-center justify-center">
            <strong className="capitalize">{type}</strong>: {count} user{count > 1 ? "s" : ""}
          </div>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>User Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name || "N/A"}</TableCell>
              <TableCell>{user.email || "N/A"}</TableCell>
              <TableCell>{user.userType || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsersPage;
