
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

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  parentName: string;
  parentEmail: string;
  registrationDate: string;
}

const Registration = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    section: "",
    parentName: "",
    parentEmail: "",
  });
  const { toast } = useToast();

  const generateStudentId = (classNum: string) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const classPrefix = classNum.padStart(2, "0");
    const sequence = (students.length + 1).toString().padStart(3, "0");
    return `${year}${classPrefix}${sequence}`;
  };

  const handleRegistration = () => {
    if (!newStudent.name || !newStudent.class || !newStudent.section) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const student: Student = {
      id: generateStudentId(newStudent.class),
      ...newStudent,
      registrationDate: new Date().toISOString(),
    };

    setStudents([...students, student]);
    setNewStudent({
      name: "",
      class: "",
      section: "",
      parentName: "",
      parentEmail: "",
    });
    toast({
      title: "Success",
      description: `Student registered successfully with ID: ${student.id}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Registration</h1>
          <p className="text-gray-500 mt-2">Register new students and manage registrations</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">New Student Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <Select
              value={newStudent.class}
              onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newStudent.section}
              onValueChange={(value) => setNewStudent({ ...newStudent, section: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C"].map((s) => (
                  <SelectItem key={s} value={s}>
                    Section {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Parent Name"
              value={newStudent.parentName}
              onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
            />
            <Input
              placeholder="Parent Email"
              type="email"
              value={newStudent.parentEmail}
              onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
            />
            <Button onClick={handleRegistration} className="md:col-span-2">
              Register Student
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">
                    ID: {student.id} | Class {student.class}-{student.section}
                  </p>
                  <p className="text-xs text-gray-400">
                    Parent: {student.parentName} ({student.parentEmail})
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(student.registrationDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Registration;
