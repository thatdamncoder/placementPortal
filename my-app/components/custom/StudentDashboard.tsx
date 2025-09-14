"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Building2, User, LogOut, CheckCircle, Clock, XCircle, Search, ArrowUpDown } from "lucide-react"

interface Company {
  id: string
  name: string
  role: string
  package: string
  deadline: string
  status: "open" | "closed" | "upcoming"
  description: string
  requirements: string[]
}

interface Application {
  id: string
  companyName: string
  role: string
  appliedDate: string
  status: "applied" | "selected" | "rejected" | "pending"
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [userEmail, setUserEmail] = useState("")
  const [companySearch, setCompanySearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [calendarSort, setCalendarSort] = useState("date-asc")

  const companies: Company[] = [
    {
      id: "1",
      name: "Google",
      role: "Software Engineer",
      package: "₹25 LPA",
      deadline: "2024-01-15",
      status: "open",
      description: "Join Google as a Software Engineer and work on cutting-edge technology.",
      requirements: ["B.Tech/M.Tech in CS/IT", "Strong programming skills", "CGPA > 8.0"],
    },
    {
      id: "2",
      name: "Microsoft",
      role: "Product Manager",
      package: "₹22 LPA",
      deadline: "2024-01-20",
      status: "open",
      description: "Lead product development at Microsoft.",
      requirements: ["Any Engineering degree", "Leadership experience", "CGPA > 7.5"],
    },
    {
      id: "3",
      name: "Amazon",
      role: "Data Scientist",
      package: "₹20 LPA",
      deadline: "2024-01-10",
      status: "closed",
      description: "Work with big data and machine learning at Amazon.",
      requirements: ["B.Tech/M.Tech", "Python/R skills", "CGPA > 8.5"],
    },
  ]

  const applications: Application[] = [
    { id: "1", companyName: "Google", role: "Software Engineer", appliedDate: "2024-01-05", status: "pending" },
    { id: "2", companyName: "Microsoft", role: "Product Manager", appliedDate: "2024-01-03", status: "selected" },
    { id: "3", companyName: "Amazon", role: "Data Scientist", appliedDate: "2023-12-28", status: "rejected" },
  ]

  const calendarEvents = [
    { id: "1", title: "Google - Application Deadline", date: "2024-01-15", type: "deadline" },
    { id: "2", title: "Microsoft - Interview Round", date: "2024-01-18", type: "interview" },
    { id: "3", title: "Amazon - Result Declaration", date: "2024-01-12", type: "result" },
    { id: "4", title: "TCS - Campus Drive", date: "2024-01-25", type: "drive" },
  ]

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (!email) {
      window.location.href = "/"
    } else {
      setUserEmail(email)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "selected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      company.role.toLowerCase().includes(companySearch.toLowerCase()),
  )

  const filteredApplications =
    statusFilter === "all" ? applications : applications.filter((app) => app.status === statusFilter)

  const sortedCalendarEvents = [...calendarEvents].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return calendarSort === "date-asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="home">
              <User className="h-4 w-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="results">
              <CheckCircle className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Selected</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter((app) => app.status === "selected").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {applications.filter((app) => app.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Your latest placement applications</CardDescription>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="selected">Selected</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="pending">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApplications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(app.status)}
                        <div>
                          <p className="font-medium">{app.companyName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={app.status === "selected" ? "default" : "secondary"}>{app.status}</Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{app.appliedDate}</p>
                      </div>
                    </div>
                  ))}
                  {filteredApplications.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No applications found for the selected status.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Available Companies</CardTitle>
                    <CardDescription>Browse and apply to placement drives</CardDescription>
                  </div>
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search companies or roles..."
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {filteredCompanies.map((company) => (
                    <Card key={company.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{company.name}</CardTitle>
                            <CardDescription className="text-lg font-medium text-blue-600">
                              {company.role}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                            <p className="text-lg font-bold text-green-600 mt-1">{company.package}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{company.description}</p>
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Requirements:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                            {company.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Deadline: {company.deadline}</p>
                          <Button disabled={company.status !== "open"} className="bg-blue-600 hover:bg-blue-700">
                            {company.status === "open" ? "Apply Now" : "Closed"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No companies found matching your search.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Results</CardTitle>
                <CardDescription>Track your placement application status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(app.status)}
                        <div>
                          <p className="font-medium">{app.companyName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.role}</p>
                          <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          app.status === "selected"
                            ? "default"
                            : app.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Placement Calendar</CardTitle>
                    <CardDescription>Important dates and deadlines</CardDescription>
                  </div>
                  <Select value={calendarSort} onValueChange={setCalendarSort}>
                    <SelectTrigger className="w-48">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-asc">Date (Earliest First)</SelectItem>
                      <SelectItem value="date-desc">Date (Latest First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedCalendarEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 border rounded-lg ${
                        event.type === "deadline"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : event.type === "interview"
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : event.type === "result"
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-purple-50 dark:bg-purple-900/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar
                          className={`h-5 w-5 ${
                            event.type === "deadline"
                              ? "text-red-600"
                              : event.type === "interview"
                                ? "text-blue-600"
                                : event.type === "result"
                                  ? "text-green-600"
                                  : "text-purple-600"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-gray-600 dark:text-gray-400">John Doe</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <p className="text-gray-600 dark:text-gray-400">Computer Science</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">CGPA</label>
                      <p className="text-gray-600 dark:text-gray-400">8.5</p>
                    </div>
                  </div>
                  <Button className="mt-4">Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
