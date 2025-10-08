"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Building2, User, LogOut, CheckCircle, Clock, XCircle, Search, ArrowUpDown, ArrowUpRight } from "lucide-react"
import { Calendar as CalendarWidget } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Megaphone } from "lucide-react"
import { companies as sharedCompanies } from "@/lib/companies"
import { signOut, useSession } from "next-auth/react"
import SKITLogo from "./SKITLogo"
import Header from "./Header"

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const router = useRouter()

  // Profile state persisted to localStorage (mock persistence)
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [stateRegion, setStateRegion] = useState("")
  const [pincode, setPincode] = useState("")
  const [tenthMarks, setTenthMarks] = useState("")
  const [twelfthMarks, setTwelfthMarks] = useState("")
  const [resumeName, setResumeName] = useState<string | null>(null)
  const {data:session, status} = useSession();

  const announcements = [
    {
      id: "a1",
      title: "Microsoft Drive Registration Open",
      date: "2025-01-08",
      summary: "Last date to register: Jan 18.",
    },
    { id: "a2", title: "Resume Workshop", date: "2025-01-09", summary: "TPO conducting workshop on Jan 13, 4 PM." },
    {
      id: "a3",
      title: "Amazon OA Guidelines",
      date: "2025-01-06",
      summary: "Check email for OA instructions and sample tests.",
    },
  ]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    )
  }

  // If no session (unauthenticated), don’t render anything
  if (!session) return null

  // Logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }


  const handleSaveProfile = () => {
    const payload = {
      addressLine1,
      addressLine2,
      city,
      stateRegion,
      pincode,
      tenthMarks,
      twelfthMarks,
      resumeName,
    }
    // localStorage.setItem("studentProfile", JSON.stringify(payload))
  }

  const companies: Company[] = sharedCompanies as unknown as Company[]

  const upcomingEvents = [...companies]
    .filter((e) => new Date(e.deadline).getTime() >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  const applications: Application[] = [
    { id: "1", companyName: "Google", role: "Software Engineer", appliedDate: "2025-01-05", status: "pending" },
    { id: "2", companyName: "Microsoft", role: "Product Manager", appliedDate: "2025-01-03", status: "selected" },
    { id: "3", companyName: "Amazon", role: "Data Scientist", appliedDate: "2023-12-28", status: "rejected" },
  ]

  const calendarEvents = [
    { id: "1", title: "Google - Application Deadline", date: "2025-01-15", type: "deadline" },
    { id: "2", title: "Microsoft - Interview Round", date: "2025-01-18", type: "interview" },
    { id: "3", title: "Amazon - Result Declaration", date: "2025-01-12", type: "result" },
    { id: "4", title: "TCS - Campus Drive", date: "2025-01-25", type: "drive" },
  ]


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

  const isSameDay = (dateStr: string, date: Date) => {
    const d = new Date(dateStr)
    return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header header="Student Dashboard"/>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="home">
              <User className="h-4 w-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
            {/* <TabsTrigger value="results">
              <CheckCircle className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger> */}
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Sidebar (Announcements + Upcoming) — right on desktop, first on mobile */}
              <aside
                role="complementary"
                aria-label="Important updates"
                className="order-1 lg:order-2 lg:col-span-1 space-y-6 lg:sticky lg:top-4 lg:self-start"
              >
                {/* Announcements */}
                <Card className="border-l-4 border-l-blue-600">
                  <CardHeader className="flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("calendar")}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                      <CardTitle>Upcoming Events</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                  <div className="space-y-3">
                    {(() => {
                      const eventsToShow = selectedDate
                        ? sortedCalendarEvents.filter((e) => isSameDay(e.date, selectedDate))
                        : sortedCalendarEvents
                      return eventsToShow.length > 0 ? (
                        eventsToShow.map((event) => (
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
                              <CalendarIcon
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
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          {selectedDate ? "No events on the selected date." : "No events to display."}
                        </p>
                      )
                    })()}
                  </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="border-l-4 border-l-blue-600">
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
              </aside>

              {/* Main content (Stats + Recent Applications) — left on desktop */}
              <section className="order-2 lg:order-1 lg:col-span-2 space-y-6">
                {/* Stats */}
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


                {/* TODO- fix alignment*/}
                {/* Recent Applications with status filter */}
                <Card>
                  <CardHeader className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-blue-600" />
                      <CardTitle>Announcements</CardTitle>
                    </div>
                    <CardDescription className="ml-5">Latest notices from TPO</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {announcements.map((a) => (
                      <div key={a.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{a.title}</p>
                          <span className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{a.summary}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            </div>
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
                          <Button
                            disabled={company.status !== "open"}
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              if (company.status !== "open") return
                              router.push(`/student/companies/${company.id}`)
                            }}
                          >
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
          {/* <TabsContent value="results" className="space-y-6">
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
          </TabsContent> */}

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
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {(() => {
                      const eventsToShow = selectedDate
                        ? sortedCalendarEvents.filter((e) => isSameDay(e.date, selectedDate))
                        : sortedCalendarEvents
                      return eventsToShow.length > 0 ? (
                        eventsToShow.map((event) => (
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
                              <CalendarIcon
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
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          {selectedDate ? "No events on the selected date." : "No events to display."}
                        </p>
                      )
                    })()}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="p-3 border rounded-md bg-white dark:bg-gray-800">
                        <CalendarWidget mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                    </div>
                  </div>
                  
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
                <div className="space-y-6">
                  {/* Basic Info (read-only for demo) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Name</Label>
                      <p className="text-gray-600 dark:text-gray-400">Parishi Thada</p>
                    </div>
                    <div>
                      <Label className="text-sm">Email</Label>
                      <p className="text-gray-600 dark:text-gray-400">b220845@skit.ac.in</p>
                    </div>
                    <div>
                      <Label className="text-sm">Department</Label>
                      <p className="text-gray-600 dark:text-gray-400">Computer Science and Engineering</p>
                    </div>
                    <div>
                      <Label className="text-sm">CGPA</Label>
                      <p className="text-gray-600 dark:text-gray-400">9.77</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Address</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addr1">Address Line 1</Label>
                        <Input id="addr1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="addr2">Address Line 2</Label>
                        <Input id="addr2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Education</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tenth">10th Percentage/CGPA</Label>
                        <Input id="tenth" value={tenthMarks} onChange={(e) => setTenthMarks(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="twelfth">12th Percentage</Label>
                        <Input id="twelfth" value={twelfthMarks} onChange={(e) => setTwelfthMarks(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Resume</h4>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setResumeName(file.name)
                      }}
                    />
                    {resumeName && <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded: {resumeName}</p>}
                  </div>

                  <div className="flex justify-end">
                    <Button className="mt-2" onClick={handleSaveProfile}>
                      Save Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
