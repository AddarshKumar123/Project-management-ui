import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar, Clock } from "lucide-react";
import axios from "axios";

interface NewTaskModalProps {
  trigger?: React.ReactNode;
  projectId?: string;
  onTaskCreate?: (taskData: any) => void;
}


export default function NewTaskModal({
  trigger,
  projectId,
  onTaskCreate,
}: NewTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    priority: "",
    status: "todo",
    // assignee: "",
    dueDate: "",
    // estimatedHours: "",
    // tags: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Process tags
    // const tagsArray = formData.tags
    //   .split(",")
    //   .map((tag) => tag.trim())
    //   .filter((tag) => tag.length > 0);

    // Find assignee details
    // const assignee = mockEmployees.find(
    //   (emp) => emp.id.toString() === formData.assignee,
    // );

    const taskData = {
      ...formData,
      // tags: tagsArray,
      // estimatedHours: formData.estimatedHours
      //   ? parseInt(formData.estimatedHours)
      //   : 0,
      // assignee: assignee
      //   ? {
      //       id: assignee.id,
      //       name: assignee.name,
      //       role: assignee.role,
      //       skills: assignee.skills,
      //     }
      //   : null,
      // projectId: projectId ? parseInt(projectId) : 1,
      // id: Date.now(), // Temporary ID - should come from backend
      createdDate: new Date().toISOString().split("T")[0],
      // actualHours: 0,
    };

    const res=await axios.post(`http://localhost:6060/createtask/${projectId}`,taskData,
      {withCredentials:true}
    )
    console.log("Creating task:", taskData);

    // Reset form and close modal
    setFormData({
      taskTitle: "",
      description: "",
      priority: "",
      status: "todo",
      // assignee: "",
      dueDate: "",
      // estimatedHours: "",
      // tags: "",
    });
    setOpen(false);
  };

  const isFormValid =
    formData.taskTitle.trim() &&
    formData.description.trim() &&
    formData.priority &&
    formData.dueDate;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to this project. Fill in the details below to get
            started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title *</Label>
              <Input
                id="taskTitle"
                placeholder="Enter task title"
                value={formData.taskTitle}
                onChange={(e) => handleInputChange("taskTitle", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the task requirements, objectives, and deliverables..."
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value) =>
                    handleInputChange("assignee", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                      >
                        {employee.name} - {employee.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Estimated Hours and Tags */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <div className="relative">
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="0"
                    max="200"
                    placeholder="8"
                    value={formData.estimatedHours}
                    onChange={(e) =>
                      handleInputChange("estimatedHours", e.target.value)
                    }
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Frontend, API, Design"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
              </div>
            </div> */}

            {/* Assignee Skills Preview */}
            {/* {formData.assignee && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Selected Team Member Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mockEmployees
                    .find((emp) => emp.id.toString() === formData.assignee)
                    ?.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )} */}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
