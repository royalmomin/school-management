
import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, QrCode, Fingerprint, Wifi } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  class: string;
  markedAt?: string;
}

const students: Student[] = [
  { id: "1", name: "John Doe", class: "Class 10A", markedAt: "09:00 AM" },
  { id: "2", name: "Jane Smith", class: "Class 10A" },
  { id: "3", name: "Mike Johnson", class: "Class 10B", markedAt: "08:45 AM" },
];

const tabs = [
  { id: "manual", label: "Manual Entry", icon: Search },
  { id: "qr", label: "QR Scanner", icon: QrCode },
  { id: "biometric", label: "Biometric", icon: Fingerprint },
  { id: "rfid", label: "RFID", icon: Wifi },
];

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAttendance = (studentId: string, status: "present" | "absent") => {
    toast({
      title: "Attendance Marked",
      description: `Student ${studentId} marked as ${status}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-gray-500 mt-2">Mark and manage student attendance</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>
          
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {activeTab === "manual" && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.class}</p>
                      {student.markedAt && (
                        <p className="text-xs text-gray-400">
                          Marked at {student.markedAt}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                        onClick={() => markAttendance(student.id, "present")}
                      >
                        Present
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        onClick={() => markAttendance(student.id, "absent")}
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="text-center py-12 text-gray-500">
              QR Scanner functionality coming soon
            </div>
          )}

          {activeTab === "biometric" && (
            <div className="text-center py-12 text-gray-500">
              Biometric functionality coming soon
            </div>
          )}

          {activeTab === "rfid" && (
            <div className="text-center py-12 text-gray-500">
              RFID functionality coming soon
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Attendance;
