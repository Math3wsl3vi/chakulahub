"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    const unsubscribe = onSnapshot(collection(db, "users"), snapshot => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 font-bab">
      <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
      <p className="mb-6 text-muted-foreground">Total: {users.length} users</p>

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
