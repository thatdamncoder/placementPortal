"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Building2, Users, Calendar } from "lucide-react"
import { signIn } from "next-auth/react"
export default function HomePage() {
  const [userType, setUserType] = useState<"student" | "tpo">("student")
  const [credentials, setCredentials] = useState({ email: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // if (userType === "tpo") {
    //   // await signIn("credentials", {
    //   //   email: credentials.email,
    //   //   password: credentials.password,
    //   //   callbackUrl: "/tpo"
    //   // })
    //   return
    // }
    await signIn("google", {
      callbackUrl: userType === "student" ? "/student" : "/tpo"
    })

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">College Placement Portal</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
              Streamline Your Placement Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
              Connect students with opportunities and manage placement drives efficiently
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Company Drives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage and track placement drives from top companies
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Student Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Track applications, results, and student progress</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>Calendar Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Never miss important placement dates and deadlines</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Login Form */}
          <Card className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Access your placement portal dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={userType} onValueChange={(value) => setUserType(value as "student" | "tpo")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="tpo">TPO</TabsTrigger>
                </TabsList>

                <form onSubmit={handleLogin} className="space-y-4">
                  {
                    userType === "tpo" && 
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        />
                     </div>
                  }

                  {
                    userType === "tpo" &&
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        />
                    </div>
                  }

                  <Button type="submit" className="w-full" onClick={handleLogin}>
                    Sign In {userType === "student" ? " with Google" : "as TPO"}
                  </Button>
                </form>

              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
