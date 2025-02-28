
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Users, BookOpen, Calendar, TrendingUp, UserCheck, Clock, School, ChevronUp, ChevronDown } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const Index = () => {
  const { students, attendanceRecords } = useData();
  
  // Calculate dashboard stats
  const totalStudents = students.length;
  
  // Calculate class distribution
  const classCounts = students.reduce((acc: Record<string, number>, student) => {
    acc[student.class] = (acc[student.class] || 0) + 1;
    return acc;
  }, {});
  
  const activeClasses = Object.keys(classCounts).length;
  
  // Calculate attendance rate
  const today = format(new Date(), 'yyyy-MM-dd');
  const lastWeek = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  
  const recentAttendance = attendanceRecords.filter(record => 
    record.date >= lastWeek && record.date <= today
  );
  
  const attendanceRate = recentAttendance.length > 0
    ? Math.round((recentAttendance.filter(record => record.present).length / recentAttendance.length) * 100)
    : 0;
    
  // Monthly growth (just a placeholder calculation for demo purposes)
  const prevMonthStudents = Math.max(0, totalStudents - Math.floor(totalStudents * 0.125));
  const growthRate = prevMonthStudents > 0 
    ? Math.round(((totalStudents - prevMonthStudents) / prevMonthStudents) * 100)
    : 0;
  
  // Prepare data for charts
  const classDistributionData = Object.entries(classCounts).map(([name, value]) => ({
    name: `Class ${name}`,
    value
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Get section distribution
  const sectionData = students.reduce((acc: Record<string, number>, student) => {
    const key = `Class ${student.class}-${student.section}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  
  const sectionChartData = Object.entries(sectionData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6 for readability
  
  // Weekly attendance trend (simplified mock data)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const attendanceTrend = days.map(day => ({
    day,
    present: Math.floor(Math.random() * (totalStudents * 0.9)) + (totalStudents * 0.1),
    absent: Math.floor(Math.random() * (totalStudents * 0.3))
  }));
  
  // Recently registered students
  const recentlyRegistered = [...students]
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5);
  
  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Active Classes",
      value: activeClasses.toString(),
      icon: BookOpen,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: Calendar,
      color: "bg-green-50",
      iconColor: "text-green-500",
      change: attendanceRate > 90 ? { type: 'increase', value: `${attendanceRate - 90}%` } : { type: 'decrease', value: `${90 - attendanceRate}%` }
    },
    {
      title: "Growth Rate",
      value: `${growthRate}%`,
      icon: TrendingUp,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      change: { type: 'increase', value: '3.2%' }
    },
  ];
  
  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, John Doe</p>
        </div>
        
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  {stat.change && (
                    <p className={`text-xs flex items-center mt-1 ${
                      stat.change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change.type === 'increase' ? 
                        <ChevronUp className="w-3 h-3 mr-1" /> : 
                        <ChevronDown className="w-3 h-3 mr-1" />
                      }
                      {stat.change.value} from last week
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {classDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Section Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectionChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Student ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Class</th>
                    <th className="text-left py-3 px-4">Parent</th>
                    <th className="text-left py-3 px-4">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyRegistered.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{student.id}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">Class {student.class}-{student.section}</td>
                      <td className="py-3 px-4">{student.parentName}</td>
                      <td className="py-3 px-4">{new Date(student.registrationDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentlyRegistered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No students registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
