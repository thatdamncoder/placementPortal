"use client"

import { useMemo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { companies } from "@/lib/companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/custom/Header"

export default function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [applied, setApplied] = useState(false)
  const [appliedAt, setAppliedAt] = useState<string | null>(null)

  const company = useMemo(() => companies.find((c) => c.id === id), [id])

  useEffect(() => {
  try {
    const raw = sessionStorage.getItem("appliedCompanies")
    if (raw) {
      const map: Record<string, string> = JSON.parse(raw)
      if (map[id]) {
        setApplied(true)
        setAppliedAt(map[id])
      }
    }
  } catch {}
}, [id])

const handleApply = () => {
  if ((company?.status !== "open") || applied) return
  const now = new Date().toISOString()

  try {
    const raw = sessionStorage.getItem("appliedCompanies")
    const map: Record<string, string> = raw ? JSON.parse(raw) : {}
    map[id] = now  
    sessionStorage.setItem("appliedCompanies", JSON.stringify(map))
  } catch {}

  setApplied(true)
  setAppliedAt(now)
}

  const isOpen = company?.status === "open"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header header="Student Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{company?.name}</CardTitle>
                  <CardDescription className="text-base">{company?.role}</CardDescription>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      company?.status === "open"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : company?.status === "closed"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }
                  >
                    {company?.status}
                  </Badge>
                  <p className="text-lg font-bold text-green-600 mt-1">{company?.package}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description">
                <TabsList className="mb-4 grid grid-cols-4 w-full">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="events">Timeline</TabsTrigger>
                  <TabsTrigger value="status">My Status</TabsTrigger>
                  <TabsTrigger value="annoucements">Announcements</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{company?.description}</p>
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                      {company?.requirements?.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{company?.deadline}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Selection Rounds</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {(company?.rounds || []).map((round: string, i: number) => (
                        <li key={i}>{round}</li>
                      ))}
                    </ol>
                  </div>
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {applied ? "You have applied to this company." : "You have not applied yet."}
                      </p>
                      {appliedAt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Applied on: {new Date(appliedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Badge variant={applied ? "default" : "secondary"}>{applied ? "Applied" : "Not Applied"}</Badge>
                  </div>
                  {!applied && (
                    <Button disabled={!isOpen} className="bg-blue-600 hover:bg-blue-700" onClick={handleApply}>
                      Apply Now
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="annoucements" className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{"Annoucements for this drive will appear here."}</p>
                  {/* <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                      {company?.requirements?.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div> */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply</CardTitle>
              <CardDescription>Deadline: {company?.deadline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review details and apply before the deadline. You can track your application from your dashboard.
              </p>
              <Button
                disabled={!isOpen || applied}
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleApply}
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Applied
                  </>
                ) : isOpen ? (
                  "Apply Now"
                ) : (
                  "Applications Closed"
                )}
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
