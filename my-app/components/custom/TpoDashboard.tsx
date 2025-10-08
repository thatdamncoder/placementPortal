"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Users, Plus, Bell, LogOut, Sparkles, FileText } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import Header from "./Header"

interface Drive {
  id: string
  companyName: string
  role: string
  package: string
  deadline: string
  status: "active" | "closed" | "draft"
  applicants: number
}

export default function TPODashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddDrive, setShowAddDrive] = useState(false)
  const [showAIProcessor, setShowAIProcessor] = useState(false)
  const [aiText, setAiText] = useState("")
  const [aiResult, setAiResult] = useState<any>(null)
  const [newDrive, setNewDrive] = useState({
    companyName: "",
    role: "",
    package: "",
    deadline: "",
    description: "",
    requirements: "",
  })
  const userEmail = "tpo@skit.ac.in"
  const [driveSearch, setDriveSearch] = useState("")
  const [driveStatus, setDriveStatus] = useState<"all" | "active" | "closed" | "draft">("all")
  const [openDriveId, setOpenDriveId] = useState<string | null>(null)
  
  // Mock data
  const drives: Drive[] = [
    {
      id: "1",
      companyName: "Google",
      role: "Software Engineer",
      package: "₹25 LPA",
      deadline: "2025-01-15",
      status: "active",
      applicants: 45,
    },
    {
      id: "2",
      companyName: "Microsoft",
      role: "Product Manager",
      package: "₹22 LPA",
      deadline: "2025-01-20",
      status: "active",
      applicants: 32,
    },
    {
      id: "3",
      companyName: "Amazon",
      role: "Data Scientist",
      package: "₹20 LPA",
      deadline: "2025-01-10",
      status: "closed",
      applicants: 67,
    },
  ]

  const handleLogout = () => {
    signOut({
        callbackUrl: "/"
    })
  }

  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, would save to database
    console.log("Adding drive:", newDrive)
    setShowAddDrive(false)
    setNewDrive({
      companyName: "",
      role: "",
      package: "",
      deadline: "",
      description: "",
      requirements: "",
    })
  }

  const monthlyTrend = [
  { month: "Jan", placed: 12, applications: 80 },
  { month: "Feb", placed: 18, applications: 95 },
  { month: "Mar", placed: 22, applications: 110 },
  { month: "Apr", placed: 30, applications: 140 },
  { month: "May", placed: 28, applications: 120 },
  { month: "Jun", placed: 35, applications: 150 },
]


  const processAIText = () => {
    // Mock AI processing - in real app would use actual AI service
    const mockResult = {
      companyName: "TechCorp Solutions",
      role: "Full Stack Developer",
      package: "₹18 LPA",
      deadline: "2025-02-15",
      description: "Join our dynamic team as a Full Stack Developer and work on cutting-edge web applications.",
      requirements: [
        "B.Tech/M.Tech in CS/IT",
        "Experience with React and Node.js",
        "Strong problem-solving skills",
        "CGPA > 7.0",
      ],
    }
    setAiResult(mockResult)
  }

  const useAIResult = () => {
    if (aiResult) {
      setNewDrive({
        companyName: aiResult.companyName,
        role: aiResult.role,
        package: aiResult.package,
        deadline: aiResult.deadline,
        description: aiResult.description,
        requirements: aiResult.requirements.join("\n"),
      })
      setShowAIProcessor(false)
      setShowAddDrive(true)
      setAiResult(null)
      setAiText("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      !driveSearch.trim() ||
      d.companyName.toLowerCase().includes(driveSearch.toLowerCase()) ||
      d.role.toLowerCase().includes(driveSearch.toLowerCase())
    const matchesStatus = driveStatus === "all" ? true : d.status === driveStatus
    return matchesSearch && matchesStatus
  })


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header header="TPO Dashboard" />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">
              <Building2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="drives">
              <Users className="h-4 w-4 mr-2" />
              Manage Drives
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              Announcements
            </TabsTrigger>
            {/* <TabsTrigger value="ai-processor">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Processor
            </TabsTrigger> */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{drives.filter((d) => d.status === "active").length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{drives.reduce((sum, drive) => sum + drive.applicants, 0)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{drives.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Package</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹22 LPA</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                    <CardDescription>Students needing attention</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                    <div className="p-3 border-l-4 border-l-yellow-500 rounded bg-yellow-50 dark:bg-yellow-900/10">
                        Pending backlogs: 7 students
                    </div>
                    <div className="p-3 border-l-4 border-l-red-500 rounded bg-red-50 dark:bg-red-900/10">
                        Low CGPA &lt; 6.0: 4 students
                    </div>
                    <div className="p-3 border-l-4 border-l-blue-500 rounded bg-blue-50 dark:bg-blue-900/10">
                        Incomplete profiles: 12 students
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Drives</CardTitle>
                        <CardDescription>Latest placement drives and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {drives.slice(0, 3).map((drive) => (
                            <div key={drive.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">{drive.companyName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{drive.role}</p>
                            </div>
                            <div className="text-right">
                                <Badge className={getStatusColor(drive.status)}>{drive.status}</Badge>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{drive.applicants} applicants</p>
                            </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Placement Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Placement Trend</CardTitle>
                <CardDescription>Applications vs placements over recent months</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#60a5fa" strokeWidth={2} />
                    <Line type="monotone" dataKey="placed" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Companies and Alerts */}
            {/* <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Recruiting Companies</CardTitle>
                  <CardDescription>Most activity in recent drives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {drives
                    .slice()
                    .sort((a, b) => b.applicants - a.applicants)
                    .slice(0, 5)
                    .map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{d.companyName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{d.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{d.applicants} applicants</p>
                          <Badge className={getStatusColor(d.status)}>{d.status}</Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>Students needing attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border-l-4 border-l-yellow-500 rounded bg-yellow-50 dark:bg-yellow-900/10">
                    Pending backlogs: 7 students
                  </div>
                  <div className="p-3 border-l-4 border-l-red-500 rounded bg-red-50 dark:bg-red-900/10">
                    Low CGPA &lt; 6.0: 4 students
                  </div>
                  <div className="p-3 border-l-4 border-l-blue-500 rounded bg-blue-50 dark:bg-blue-900/10">
                    Incomplete profiles: 12 students
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>

          {/* Drives Tab */}
          <TabsContent value="drives" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Placement Drives</h2>
              <div className="flex gap-2">
                <Dialog open={showAIProcessor} onOpenChange={setShowAIProcessor}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Processor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>AI Company Information Processor</DialogTitle>
                      <DialogDescription>
                        Paste raw company information and let AI extract structured data
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ai-text">Raw Company Information</Label>
                        <Textarea
                          id="ai-text"
                          placeholder="Paste company information, job description, requirements, etc..."
                          value={aiText}
                          onChange={(e) => setAiText(e.target.value)}
                          rows={8}
                        />
                      </div>
                      <Button onClick={processAIText} disabled={!aiText.trim()}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Process with AI
                      </Button>

                      {aiResult && (
                        <Card className="bg-green-50 dark:bg-green-900/20">
                          <CardHeader>
                            <CardTitle className="text-green-800 dark:text-green-200">
                              AI Extracted Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p>
                              <strong>Company:</strong> {aiResult.companyName}
                            </p>
                            <p>
                              <strong>Role:</strong> {aiResult.role}
                            </p>
                            <p>
                              <strong>Package:</strong> {aiResult.package}
                            </p>
                            <p>
                              <strong>Deadline:</strong> {aiResult.deadline}
                            </p>
                            <p>
                              <strong>Description:</strong> {aiResult.description}
                            </p>
                            <div>
                              <strong>Requirements:</strong>
                              <ul className="list-disc list-inside ml-4">
                                {aiResult.requirements.map((req: string, index: number) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                            <Button onClick={useAIResult} className="mt-4">
                              Use This Information
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAddDrive} onOpenChange={setShowAddDrive}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Drive
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Placement Drive</DialogTitle>
                      <DialogDescription>Create a new placement drive for students to apply</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDrive} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company Name</Label>
                          <Input
                            id="company"
                            value={newDrive.companyName}
                            onChange={(e) => setNewDrive((prev) => ({ ...prev, companyName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Input
                            id="role"
                            value={newDrive.role}
                            onChange={(e) => setNewDrive((prev) => ({ ...prev, role: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="package">Package</Label>
                          <Input
                            id="package"
                            placeholder="e.g., ₹15 LPA"
                            value={newDrive.package}
                            onChange={(e) => setNewDrive((prev) => ({ ...prev, package: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="deadline">Application Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={newDrive.deadline}
                            onChange={(e) => setNewDrive((prev) => ({ ...prev, deadline: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                          id="description"
                          value={newDrive.description}
                          onChange={(e) => setNewDrive((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="requirements">Requirements (one per line)</Label>
                        <Textarea
                          id="requirements"
                          value={newDrive.requirements}
                          onChange={(e) => setNewDrive((prev) => ({ ...prev, requirements: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create Drive
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filter Toolbar */}
            <Card className="w-[50%]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    placeholder="Search by company or role"
                    value={driveSearch}
                    onChange={(e) => setDriveSearch(e.target.value)}
                  />
                  <Select value={driveStatus} onValueChange={(v) => setDriveStatus(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* List Filtered Drives with 'Open' */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredDrives.map((drive) => (
                    <Card key={drive.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{drive.companyName}</CardTitle>
                            <CardDescription>{drive.role}</CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(drive.status)}>{drive.status}</Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {drive.applicants} applicants
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-green-600">{drive.package}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Deadline: {drive.deadline}</p>
                          </div>
                          <Link href={`./tpo/drives/${drive.id}`}>
                            <Button variant="default" size="sm" disabled={drive.status === "closed"}>
                             Open
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredDrives.length === 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No drives match your filters.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Public Announcements</CardTitle>
                <CardDescription>Notify all students about important updates. For company specific announcements,
                    check Announcements tab for each company drive in the previous section.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="announcement-title">Title</Label>
                    <Input id="announcement-title" placeholder="Announcement title" />
                  </div>
                  <div>
                    <Label htmlFor="announcement-message">Message</Label>
                    <Textarea id="announcement-message" placeholder="Type your announcement here..." rows={4} />
                  </div>
                  <Button>
                    <Bell className="h-4 w-4 mr-2" />
                    Send Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Processor Tab */}
          {/* <TabsContent value="ai-processor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI Company Information Processor
                </CardTitle>
                <CardDescription>Extract structured company information from raw text using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="raw-text">Raw Company Information</Label>
                    <Textarea
                      id="raw-text"
                      placeholder="Paste company information, job descriptions, requirements, or any unstructured text about placement drives..."
                      value={aiText}
                      onChange={(e) => setAiText(e.target.value)}
                      rows={10}
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={processAIText} disabled={!aiText.trim()} className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Process with AI
                  </Button>

                  {aiResult && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <CardHeader>
                        <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          AI Extracted Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Company Name</Label>
                            <p className="text-gray-900 dark:text-gray-100">{aiResult.companyName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Role</Label>
                            <p className="text-gray-900 dark:text-gray-100">{aiResult.role}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Package</Label>
                            <p className="text-gray-900 dark:text-gray-100">{aiResult.package}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Deadline</Label>
                            <p className="text-gray-900 dark:text-gray-100">{aiResult.deadline}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Description</Label>
                          <p className="text-gray-900 dark:text-gray-100">{aiResult.description}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Requirements</Label>
                          <ul className="list-disc list-inside text-gray-900 dark:text-gray-100 space-y-1">
                            {aiResult.requirements.map((req: string, index: number) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button onClick={useAIResult} className="flex-1">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Drive from This Data
                          </Button>
                          <Button variant="outline" onClick={() => setAiResult(null)}>
                            Clear
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How it works:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Paste any unstructured company information or job posting</li>
                      <li>AI will extract company name, role, package, deadline, and requirements</li>
                      <li>Review the extracted information and create a placement drive</li>
                      <li>Save time on manual data entry and reduce errors</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
