"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Plus, Key, Search } from "lucide-react";

interface Credential {
  id: number;
  email: string;
  name: string;
  dob: string;
  employeeCode: string;
  department: string;
  designation: string;
  role: string;
}

const credentials: Credential[] = [
  {
    id: 1,
    email: "admin1@example.com",
    name: "Admin1",
    dob: "1990-01-01",
    employeeCode: "EMP001",
    department: "IT",
    designation: "Super Admin",
    role: "Super Admin",
  },
  {
    id: 2,
    email: "admin2@example.com",
    name: "Admin2",
    dob: "1995-05-15",
    employeeCode: "EMP002",
    department: "HR",
    designation: "Moderator",
    role: "Moderator",
  },
];

const CredentialsManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Credential | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleEdit = (user: Credential) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleResetPassword = async () => {
    alert("Password reset request sent!");
  };

  const filteredCredentials = credentials.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg rounded-3xl border border-white/10 dark:border-gray-800/50 shadow-2xl">
          <CardHeader className="flex flex-col gap-4 border-b border-white/10 dark:border-gray-800/50 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Credentials Management
              </CardTitle>
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  setOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg"
              >
                <Plus className="w-5 h-5" /> Add Admin
              </Button>
            </div>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by email, name, department, or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 border border-white/10 dark:border-gray-800/50 rounded-full bg-transparent backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table className="w-full text-left border-collapse mt-4">
              <TableHeader>
                <TableRow className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg">
                  <TableHead className="p-4">Email</TableHead>
                  <TableHead className="p-4">Name</TableHead>
                  <TableHead className="p-4">Department</TableHead>
                  <TableHead className="p-4">Designation</TableHead>
                  <TableHead className="p-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="border-b border-white/10 dark:border-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
                  >
                    <TableCell className="p-4">{user.email}</TableCell>
                    <TableCell className="p-4">{user.name}</TableCell>
                    <TableCell className="p-4">{user.department}</TableCell>
                    <TableCell className="p-4">{user.designation}</TableCell>
                    <TableCell className="p-4 text-right flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="w-5 h-5 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="w-5 h-5 text-red-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleResetPassword}>
                        <Key className="w-5 h-5 text-green-600" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={open} onOpenChange={(state) => {
        setOpen(state);
        if (!state) setSelectedUser(null);
      }}>
        <DialogContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 dark:border-gray-800/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {selectedUser ? "Edit Admin" : "Add Admin"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input placeholder="Email" defaultValue={selectedUser?.email || ""} />
            <Input placeholder="Name" defaultValue={selectedUser?.name || ""} />
            <Input type="date" placeholder="Date of Birth" defaultValue={selectedUser?.dob || ""} />
            <Input placeholder="Employee Code" defaultValue={selectedUser?.employeeCode || ""} />
            <Input placeholder="Department" defaultValue={selectedUser?.department || ""} />
            <Input placeholder="Designation" defaultValue={selectedUser?.designation || ""} />
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md">
              {selectedUser ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CredentialsManagement;
