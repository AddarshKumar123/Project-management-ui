import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import NewTaskModal from "@/components/NewTaskModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle,
  Users,
  X,
  Check,
} from "lucide-react";
import axios from "axios";

const statusConfig = {
  todo: {
    icon: Circle,
    color: "bg-gray-100 text-gray-800",
    label: "To Do",
  },
  "in-progress": {
    icon: Clock,
    color: "bg-blue-100 text-blue-800",
    label: "In Progress",
  },
  completed: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Completed",
  },
  blocked: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
    label: "Blocked",
  },
};

const priorityConfig = {
  high: { color: "bg-red-100 text-red-800", label: "High" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
  low: { color: "bg-green-100 text-green-800", label: "Low" },
};

export default function Tasks() {
  const [mockTasks,setMockTasks] =useState([]);
  const [mockEmployees,setMockEmployees] =useState([]);
  const { projectId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showEmployees, setShowEmployees] = useState(false);
  
  // New state for team member search and selection
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(()=>{
    const fetchTasks=async()=>{
      try{
        const res=await axios.get(`http://localhost:6060/gettasks/${projectId}`,
          {withCredentials:true}
        );
        setMockTasks(res.data)
        console.log(res.data);
        
      }catch(err){
        console.log(err);
      }
    };
    fetchTasks()
  },[])

  useEffect(()=>{
    const fetchEmployee=async()=>{
      try{
        const res=await axios.get(`http://localhost:6060/getemployee`,{
          withCredentials:true
        });
        setMockEmployees(res.data)
        console.log(res.data);
        
      }catch(err){
        console.log(err);
      }
    };
    fetchEmployee()
  },[])

  // Filter tasks
  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Filter team members based on search
  const filteredTeamMembers = mockEmployees.filter((member) =>
    member.firstName.toLowerCase().includes(teamSearchQuery.toLowerCase())
    // member.role.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
    // member.skills.some(skill => skill.toLowerCase().includes(teamSearchQuery.toLowerCase()))
  );

  const taskStats = {
    total: mockTasks.length,
    todo: mockTasks.filter((t) => t.status === "todo").length,
    inProgress: mockTasks.filter((t) => t.status === "in-progress").length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAssignTask = (taskId: number, employeeId: number) => {
    console.log(`Assigning task ${taskId} to employee ${employeeId}`);
    // Here you would make an API call to assign the task
  };

  // Handle team member selection
  const toggleTeamMemberSelection = (member) => {
    setSelectedTeamMembers(prev => {
      const isSelected = prev.find(m => m.employeeId === member.employeeId);
      if (isSelected) {
        return prev.filter(m => m.employeeId !== member.employeeId);
      } else {
        return [...prev, member];
      }
    });
  };

  // Handle task selection
  const toggleTaskSelection = (task) => {
    setSelectedTasks(prev => {
      const isSelected = prev.find(t => t.taskId === task.taskId);
      if (isSelected) {
        return prev.filter(t => t.taskId !== task.taskId);
      } else {
        return [...prev, task];
      }
    });
  };

  // Remove selected team member
  const removeSelectedTeamMember = (memberId) => {
    setSelectedTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedTeamMembers([]);
    setSelectedTasks([]);
  };

  // Handle automatic mapping (placeholder function)
  const handleAutomaticMapping = async() => {
    const teamMembersId=[]
    const taskId=[]
    for(const member of selectedTeamMembers){
      teamMembersId.push(member.employeeId);
    }

    for(const task of selectedTasks){
      taskId.push(task.taskId);
    }

    const taskMapper={
      empId:teamMembersId,
      taskId:taskId
    }

    console.log(taskMapper);
    

    const res =await axios.post("http://localhost:6060/maptasks",taskMapper);
    console.log(res.data);
    
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                to="/projects"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Projects
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  Project Tasks
                </h1>
                <p className="text-gray-600 mt-1">
                  E-commerce Platform Redesign - Project #{projectId}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEmployees(!showEmployees)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {showEmployees ? "Hide" : "View"} Team
                </Button>
                {(selectedTasks.length > 0 || selectedTeamMembers.length > 0) && (
                  <Button
                    onClick={handleAutomaticMapping}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Auto Map ({selectedTasks.length} tasks, {selectedTeamMembers.length} members)
                  </Button>
                )}
                {(selectedTasks.length > 0 || selectedTeamMembers.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={clearAllSelections}
                  >
                    Clear Selections
                  </Button>
                )}
                <NewTaskModal
                  projectId={projectId}
                  onTaskCreate={(task) => {
                    console.log("New task created:", task);
                    // Here you would typically add the task to your state or refetch data
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {taskStats.total}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  To Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {taskStats.todo}
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
                <div className="text-2xl font-bold text-blue-600">
                  {taskStats.inProgress}
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
                  {taskStats.completed}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Items Display */}
          {(selectedTeamMembers.length > 0 || selectedTasks.length > 0) && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Selected Items for Mapping</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSelections}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTeamMembers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Team Members ({selectedTeamMembers.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeamMembers.map((member) => (
                            <Badge
                              key={member.employeeId}
                              variant="outline"
                              className="bg-blue-50 border-blue-200 text-blue-800 pr-1"
                            >
                              {member.firstName}
                              <button
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                onClick={() => removeSelectedTeamMember(member.employeeId)}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedTasks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Tasks ({selectedTasks.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTasks.map((task) => (
                            <Badge
                              key={task.taskId}
                              variant="outline"
                              className="bg-green-50 border-green-200 text-green-800 pr-1"
                            >
                              {task.taskTitle}
                              <button
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                onClick={() => setSelectedTasks(prev => prev.filter(t => t.taskId !== task.taskId))}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters and Search */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
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
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const StatusIcon = statusConfig[task.status].icon;
                  const isTaskSelected = selectedTasks.find(t => t.taskId === task.taskId);

                  return (
                    <Card
                      key={task.taskId}
                      className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        isTaskSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            {/* Task Selection Checkbox */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleTaskSelection(task);
                              }}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isTaskSelected
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {isTaskSelected && <Check className="w-3 h-3" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/tasks/${task.taskId}`}
                                className="hover:text-purple-600"
                              >
                                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                  {task.taskTitle}
                                </CardTitle>
                              </Link>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            </div>
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
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>
                                Assign to Employee
                              </DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
                          <Badge className={statusConfig[task.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[task.status].label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={priorityConfig[task.priority].color}
                          >
                            <Flag className="w-3 h-3 mr-1" />
                            {priorityConfig[task.priority].label}
                          </Badge>
                        </div>

                        {/* Assignee and Due Date */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {task.employee
                                  ? task.employee.firstName
                                  : "Unassigned"}
                              </span>
                            </div>
                            {task.assignee && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                {task.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>

                        {/* Estimated Hours */}
                        <div className="text-xs text-gray-500 pt-2 border-t">
                          Estimated: {task.estimatedHours}h
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Employee Sidebar */}
            {showEmployees && (
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Team Members</CardTitle>
                    <p className="text-sm text-gray-600">
                      Search and select team members for mapping
                    </p>
                    {/* Team Search */}
                    <div className="mt-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search team members..."
                          value={teamSearchQuery}
                          onChange={(e) => setTeamSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredTeamMembers.map((employee) => {
                      const isSelected = selectedTeamMembers.find(m => m.employeeId === employee.employeeId);
                      return (
                        <div
                          key={employee.employeeId}
                          onClick={() => toggleTeamMemberSelection(employee)}
                          className={`p-3 border rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                            isSelected 
                              ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Selection indicator */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-blue-500 border-blue-500 text-white' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-medium">
                              {employee.firstName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {employee.firstName}
                              </h4>
                              <p className="text-xs text-gray-600 truncate">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                          {/* <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {employee.skills.slice(0, 3).map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {employee.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{employee.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div> */}
                        </div>
                      );
                    })}
                    {filteredTeamMembers.length === 0 && teamSearchQuery && (
                      <div className="text-center py-4 text-gray-500">
                        No team members found matching "{teamSearchQuery}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
