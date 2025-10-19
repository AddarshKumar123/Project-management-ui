import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Lock,
  Building2,
  X,
  Plus,
} from "lucide-react";
import axios from "axios";

interface SkillsInputProps {
  onAddSkill: (skill: string) => void;
  suggestions: string[];
}

function SkillsInput({ onAddSkill, suggestions }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  encrypted_password: string;
  confirmPassword: string;
  company: string;
  job_role: string;
  skills: string[];
  yearsOfExperience: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    skills: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const steps = [
    {
      number: 1,
      title: "Personal Information",
      description: "Tell us about yourself",
      icon: User,
    },
    {
      number: 2,
      title: "Account Security",
      description: "Secure your account",
      icon: Lock,
    },
    {
      number: 3,
      title: "Company Details",
      description: "About your organization",
      icon: Building2,
    },
  ];

  const validateStep1 = (data: Partial<FormData>): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!data.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      newErrors.email = "Invalid email address";
    }

    return newErrors;
  };

  const validateStep2 = (data: Partial<FormData>): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.encrypted_password?.trim()) {
      newErrors.password = "Password is required";
    } else if (data.encrypted_password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.encrypted_password)) {
      newErrors.encrypted_password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!data.confirmPassword?.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.encrypted_password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const validateStep3 = (data: Partial<FormData>): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.company?.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!data.job_role?.trim()) {
      newErrors.jobRole = "Job role is required";
    }

    if (!data.yearsOfExperience?.trim()) {
      newErrors.yearsOfExperience = "Years of experience is required";
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !formData.skills?.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()],
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill !== skillToRemove) || [],
    }));
  };

  const handleNextStep = async() => {
    let stepErrors: FormErrors = {};

    if (currentStep === 1) {
      stepErrors = validateStep1(formData);
    } else if (currentStep === 2) {
      stepErrors = validateStep2(formData);
    } else if (currentStep === 3) {
      stepErrors = validateStep3(formData);
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      // Final submission
      delete formData.confirmPassword
      try{
      const res= await axios.post("http://localhost:6060/createEmployee",formData)
      console.log(res.data);
      }catch(err){
      console.log(err);
      }
      // console.log("Final signup data:", formData);
      }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ProjectFlow</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of teams using ProjectFlow to manage their projects
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? "bg-purple-600 border-purple-600 text-white"
                          : isActive
                            ? "border-purple-600 text-purple-600 bg-white"
                            : "border-gray-300 text-gray-400 bg-white"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-colors ${
                          isCompleted ? "bg-purple-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-purple-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Account Security */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="encrypted_password">Password</Label>
                  <Input
                    id="encrypted_password"
                    type="password"
                    placeholder="Enter a strong password"
                    value={formData.encrypted_password || ""}
                    onChange={(e) =>
                      handleInputChange("encrypted_password", e.target.value)
                    }
                    className={errors.encrypted_password ? "border-red-500" : ""}
                  />
                  {errors.encrypted_password && (
                    <p className="text-sm text-red-500">{errors.encrypted_password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: Company Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corporation"
                    value={formData.company || ""}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className={errors.company ? "border-red-500" : ""}
                  />
                  {errors.company && (
                    <p className="text-sm text-red-500">{errors.company}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_role">Job Role *</Label>
                  <Input
                    id="job_role"
                    placeholder="e.g., Frontend Developer, UI/UX Designer, Product Manager"
                    value={formData.job_role || ""}
                    onChange={(e) =>
                      handleInputChange("job_role", e.target.value)
                    }
                    className={errors.job_role ? "border-red-500" : ""}
                  />
                  {errors.job_role && (
                    <p className="text-sm text-red-500">{errors.job_role}</p>
                  )}
                </div>

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
                      {formData.skills && formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
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

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">
                    Years of Experience *
                  </Label>
                  <Select
                    value={formData.yearsOfExperience || ""}
                    onValueChange={(value) =>
                      handleInputChange("yearsOfExperience", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.yearsOfExperience ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">
                        0-1 years (Entry Level)
                      </SelectItem>
                      <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                      <SelectItem value="4-6">4-6 years (Mid-Level)</SelectItem>
                      <SelectItem value="7-10">7-10 years (Senior)</SelectItem>
                      <SelectItem value="11-15">
                        11-15 years (Lead/Principal)
                      </SelectItem>
                      <SelectItem value="15+">
                        15+ years (Executive/Architect)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.yearsOfExperience && (
                    <p className="text-sm text-red-500">
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {currentStep === 3 ? "Create Account" : "Continue"}
                {currentStep !== 3 && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
