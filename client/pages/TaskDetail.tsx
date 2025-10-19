import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Flag,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  Edit,
  CheckCircle,
  Circle,
  AlertCircle,
  Save,
  X
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
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

export default function TaskDetail() {
  interface Task {
    status: string;
    taskTitle: string;
    description: string;
    priority: string;
    dueDate: string;
    createdDate: string;
  }
  const { projectId, taskId } = useParams();
  const [originalData, setOriginalData] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Task>({
    status: "",
    taskTitle: "",
    description: "",
    priority: "",
    dueDate: "",
    createdDate: ""
  });
  const [task, setTask] = useState<Task>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(
          `http://localhost:6060/gettaskbyid/${taskId}`,
          { withCredentials: true },
        );
        setTask(res.data);
        setOriginalData(res.data);
        setFormData(res.data);
        setLoading(false); // Set loading to false when task is fetched
      } catch (error) {
        console.error(error);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    // Render a loading indicator or a placeholder while task is being fetched
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const StatusIcon = statusConfig[task.status].icon;

  const handleInputChange=(field:string , value:string | number)=>{
    setFormData((prev)=>({...prev , [field]:value}))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  // const progressPercentage = Math.round(
  //   (completedSubtasks / task.subtasks.length) * 100,
  // );

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:6060/updateTask/${taskId}`, formData,{
        withCredentials:true
      });
      
      setTask(formData);
      setIsEditing(false);
      // Show success message (you can implement toast notifications)
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                to={`/projects/${projectId}/tasks`}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Tasks
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="mb-4 sm:mb-0 flex-1">
                {isEditing?(
                  <Input
                    value={formData.taskTitle}
                    onChange={(e) => handleInputChange("taskTitle", e.target.value)}
                    placeholder="Enter project name"
                    />
                ) :
                (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {task.taskTitle}
                </h1>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  {isEditing?(
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>                    
                  )
                  : (
                  <Badge className={statusConfig[task.status].color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[task.status].label}
                  </Badge>
                  )}
                  </div>
                  <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  {isEditing?(
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                  <Badge
                    variant="outline"
                    className={priorityConfig[task.priority].color}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {priorityConfig[task.priority].label}
                  </Badge>
                  )}
                  </div>
                </div>
                {/* <p className="text-gray-600">
                  {task.projectName} - Task #{taskId}
                </p> */}
              </div>
              {!isEditing ? (
                <div className="flex gap-3">
                  <Button onClick={handleEdit} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                {isEditing ? (
                  <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter project description"
                  rows={4}
                  />
                  ) : (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-gray-700">
                      {formData.description}
                    </p>
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Subtasks */}
              {/* <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Subtasks</CardTitle>
                    <div className="text-sm text-gray-600">
                      {completedSubtasks} of {task.subtasks.length} completed (
                      {progressPercentage}%)
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            subtask.completed
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {subtask.completed && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            subtask.completed
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* Attachments */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {task.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {attachment.size} •{" "}
                            {formatDate(attachment.uploadedAt)}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment */}
                  <div className="border-b pb-4">
                    <Textarea
                      placeholder="Add a comment..."
                      rows={3}
                      className="mb-3"
                    />
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>

                  {/* Comments List */}
                  {/* <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Assignee */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Assignee
                    </label>
                    {/* <div className="mt-1 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                        {task.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.assignee.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.assignee.role}
                        </div>
                      </div>
                    </div> */}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Due Date
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {formatDate(task.createdDate)}
                    </div>
                  </div>

                  {/* Time Tracking */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">
                      Time Tracking
                    </label>
                    <div className="mt-1 space-y-1">
                      <div className="text-sm text-gray-900">
                        {task.actualHours}h / {task.estimatedHours}h
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (task.actualHours / task.estimatedHours) * 100,
                              100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(
                          (task.actualHours / task.estimatedHours) * 100,
                        )}
                        % of estimated time used
                      </div>
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              {/* Tags */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* Skills Required */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Skills Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.assignee.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
