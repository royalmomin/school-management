
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Pencil, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  parentName: string;
  parentEmail: string;
  registrationDate: string;
  photo?: string;
}

const Registration = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    section: "",
    parentName: "",
    parentEmail: "",
    photo: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const generateStudentId = (classNum: string) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const classPrefix = classNum.padStart(2, "0");
    const sequence = (students.length + 1).toString().padStart(3, "0");
    return `${year}${classPrefix}${sequence}`;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing && editingStudent) {
          setEditingStudent({ ...editingStudent, photo: reader.result as string });
        } else {
          setNewStudent({ ...newStudent, photo: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
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
      photo: "",
    });
    toast({
      title: "Success",
      description: `Student registered successfully with ID: ${student.id}`,
    });
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;

    if (!editingStudent.name || !editingStudent.class || !editingStudent.section) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setStudents(
      students.map((student) =>
        student.id === editingStudent.id ? editingStudent : student
      )
    );
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    toast({
      title: "Success",
      description: "Student information updated successfully",
    });
  };

  const handleDeleteClick = (studentId: string) => {
    setConfirmDeleteId(studentId);
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;

    setStudents(students.filter((student) => student.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    toast({
      title: "Success",
      description: "Student deleted successfully",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerEditFileInput = () => {
    editFileInputRef.current?.click();
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
            <div className="flex flex-col items-center md:col-span-2 mb-4">
              <Avatar className="w-32 h-32 mb-4">
                {newStudent.photo ? (
                  <AvatarImage src={newStudent.photo} alt="Student" />
                ) : (
                  <AvatarFallback className="text-2xl bg-slate-100">
                    📷
                  </AvatarFallback>
                )}
              </Avatar>
              <Button variant="outline" onClick={triggerFileInput} className="flex gap-2">
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e)}
                className="hidden"
              />
            </div>
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
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    {student.photo ? (
                      <AvatarImage src={student.photo} alt={student.name} />
                    ) : (
                      <AvatarFallback className="text-sm bg-slate-100">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-gray-500">
                      ID: {student.id} | Class {student.class}-{student.section}
                    </p>
                    <p className="text-xs text-gray-400">
                      Parent: {student.parentName} ({student.parentEmail})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {new Date(student.registrationDate).toLocaleDateString()}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditClick(student)}
                    className="text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteClick(student.id)}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No students registered yet
              </p>
            )}
          </div>
        </Card>

        {/* Edit Student Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Student Information</DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="w-24 h-24 mb-4">
                    {editingStudent.photo ? (
                      <AvatarImage src={editingStudent.photo} alt={editingStudent.name} />
                    ) : (
                      <AvatarFallback className="text-lg bg-slate-100">
                        {editingStudent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button variant="outline" onClick={triggerEditFileInput} className="flex gap-2">
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </Button>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, true)}
                    className="hidden"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Name</label>
                  <Input
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Class</label>
                  <Select
                    value={editingStudent.class}
                    onValueChange={(value) =>
                      setEditingStudent({ ...editingStudent, class: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((c) => (
                        <SelectItem key={c} value={c}>
                          Class {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Section</label>
                  <Select
                    value={editingStudent.section}
                    onValueChange={(value) =>
                      setEditingStudent({ ...editingStudent, section: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C"].map((s) => (
                        <SelectItem key={s} value={s}>
                          Section {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Parent Name</label>
                  <Input
                    value={editingStudent.parentName}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        parentName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Parent Email</label>
                  <Input
                    value={editingStudent.parentEmail}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        parentEmail: e.target.value,
                      })
                    }
                    className="col-span-3"
                    type="email"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Registration;
