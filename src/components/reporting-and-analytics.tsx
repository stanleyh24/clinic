"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, TrendingUp, Users, DollarSign, Activity} from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Link from 'next/link'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type KPI = {
  label: string
  value: string | number
  icon: React.ReactNode
  change: number
}

type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
  }[]
}

export function ReportingAndAnalyticsComponent() {
 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const kpis: KPI[] = [
    { label: 'Total Patients', value: 1250, icon: <Users className="h-4 w-4" />, change: 5.2 },
    { label: 'Average Length of Stay', value: '3.2 days', icon: <Activity className="h-4 w-4" />, change: -1.5 },
    { label: 'Revenue', value: '$2.5M', icon: <DollarSign className="h-4 w-4" />, change: 7.8 },
    { label: 'Patient Satisfaction', value: '92%', icon: <TrendingUp className="h-4 w-4" />, change: 2.1 },
  ]

  const patientStatistics: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inpatients',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Outpatients',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  const financialMetrics: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200000, 1350000, 1100000, 1400000, 1300000, 1500000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Expenses',
        data: [1000000, 1100000, 950000, 1200000, 1150000, 1300000],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
    ],
  }

  const departmentPerformance: ChartData = {
    labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Oncology'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [300, 250, 400, 200, 150],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  }

 

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Reporting & Analytics</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
            onClick={() => setIsCalendarOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
          </Button>
          {isCalendarOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1">
              <Calendar
                mode="range"
                initialFocus
              />
            </div>
          )}
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="oncology">Oncology</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.label}
              </CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patient Statistics</TabsTrigger>
          <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
          <TabsTrigger value="departments">Department Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Bar
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      type: 'category' as const,
                    },
                    y: {
                      type: 'linear' as const,
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Patient Admissions',
                    },
                  },
                }}
                data={patientStatistics}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Bar
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      type: 'category' as const,
                    },
                    y: {
                      type: 'linear' as const,
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Revenue vs Expenses',
                    },
                  },
                }}
                data={financialMetrics}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Bar
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      type: 'category' as const,
                    },
                    y: {
                      type: 'linear' as const,
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Patient Visits by Department',
                    },
                  },
                }}
                data={departmentPerformance}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}