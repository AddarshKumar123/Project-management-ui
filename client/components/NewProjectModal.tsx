import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Calendar, X } from "lucide-react";
import axios from "axios";

interface NewProjectModalProps {
  trigger?: React.ReactNode;
  onProjectCreate?: (projectData: any) => void;
}

interface SkillsInputProps {
  onAddSkill: (skill: string) => void;
  suggestions: string[];
}

function SkillsInput({ onAddSkill, suggestions }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  console.log(inputValue);
  

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleAddSkill = (skill: string) => {
    onAddSkill(skill);
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddSkill(inputValue.trim());
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          placeholder="Type a skill and press Enter..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputValue.trim() && handleAddSkill(inputValue.trim())}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 border-none bg-transparent"
              onClick={() => handleAddSkill(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default function NewProjectModal({
  trigger,
  onProjectCreate,
}: NewProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectDesc: "",
    priority: "",
    dueDate: "",
    // tags: "",
    teamMembers: [],
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

    const projectData = {
      ...formData,
      // tags: tagsArray,
      status: "planning",
    };

    // onProjectCreate?.(projectData);
    console.log("Creating project:", projectData);
    try{
      const res=await axios.post("http://localhost:6060/addproject",
        projectData,
        {withCredentials:true}
      );
      console.log(res.data);
      
    }catch(err){
      console.log(err);
      
    }

    // Reset form and close modal
    setFormData({
      projectName: "",
      projectDesc: "",
      priority: "",
      dueDate: "",
      // tags: "",
      // teamLead: "",
      teamMembers: [],
    });
    setOpen(false);
  };

  const isFormValid =
    formData.projectName.trim() &&
    formData.projectDesc.trim() &&
    formData.priority &&
    formData.dueDate;

  const handleAddSkill = (member: string) => {
    console.log(member);
    
    if (member.trim() && !formData.teamMembers?.includes(member.trim())) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...(prev.teamMembers || []), member.trim()],
      }));
    }
  };

  const handleRemoveSkill = (memberToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers:
        prev.teamMembers?.filter((member) => member !== memberToRemove) || [],
    }));
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project. You can always
            edit these details later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="projectDesc">Description *</Label>
              <Textarea
                id="projectDesc"
                placeholder="Describe your project objectives and scope..."
                rows={3}
                value={formData.projectDesc}
                onChange={(e) =>
                  handleInputChange("projectDesc", e.target.value)
                }
                required
              />
            </div>

            {/* Priority and Due Date */}
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

            {/* Team Members */}
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <div className="space-y-3">
                  <SkillsInput
                    onAddSkill={handleAddSkill}
                    suggestions={[
                      "JavaScript",
                      "React",
                      "TypeScript",
                      "Node.js",
                      "Python",
                      "Java",
                      "C++",
                      "HTML",
                      "CSS",
                      "Vue.js",
                      "Angular",
                      "Express",
                      "MongoDB",
                      "PostgreSQL",
                      "MySQL",
                      "AWS",
                      "Docker",
                      "Git",
                      "Figma",
                      "Photoshop",
                      "UI/UX Design",
                      "Project Management",
                      "Agile",
                      "Scrum",
                      "Leadership",
                      "Communication",
                      "Problem Solving",
                    ]}
                  />
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-gray-50">
                    {formData.teamMembers && formData.teamMembers.length > 0 ? (
                      formData.teamMembers.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {skill}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Add your skills to help us match you with relevant
                        projects
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* <Label htmlFor="teamLead">Team Lead</Label>
              <Select
                value={formData.teamLead}
                onValueChange={(value) => handleInputChange("teamLead", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team lead (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alice-johnson">Alice Johnson</SelectItem>
                  <SelectItem value="bob-smith">Bob Smith</SelectItem>
                  <SelectItem value="carol-davis">Carol Davis</SelectItem>
                  <SelectItem value="david-wilson">David Wilson</SelectItem>
                  <SelectItem value="eva-martinez">Eva Martinez</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {/* Tags */}
            {/* <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., Frontend, Mobile, API)"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Add relevant tags to help categorize and filter your project
              </p>
            </div> */}
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
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}