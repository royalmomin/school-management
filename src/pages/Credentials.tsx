
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  class: string;
  enrollmentNo: string;
  qrValue: string;
}

const students: Student[] = [
  { 
    id: "1", 
    name: "John Doe", 
    class: "10A", 
    enrollmentNo: "EN001",
    qrValue: "10A-tempo-7ba7012d-3e54-5ace-9df5-31a68ab334ba"
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    class: "10B", 
    enrollmentNo: "EN002",
    qrValue: "10B-tempo-8ca8123e-4f65-6bdf-0eg6-42b79bc445cb"
  },
  { 
    id: "3", 
    name: "Mike Johnson", 
    class: "11A", 
    enrollmentNo: "EN003",
    qrValue: "11A-tempo-9db9234f-5g76-7ceg-1fh7-53c80cd556dc"
  },
];

const Credentials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = () => {
    toast({
      title: "Credential Downloaded",
      description: "The credential has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing Credential",
      description: "The credential is being sent to the printer.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Credential Center</h1>
          <p className="text-gray-500 mt-2">Manage and generate student credentials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, class or enrollment no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">
                        Class: {student.class} | ID: {student.enrollmentNo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedStudent ? (
              <Card className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">{selectedStudent.name}</h2>
                <p className="text-sm text-gray-500 mb-6">{selectedStudent.qrValue}</p>
                
                <div className="bg-white p-4 rounded-lg inline-block mb-6">
                  <QRCodeSVG
                    value={selectedStudent.qrValue}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-gray-500">
                Select a student to view their credentials
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Credentials;
