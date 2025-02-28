
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  parentName: string;
  parentEmail: string;
  registrationDate: string;
  photo?: string;
  attendance?: Array<{date: string, present: boolean}>;
}

export interface Attendance {
  date: string;
  studentId: string;
  present: boolean;
}

interface DataContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  attendanceRecords: Attendance[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<Attendance[]>>;
  addStudent: (student: Omit<Student, "id" | "registrationDate">) => Student;
  updateStudent: (updatedStudent: Student) => void;
  deleteStudent: (studentId: string) => void;
  markAttendance: (studentId: string, date: string, present: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>(() => {
    const savedAttendance = localStorage.getItem("attendance");
    return savedAttendance ? JSON.parse(savedAttendance) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const generateStudentId = (classNum: string) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const classPrefix = classNum.padStart(2, "0");
    const sequence = (students.length + 1).toString().padStart(3, "0");
    return `${year}${classPrefix}${sequence}`;
  };

  const addStudent = (student: Omit<Student, "id" | "registrationDate">) => {
    const newStudent: Student = {
      id: generateStudentId(student.class),
      ...student,
      registrationDate: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === updatedStudent.id ? updatedStudent : student))
    );
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
    setAttendanceRecords((prev) => prev.filter((record) => record.studentId !== studentId));
  };

  const markAttendance = (studentId: string, date: string, present: boolean) => {
    // Check if record already exists
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.studentId === studentId && record.date === date
    );

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex].present = present;
      setAttendanceRecords(updatedRecords);
    } else {
      // Add new record
      setAttendanceRecords((prev) => [
        ...prev,
        { studentId, date, present },
      ]);
    }
  };

  return (
    <DataContext.Provider
      value={{
        students,
        setStudents,
        attendanceRecords,
        setAttendanceRecords,
        addStudent,
        updateStudent,
        deleteStudent,
        markAttendance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
