"use client"

import type React from "react"

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
import { Building2, Users, Plus, Upload, Bell, LogOut, FileText, Sparkles } from "lucide-react"

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
  const [userEmail, setUserEmail] = useState("")
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

  // Mock data
  const drives: Drive[] = [
    {
      id: "1",
      companyName: "Google",
      role: "Software Engineer",
      package: "₹25 LPA",
      deadline: "2024-01-15",
      status: "active",
      applicants: 45,
    },
    {
      id: "2",
      companyName: "Microsoft",
      role: "Product Manager",
      package: "₹22 LPA",
      deadline: "2024-01-20",
      status: "active",
      applicants: 32,
    },
    {
      id: "3",
      companyName: "Amazon",
      role: "Data Scientist",
      package: "₹20 LPA",
      deadline: "2024-01-10",
      status: "closed",
      applicants: 67,
    },
  ]

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    const userType = localStorage.getItem("userType")
    if (!email || userType !== "tpo") {
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

  const processAIText = () => {
    // Mock AI processing - in real app would use actual AI service
    const mockResult = {
      companyName: "TechCorp Solutions",
      role: "Full Stack Developer",
      package: "₹18 LPA",
      deadline: "2024-02-15",
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TPO Dashboard</h1>
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
            <TabsTrigger value="overview">
              <Building2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="drives">
              <Users className="h-4 w-4 mr-2" />
              Manage Drives
            </TabsTrigger>
            <TabsTrigger value="results">
              <Upload className="h-4 w-4 mr-2" />
              Upload Results
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="ai-processor">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Processor
            </TabsTrigger>
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

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {drives.map((drive) => (
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
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View Applications
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Placement Results</CardTitle>
                <CardDescription>Upload and manage placement results for drives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Drag and drop your results file here, or click to browse
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Uploads</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Google_Results_2024.xlsx</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded 2 days ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Microsoft_Results_2024.xlsx</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded 1 week ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Announcements</CardTitle>
                <CardDescription>Notify students about important updates</CardDescription>
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
          <TabsContent value="ai-processor" className="space-y-6">
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
                      <li>• Paste any unstructured company information or job posting</li>
                      <li>• AI will extract company name, role, package, deadline, and requirements</li>
                      <li>• Review the extracted information and create a placement drive</li>
                      <li>• Save time on manual data entry and reduce errors</li>
                    </ul>
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
