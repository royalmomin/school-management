
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,250",
    icon: Users,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Active Classes",
    value: "68",
    icon: BookOpen,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "Attendance Rate",
    value: "94%",
    icon: Calendar,
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Growth Rate",
    value: "12.5%",
    icon: TrendingUp,
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, John Doe</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
