'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, FileText, CreditCard, Package, UserCog, Pill, TestTube, BarChart } from 'lucide-react'

export function DashboardComponent() {
  const modules = [
    { name: 'Patient Management', path:"/patients", icon: <Users className="h-4 w-4" /> },
    { name: 'Appointments',path:"/appointment", icon: <Calendar className="h-4 w-4" /> },
    { name: 'Electronic Health Records',path:"/ehr", icon: <FileText className="h-4 w-4" /> },
    { name: 'Billing & Insurance', path:"/billing",icon: <CreditCard className="h-4 w-4" /> },
    { name: 'Inventory', path:"/inventory",icon: <Package className="h-4 w-4" /> },
    { name: 'Staff Management',path:"/staff", icon: <UserCog className="h-4 w-4" /> },
    { name: 'Pharmacy',path:"/pharmacy", icon: <Pill className="h-4 w-4" /> },
    { name: 'Laboratory',path:"/laboratory", icon: <TestTube className="h-4 w-4" /> },
    { name: 'Reports & Analytics',path:"/report", icon: <BarChart className="h-4 w-4" /> },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Hospital Management System</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Hospital Management System</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Select a module from the dashboard to get started.</p>
            </CardContent>
          </Card>
          {/* Add more overview content here */}
        </TabsContent>
        <TabsContent value="modules" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
                {module.icon}
              </CardHeader>
              <CardContent>
                <Link href={`${module.path}`}><Button className="w-full">Access Module</Button></Link>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}