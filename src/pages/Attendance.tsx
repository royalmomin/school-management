
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useData } from "@/contexts/DataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Attendance = () => {
  const { students, attendanceRecords, markAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const { toast } = useToast();

  // Get all classes and sections from students
  const classes = [...new Set(students.map(student => student.class))].sort();
  const sections = selectedClass 
    ? [...new Set(students
        .filter(student => student.class === selectedClass)
        .map(student => student.section))].sort()
    : [];
  
  // Filter students by selected class and section
  const filteredStudents = students.filter(student => {
    if (selectedClass && student.class !== selectedClass) return false;
    if (selectedSection && student.section !== selectedSection) return false;
    return true;
  });

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };
  
  const formattedDate = formatDate(selectedDate);
  
  const getAttendanceStatus = (studentId: string) => {
    const record = attendanceRecords.find(
      record => record.studentId === studentId && record.date === formattedDate
    );
    return record ? record.present : null;
  };
  
  const handleMarkAttendance = (studentId: string, present: boolean) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first",
        variant: "destructive",
      });
      return;
    }
    
    markAttendance(studentId, formattedDate, present);
    
    toast({
      title: "Success",
      description: `Attendance marked as ${present ? "present" : "absent"}`,
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
  
  const saveAttendance = () => {
    toast({
      title: "Success",
      description: "Attendance saved successfully",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-gray-500 mt-2">Track and manage student attendance</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Select Class</label>
              <Select
                value={selectedClass}
                onValueChange={(value) => {
                  setSelectedClass(value);
                  setSelectedSection("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Select Section</label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={!selectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s} value={s}>
                      Section {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <Button onClick={markAllPresent} variant="outline">
              Mark All Present
            </Button>
            <Button onClick={saveAttendance}>Save Attendance</Button>
          </div>

          <div className="border rounded-lg">
            <div className="grid grid-cols-12 font-medium p-4 border-b bg-gray-50">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Student</div>
              <div className="col-span-2">Class</div>
              <div className="col-span-4 text-center">Attendance</div>
            </div>
            <div className="divide-y">
              {filteredStudents.map((student, index) => {
                const attendanceStatus = getAttendanceStatus(student.id);
                
                return (
                  <div key={student.id} className="grid grid-cols-12 p-4 items-center">
                    <div className="col-span-1 text-gray-500">{index + 1}</div>
                    <div className="col-span-5 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        {student.photo ? (
                          <AvatarImage src={student.photo} alt={student.name} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student.id}</div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      Class {student.class}-{student.section}
                    </div>
                    <div className="col-span-4 flex justify-center gap-4">
                      <Button
                        onClick={() => handleMarkAttendance(student.id, true)}
                        variant={attendanceStatus === true ? "default" : "outline"}
                        size="sm"
                        className={attendanceStatus === true ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        <Check className="w-4 h-4 mr-1" /> Present
                      </Button>
                      <Button
                        onClick={() => handleMarkAttendance(student.id, false)}
                        variant={attendanceStatus === false ? "default" : "outline"}
                        size="sm"
                        className={attendanceStatus === false ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        <X className="w-4 h-4 mr-1" /> Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No students found. Please select a different class or section.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Attendance;
