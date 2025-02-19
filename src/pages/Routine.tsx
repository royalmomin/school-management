
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

interface RoutineEntry {
  id: string;
  day: string;
  class: string;
  section: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Routine = () => {
  const [routines, setRoutines] = useState<RoutineEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [newEntry, setNewEntry] = useState({
    subject: "",
    teacher: "",
    startTime: "",
    endTime: "",
  });
  const { toast } = useToast();

  const handleAddEntry = () => {
    if (!selectedClass || !selectedSection || !newEntry.subject || !newEntry.teacher || !newEntry.startTime || !newEntry.endTime) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const entry: RoutineEntry = {
      id: Date.now().toString(),
      day: selectedDay,
      class: selectedClass,
      section: selectedSection,
      ...newEntry,
    };

    setRoutines([...routines, entry]);
    setNewEntry({
      subject: "",
      teacher: "",
      startTime: "",
      endTime: "",
    });
    toast({
      title: "Success",
      description: "Routine entry added successfully",
    });
  };

  const filteredRoutines = routines.filter(
    (routine) =>
      routine.day === selectedDay &&
      routine.class === selectedClass &&
      routine.section === selectedSection
  );

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routine Management</h1>
          <p className="text-gray-500 mt-2">Manage class routines and schedules</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Routine Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
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
            <Select value={selectedSection} onValueChange={setSelectedSection}>
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
              placeholder="Subject"
              value={newEntry.subject}
              onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
            />
            <Input
              placeholder="Teacher"
              value={newEntry.teacher}
              onChange={(e) => setNewEntry({ ...newEntry, teacher: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="time"
                value={newEntry.startTime}
                onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
              />
              <Input
                type="time"
                value={newEntry.endTime}
                onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
              />
            </div>
            <Button onClick={handleAddEntry} className="md:col-span-3">
              Add Entry
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Routine</h2>
          {selectedClass && selectedSection ? (
            <div className="space-y-4">
              {filteredRoutines.length > 0 ? (
                filteredRoutines.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{entry.subject}</h3>
                      <p className="text-sm text-gray-500">
                        Teacher: {entry.teacher}
                      </p>
                      <p className="text-xs text-gray-400">
                        {entry.startTime} - {entry.endTime}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No routine entries found for the selected class and section
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Select a class and section to view routine
            </p>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Routine;
