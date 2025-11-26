"use client"

import { use } from 'react'
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Edit, Trash2, Upload, Download, ChevronLeft, ArrowLeft } from "lucide-react"
import Header from "@/components/custom/Header"

type Drive = {
  id: string
  companyName: string
  role: string
  package: string
  deadline: string
  status: "open" | "closed" | "draft"
  applicants: number
  requirements?: string
  description?: string
}

type Applicant = {
  id: string
  name: string
  branch: string
  cgpa: number
  status: "Applied" | "Shortlisted" | "Selected" | "Rejected"
}

type ResultRow = {
  id: string
  name: string
  status: "Selected" | "Rejected" | "Waitlisted"
}

type AnnouncementPost = {
  id: string
  text: string
  fileName?: string
  fileDataUrl?: string
  createdAt: string
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const {id: driveId} = use(params);

  const [drive, setDrive] = useState<Drive | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  // Applicants
  const [applicants, setApplicants] = useState<Applicant[]>([])

  // Results
  const [results, setResults] = useState<ResultRow[]>([])

  // Announcements
  const [posts, setPosts] = useState<AnnouncementPost[]>([])
  const [postText, setPostText] = useState("")
  const [postFile, setPostFile] = useState<File | null>(null)

  // Load drive + related data from localStorage
  useEffect(() => {
    try {
      const savedDrives = localStorage.getItem("tpo_drives")
      const list: Drive[] = savedDrives ? JSON.parse(savedDrives) : []
      const found = list.find((d) => d.id === driveId) || null
      setDrive(
        found || {
          id: "1",
    companyName: "Google",
    role: "Software Engineer",
    package: "₹25 LPA",
    deadline: "2025-01-15",
    status: "open",
    description: "Join Google as a Software Engineer and work on cutting-edge technology. B.Tech/M.Tech in CS/IT Strong programming skills, CGPA > 8.0",
    applicants: 45,
},
      )
    } catch {
      setDrive({
        id: driveId,
        companyName: "Unknown Company",
        role: "Role",
        package: "—",
        deadline: "—",
        status: "draft",
        applicants: 0,
      })
    }

    // Applicants
    try {
      const saved = localStorage.getItem(`tpo_applicants_${driveId}`)
      if (saved) {
        setApplicants(JSON.parse(saved))
      } else {
        const seed: Applicant[] = [
          { id: "s1", name: "Aarav Sharma", branch: "CSE", cgpa: 8.2, status: "Applied" },
          { id: "s2", name: "Priya Verma", branch: "ECE", cgpa: 7.6, status: "Shortlisted" },
          { id: "s3", name: "Rahul Mehta", branch: "EEE", cgpa: 6.9, status: "Applied" },
        ]
        setApplicants(seed)
        localStorage.setItem(`tpo_applicants_${driveId}`, JSON.stringify(seed))
      }
    } catch {}

    // Results
    try {
      const saved = localStorage.getItem(`tpo_results_${driveId}`)
      setResults(saved ? JSON.parse(saved) : [])
    } catch {}

    // Announcements
    try {
      const saved = localStorage.getItem(`tpo_announcements_${driveId}`)
      setPosts(saved ? JSON.parse(saved) : [])
    } catch {}
  }, [driveId])

  const saveDrives = (next: Drive[]) => {
    try {
      localStorage.setItem("tpo_drives", JSON.stringify(next))
    } catch {}
  }

  const updateDrive = (partial: Partial<Drive>) => {
    if (!drive) return
    const next = { ...drive, ...partial }
    setDrive(next)
    try {
      const saved = localStorage.getItem("tpo_drives")
      const list: Drive[] = saved ? JSON.parse(saved) : []
      const merged = list.map((d) => (d.id === drive.id ? next : d))
      saveDrives(merged)
    } catch {}
  }

  const deleteDrive = () => {
    if (!drive) return
    if (!confirm("Delete this drive? This cannot be undone.")) return
    try {
      const saved = localStorage.getItem("tpo_drives")
      const list: Drive[] = saved ? JSON.parse(saved) : []
      const remaining = list.filter((d) => d.id !== drive.id)
      saveDrives(remaining)
      // cleanup related data
      localStorage.removeItem(`tpo_applicants_${drive.id}`)
      localStorage.removeItem(`tpo_results_${drive.id}`)
      localStorage.removeItem(`tpo_announcements_${drive.id}`)
    } finally {
      router.push("/tpo")
    }
  }

  // Applicants helpers
  const setApplicantsAndPersist = (rows: Applicant[]) => {
    setApplicants(rows)
    try {
      localStorage.setItem(`tpo_applicants_${driveId}`, JSON.stringify(rows))
    } catch {}
  }

  const bulkApplicantsStatus = (status: Applicant["status"]) => {
    setApplicantsAndPersist(applicants.map((a) => ({ ...a, status })))
  }

  // CSV helpers
  const downloadCSV = (filename: string, rows: any[]) => {
    const csv = [
      Object.keys(rows[0] || {}).join(","),
      ...rows.map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const parseCSV = async (file: File): Promise<any[]> => {
    const text = await file.text()
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean)
    const headers = headerLine.split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
    return lines.map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""))
      return headers.reduce((acc: any, h, i) => ((acc[h] = cols[i] ?? ""), acc), {})
    })
  }

  // Results helpers
  const setResultsAndPersist = (rows: ResultRow[]) => {
    setResults(rows)
    try {
      localStorage.setItem(`tpo_results_${driveId}`, JSON.stringify(rows))
    } catch {}
  }

  const header = useMemo(() => {
    if (!drive) return null
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pretty">{drive.companyName}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {drive.role} • Package {drive.package}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Drive
          </Button>
          <Button variant="destructive" onClick={deleteDrive}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Drive
          </Button>
        </div>
      </div>
    )
  }, [drive])

  if (!drive) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <Link href="/tpo" className="inline-flex items-center gap-2 text-blue-600">
          <ChevronLeft className="h-4 w-4" /> Back to TPO
        </Link>
        <p className="mt-6">Loading...</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header header="TPO Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{drive?.companyName}</CardTitle>
                  <CardDescription className="text-base">{drive?.role}</CardDescription>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      drive?.status === "open"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : drive?.status === "closed"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }
                  >
                    {drive?.status}
                  </Badge>
                  <p className="text-lg font-bold text-green-600 mt-1">{drive?.package}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="desc" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="desc">Description</TabsTrigger>
          <TabsTrigger value="events">Events / Timeline</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="annc">Announcements</TabsTrigger>
        </TabsList>

        {/* Description */}
        <TabsContent value="desc" className="space-y-3">
          <Card>
            <CardContent className="p-4 space-y-2">
              <p>
                <span className="font-medium">Role:</span> {drive.role}
              </p>
              <p>
                <span className="font-medium">Package:</span> {drive.package}
              </p>
              <p>
                <span className="font-medium">Eligibility:</span> CGPA ≥ 7.0, No active backlogs, Batch 2025
              </p>
              <p className="text-pretty">
                {drive.requirements || "Online assessment followed by technical and HR rounds."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events / Timeline */}
        <TabsContent value="events" className="space-y-3">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Application Deadline</span>
                <Badge>Deadline: {drive.deadline}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Round 1: Online Test</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Round 2: Technical Interview</span>
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>HR Discussion</span>
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applicants (Excel-like table + CSV import/export) */}
        <TabsContent value="applicants" className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Applicants</h4>
            <div className="flex items-center gap-2">
              <Select onValueChange={(v) => bulkApplicantsStatus(v as Applicant["status"])}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Bulk update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => applicants.length && downloadCSV(`applicants_${drive.companyName}.csv`, applicants)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const rows = await parseCSV(f)
                    // expect headers: id,name,branch,cgpa,status
                    const mapped: Applicant[] = rows.map((r: any) => ({
                      id: r.id || String(Math.random()).slice(2),
                      name: r.name || "",
                      branch: r.branch || "",
                      cgpa: Number(r.cgpa || 0),
                      status: (r.status as Applicant["status"]) || "Applied",
                    }))
                    setApplicantsAndPersist(mapped)
                    e.currentTarget.value = ""
                  }}
                />
              </label>
            </div>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">CGPA</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {applicants.map((a) => (
                    <tr key={a.id}>
                      <td className="p-3">{a.name}</td>
                      <td className="p-3">{a.branch}</td>
                      <td className="p-3">{a.cgpa}</td>
                      <td className="p-3">
                        <Select
                          value={a.status}
                          onValueChange={(v) => {
                            const next = applicants.map((row) =>
                              row.id === a.id ? { ...row, status: v as Applicant["status"] } : row,
                            )
                            setApplicantsAndPersist(next)
                          }}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="Selected">Selected</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results (Upload + view) */}
        <TabsContent value="results" className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Drive Results</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => results.length && downloadCSV(`results_${drive.companyName}.csv`, results)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const rows = await parseCSV(f)
                    // expect headers: id,name,status
                    const mapped: ResultRow[] = rows.map((r: any) => ({
                      id: r.id || String(Math.random()).slice(2),
                      name: r.name || "",
                      status: (r.status as ResultRow["status"]) || "Selected",
                    }))
                    setResultsAndPersist(mapped)
                    e.currentTarget.value = ""
                  }}
                />
              </label>
            </div>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((r) => (
                    <tr key={r.id}>
                      <td className="p-3">{r.name}</td>
                      <td className="p-3">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements (LinkedIn-like post with text + PDF/TXT) */}
        <TabsContent value="annc" className="space-y-3">
          <Card>
            <CardContent className="p-4 space-y-3">
              <Textarea
                placeholder="Share an update for this drive..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>Attach PDF/TXT</span>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    className="sr-only"
                    onChange={(e) => setPostFile(e.target.files?.[0] || null)}
                  />
                </label>
                <Button
                  onClick={async () => {
                    if (!postText.trim() && !postFile) return
                    let fileName: string | undefined
                    let fileDataUrl: string | undefined
                    if (postFile) {
                      fileName = postFile.name
                      const buf = await postFile.arrayBuffer()
                      const blob = new Blob([buf], { type: postFile.type })
                      fileDataUrl = await new Promise<string>((res) => {
                        const r = new FileReader()
                        r.onload = () => res(String(r.result))
                        r.readAsDataURL(blob)
                      })
                    }
                    const next: AnnouncementPost = {
                      id: Date.now().toString(),
                      text: postText.trim(),
                      fileName,
                      fileDataUrl,
                      createdAt: new Date().toISOString(),
                    }
                    const all = [next, ...posts]
                    setPosts(all)
                    try {
                      localStorage.setItem(`tpo_announcements_${driveId}`, JSON.stringify(all))
                    } catch {}
                    setPostText("")
                    setPostFile(null)
                  }}
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {posts.length === 0 && <p className="text-sm text-gray-600 dark:text-gray-400">No announcements yet.</p>}
            {posts.map((p) => (
              <Card key={p.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-base">Announcement</CardTitle>
                  <CardDescription>{new Date(p.createdAt).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {p.text && <p className="text-pretty">{p.text}</p>}
                  {p.fileName && p.fileDataUrl && (
                    <a href={p.fileDataUrl} download={p.fileName} className="text-blue-600 underline">
                      {p.fileName}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
            </CardContent>
          </Card>

          <Card className="self-start sticky top-18">
            <CardHeader>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Edit Drive
              </Button>
              <Button
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Delete Drive
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
