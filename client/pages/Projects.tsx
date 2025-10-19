import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import NewProjectModal from "@/components/NewProjectModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Users,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import axios from "axios";

const statusConfig = {
  "planning": {
    icon: PlayCircle,
    color: "bg-blue-100 text-blue-800",
    label: "Planning",
  },
  "In progress": {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "In Progress",
  },
  "completed": {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Completed",
  },
  "on-hold": {
    icon: PauseCircle,
    color: "bg-gray-100 text-gray-800",
    label: "On Hold",
  },
};

const priorityConfig = {
  high: { color: "bg-red-100 text-red-800", label: "High" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
  low: { color: "bg-green-100 text-green-800", label: "Low" },
};

export default function Projects() {
  const [projects,setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");



  useEffect(()=>{

  const fetchProjects=async()=>{
    try{   
      const res=await axios.get("http://localhost:6060/getproject",{
        withCredentials:true
      });
      setProjects(res.data);
    }catch(err){
      if(err.response.status==403){
        localStorage.removeItem("isAuth");
        console.log(err);
        
      }
    }}
  fetchProjects()
},[])

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || project.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.projectName.localeCompare(b.projectName);
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "progress":
          return b.progress - a.progress;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (

    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">
                  Manage and track all your projects in one place
                </p>
              </div>
              <NewProjectModal
                onProjectCreate={(project) => {
                  console.log("New project created:", project);
                  // Here you would typically add the project to your state or refetch data
                }}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    projects.filter((p) => p.status === "in-progress")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter((p) => p.status === "completed").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    projects.reduce((acc, p) => acc + p.progress, 0) /
                      projects.length,
                  )}
                  %
                </div> */}
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const StatusIcon = statusConfig[project.status].icon;

              return (
                <Link key={project.id} to={`/projects/${project.projectId}/tasks`}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                            {project.projectName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.projectDesc}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <Link to={`/projects/${project.projectId}/preview`}>
                            <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Status and Priority */}
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[project.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[project.status].label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={priorityConfig[project.priority].color}
                        >
                          {priorityConfig[project.priority].label}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="text-xs text-gray-500">
                          {project.completedTasks} of {project.totalTasks} tasks
                          completed
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Team</span>
                        </div>
                        <div className="flex -space-x-2">
                          {project.teamMembers?project.teamMembers
                            .slice(0, 3)
                            .map((member, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                                title={member}
                              >
                                {member
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            )):""}
                          {project.teamMembers?project.teamMembers.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                              +{project.teamMembers.length - 3}
                            </div>
                          ):""}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Due</span>
                        </div>
                        <span className="font-medium">
                          {formatDate(project.dueDate)}
                        </span>
                      </div>

                      {/* Tags */}
                      {/* <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div> */}

                      {/* Last Updated */}
                      {/* <div className="text-xs text-gray-500 pt-2 border-t">
                        Updated {project.lastUpdated}
                      </div> */}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ||
                statusFilter !== "all" ||
                priorityFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first project"}
              </p>
              <NewProjectModal
                trigger={
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                }
                onProjectCreate={(project) => {
                  console.log("New project created:", project);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
