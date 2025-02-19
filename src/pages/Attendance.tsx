import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, QrCode, Fingerprint, Wifi, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QrScanner from 'react-qr-scanner';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  markedAt?: string;
  status?: "present" | "absent";
}

interface AttendanceRecord {
  date: string;
  studentId: string;
  status: "present" | "absent";
}

const students: Student[] = [
  { id: "1", name: "John Doe", class: "10", section: "A" },
  { id: "2", name: "Jane Smith", class: "10", section: "A" },
  { id: "3", name: "Mike Johnson", class: "10", section: "B" },
  { id: "4", name: "Sarah Williams", class: "11", section: "A" },
  { id: "5", name: "Tom Brown", class: "11", section: "B" },
];

const classes = ["10", "11", "12"];
const sections = ["A", "B", "C"];

const tabs = [
  { id: "manual", label: "Manual Entry", icon: Search },
  { id: "qr", label: "QR Scanner", icon: QrCode },
  { id: "biometric", label: "Biometric", icon: Fingerprint },
  { id: "rfid", label: "RFID", icon: Wifi },
];

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    const matchesSection = selectedSection === "all" || student.section === selectedSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  const markAttendance = (studentId: string, status: "present" | "absent") => {
    const record: AttendanceRecord = {
      date: new Date().toISOString().split('T')[0],
      studentId,
      status,
    };

    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (r) => !(r.date === record.date && r.studentId === record.studentId)
      );
      return [...filtered, record];
    });

    const student = students.find((s) => s.id === studentId);
    toast({
      title: `${student?.name} marked ${status}`,
      description: `Attendance recorded for ${new Date().toLocaleDateString()}`,
    });
  };

  const markAllPresent = () => {
    filteredStudents.forEach((student) => {
      markAttendance(student.id, "present");
    });
    toast({
      title: "Batch Attendance",
      description: `Marked ${filteredStudents.length} students present`,
    });
  };

  const handleScan = (data: any) => {
    if (data) {
      console.log('Scanned data:', data)
    }
  }

  const handleError = (err: any) => {
    console.error(err)
  }

  const simulateBiometricScan = () => {
    toast({
      title: "Scanning Fingerprint",
      description: "Please place your finger on the scanner",
    });
    // Simulated biometric scanning
    setTimeout(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      markAttendance(randomStudent.id, "present");
    }, 2000);
  };

  const simulateRFIDScan = () => {
    toast({
      title: "Scanning RFID Card",
      description: "Please tap your card on the reader",
    });
    // Simulated RFID scanning
    setTimeout(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      markAttendance(randomStudent.id, "present");
    }, 1000);
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((s) => (
                      <SelectItem key={s} value={s}>
                        Section {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={markAllPresent}>Mark All Present</Button>
              </div>

              <div className="space-y-4">
                {filteredStudents.map((student) => {
                  const todayRecord = attendanceRecords.find(
                    (r) => 
                      r.studentId === student.id && 
                      r.date === new Date().toISOString().split('T')[0]
                  );

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border"
                    >
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-500">
                          Class {student.class} - Section {student.section}
                        </p>
                        {todayRecord && (
                          <p className="text-xs text-gray-400">
                            Marked {todayRecord.status} at{" "}
                            {new Date().toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className={`${
                            todayRecord?.status === "present"
                              ? "bg-green-100 hover:bg-green-200"
                              : "bg-green-50 hover:bg-green-100"
                          } text-green-600 border-green-200`}
                          onClick={() => markAttendance(student.id, "present")}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          variant="outline"
                          className={`${
                            todayRecord?.status === "absent"
                              ? "bg-red-100 hover:bg-red-200"
                              : "bg-red-50 hover:bg-red-100"
                          } text-red-600 border-red-200`}
                          onClick={() => markAttendance(student.id, "absent")}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="text-center">
              {isScanning ? (
                <div className="max-w-md mx-auto">
                  <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                  />
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => setIsScanning(false)}
                  >
                    Stop Scanning
                  </Button>
                </div>
              ) : (
                <div className="py-12">
                  <Button onClick={() => setIsScanning(true)}>
                    Start QR Scanner
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "biometric" && (
            <div className="text-center py-12">
              <Button onClick={simulateBiometricScan}>
                <Fingerprint className="w-4 h-4 mr-2" />
                Scan Fingerprint
              </Button>
            </div>
          )}

          {activeTab === "rfid" && (
            <div className="text-center py-12">
              <Button onClick={simulateRFIDScan}>
                <Wifi className="w-4 h-4 mr-2" />
                Scan RFID Card
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Attendance;
