import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Project } from "@shared/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  ArrowLeft,
  Edit3,
  Save,
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";


const statusConfig = {
  Planning: {
    icon: PlayCircle,
    color: "bg-blue-100 text-blue-800",
    label: "Planning",
  },
  "In progress": {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "In Progress",
  },
  completed: {
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

export default function ProjectPreview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Project>({
    id: 0,
    projectName: "",
    projectDesc: "",
    status: "",
    priority: "",
    dueDate: "",
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: [],
  });
  const [originalData, setOriginalData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:6060/getProjectById/${projectId}`,{
          withCredentials:true
        });
        const projectData = response.data;
        
        setProject(projectData);
        setFormData(projectData);
        setOriginalData(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:6060/updateProject/${projectId}`, formData,{
        withCredentials:true
      });
      setProject(formData);
      setIsEditing(false);
      // Show success message (you can implement toast notifications)
      console.log("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading project...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="text-lg text-gray-900 mb-2">Project not found</div>
                <Link to="/projects" className="text-purple-600 hover:text-purple-700">
                  Return to Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const StatusIcon = statusConfig[formData.status]?.icon || PlayCircle;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Project Preview
                </h1>
                <p className="text-gray-600 mt-1">
                  View and edit project details
                </p>
              </div>
              <div className="flex gap-3">
                {!isEditing ? (
                  <>
                    <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                    <Link to={`/projects/${projectId}/tasks`}>
                      <Button variant="outline">
                        View Tasks
                      </Button>
                    </Link>
                  </>
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
          </div>

          {/* Project Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    placeholder="Enter project name"
                  />
                ) : (
                  <div className="text-lg font-semibold text-gray-900">
                    {formData.projectName}
                  </div>
                )}
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                {isEditing ? (
                  <Textarea
                    value={formData.projectDesc}
                    onChange={(e) => handleInputChange("projectDesc", e.target.value)}
                    placeholder="Enter project description"
                    rows={4}
                  />
                ) : (
                  <div className="text-gray-700">
                    {formData.projectDesc}
                  </div>
                )}
              </div>

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  {isEditing ? (
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
                  ) : (
                    <Badge className={statusConfig[formData.status]?.color || "bg-gray-100 text-gray-800"}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[formData.status]?.label || formData.status}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  {isEditing ? (
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
                      className={priorityConfig[formData.priority]?.color || "bg-gray-100 text-gray-800"}
                    >
                      {priorityConfig[formData.priority]?.label || formData.priority}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Due Date
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {formatDate(formData.dueDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Progress
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{formData.progress || 0}%</span>
                  </div>
                  <Progress value={formData.progress || 0} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {formData.completedTasks || 0} of {formData.totalTasks || 0} tasks completed
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Team Members
                </label>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div className="flex -space-x-2">
                    {formData.teamMembers && formData.teamMembers.length > 0 ? (
                      formData.teamMembers.slice(0, 5).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                          title={member}
                        >
                          {member.split(" ").map((n) => n[0]).join("")}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No team members assigned</span>
                    )}
                    {formData.teamMembers && formData.teamMembers.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                        +{formData.teamMembers.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
