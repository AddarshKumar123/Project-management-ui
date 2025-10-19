import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Organize and track all your projects in one intuitive dashboard with Kanban boards, timelines, and progress tracking.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Seamlessly collaborate with your team through real-time updates, comments, file sharing, and task assignments.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Intelligent scheduling tools that help you plan deadlines, allocate resources, and avoid conflicts automatically.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Comprehensive analytics to track productivity, identify bottlenecks, and make data-driven decisions for your projects.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Automate repetitive tasks, create custom workflows, and streamline your project management processes.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with encryption, SSO integration, and compliance with industry standards like SOC 2 and GDPR.",
  },
];

const stats = [
  { label: "Active Projects", value: "2,847", icon: FolderKanban },
  { label: "Team Members", value: "12,500+", icon: Users },
  { label: "Tasks Completed", value: "98,234", icon: CheckCircle },
  { label: "Hours Saved", value: "45,000+", icon: Clock },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Project Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your workflow, collaborate seamlessly, and deliver
              projects on time with ProjectTrack. The modern project management
              platform designed for teams that move fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              >
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 border-gray-300"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From planning to execution, ProjectTrack provides all the tools
              your team needs to stay organized, productive, and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why teams choose ProjectFlow
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-purple-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Increase Productivity by 40%
                    </h3>
                    <p className="text-gray-600">
                      Streamlined workflows and automation features help teams
                      deliver projects faster without compromising quality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Global Team Collaboration
                    </h3>
                    <p className="text-gray-600">
                      Real-time collaboration tools that work seamlessly across
                      time zones and devices, keeping everyone connected.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      99.9% Uptime Guarantee
                    </h3>
                    <p className="text-gray-600">
                      Reliable infrastructure ensures your team can access
                      projects and data whenever they need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to get started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of teams already using ProjectTrack to deliver
                  better results.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Link to="/signup">Start Your Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
