
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Search, CheckCircle2, XCircle, QrCode, Fingerprint, Wifi } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";
import type { Student } from "@/contexts/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { students, markAttendance, attendanceRecords } = useData();
  const { toast } = useToast();
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isPresent = (studentId: string) => {
    return attendanceRecords.some(
      record => record.studentId === studentId && 
      record.date === formattedDate && 
      record.present
    );
  };
  const handleAttendanceToggle = (studentId: string) => {
    const present = !isPresent(studentId);
    markAttendance(studentId, formattedDate, present);
    
    toast({
      title: present ? "Marked Present" : "Marked Absent",
      description: `Attendance updated successfully`,
    });
  };
  const markAllPresent = () => {
    if (!selectedDate) return;
    
    filteredStudents.forEach(student => {
      markAttendance(student.id, formattedDate, true);
    });
    
    toast({
      title: "Success",
      description: "All students marked as present",
    });
  };
  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-gray-500 mt-2">Track and manage student attendance</p>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 mb-6">
            <TabsTrigger value="manual" className="w-full">
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="qr" className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              QR Scanner
            </TabsTrigger>
            <TabsTrigger value="biometric" className="w-full">
              <Fingerprint className="h-4 w-4 mr-2" />
              Biometric
            </TabsTrigger>
            <TabsTrigger value="rfid" className="w-full">
              <Wifi className="h-4 w-4 mr-2" />
              RFID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search students..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={markAllPresent}>Mark All Present</Button>
                    </div>

                    <div className="space-y-2">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          className="p-4 rounded-lg border flex justify-between items-center hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-gray-500">
                              Class: {student.class} | ID: {student.id}
                            </p>
                          </div>
                          <Button
                            variant={isPresent(student.id) ? "default" : "outline"}
                            onClick={() => handleAttendanceToggle(student.id)}
                          >
                            {isPresent(student.id) ? (
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            {isPresent(student.id) ? "Present" : "Absent"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Select Date</h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr">
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
                <p className="text-gray-500 mb-4">Scan student QR codes to mark attendance</p>
                <Button>
                  <QrCode className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="biometric">
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Biometric Attendance</h2>
                <p className="text-gray-500 mb-4">Use fingerprint scanner to mark attendance</p>
                <Button>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Initialize Scanner
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rfid">
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">RFID Scanner</h2>
                <p className="text-gray-500 mb-4">Scan RFID cards to mark attendance</p>
                <Button>
                  <Wifi className="h-4 w-4 mr-2" />
                  Start RFID Scanner
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Attendance;
