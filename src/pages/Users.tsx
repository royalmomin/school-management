
import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "parent";
  status: "active" | "inactive";
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
    },
  ]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "teacher" as const,
  });
  const { toast } = useToast();

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: "active",
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "teacher" });
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === "active" ? "inactive" : "active",
        };
      }
      return user;
    }));
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">Add and manage system users</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Select
              value={newUser.role}
              onValueChange={(value: "admin" | "teacher" | "parent") =>
                setNewUser({ ...newUser, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUser} className="md:col-span-3">
              Add User
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toggleUserStatus(user.id)}
                  className={user.status === "active" ? "text-red-600" : "text-green-600"}
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;
