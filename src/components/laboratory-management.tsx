"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Plus, Search, TestTube, FileText, AlertTriangle } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'

type LabTest = {
  id: number;
  patientName: string;
  testName: string;
  orderDate: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Routine' | 'Urgent' | 'STAT';
  results: string;
}

type Specimen = {
  id: number;
  patientName: string;
  specimenType: string;
  collectionDate: Date;
  status: 'Collected' | 'In Lab' | 'Analyzed' | 'Disposed';
}

export function LaboratoryManagementComponent() {
  const [labTests, setLabTests] = useState<LabTest[]>([
    { id: 1, patientName: "John Doe", testName: "Complete Blood Count", orderDate: new Date(2024, 9, 1), status: 'Pending', priority: 'Routine', results: '' },
    { id: 2, patientName: "Jane Smith", testName: "Lipid Panel", orderDate: new Date(2024, 9, 2), status: 'Completed', priority: 'Urgent', results: 'Total Cholesterol: 180 mg/dL, HDL: 50 mg/dL, LDL: 110 mg/dL, Triglycerides: 100 mg/dL' },
  ])
  const [specimens, setSpecimens] = useState<Specimen[]>([
    { id: 1, patientName: "John Doe", specimenType: "Blood", collectionDate: new Date(2024, 9, 1), status: 'In Lab' },
    { id: 2, patientName: "Jane Smith", specimenType: "Urine", collectionDate: new Date(2024, 9, 2), status: 'Analyzed' },
  ])
  const [newLabTest, setNewLabTest] = useState<Omit<LabTest, 'id'>>({
    patientName: '',
    testName: '',
    orderDate: new Date(),
    status: 'Pending',
    priority: 'Routine',
    results: '',
  })
  const [newSpecimen, setNewSpecimen] = useState<Omit<Specimen, 'id'>>({
    patientName: '',
    specimenType: '',
    collectionDate: new Date(),
    status: 'Collected',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('labTests')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'orderDate' | 'collectionDate'>('orderDate')

  const handleLabTestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewLabTest(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecimenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSpecimen(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (activeTab === 'labTests') {
      setNewLabTest(prev => ({ ...prev, [name]: value }))
    } else {
      setNewSpecimen(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      if (activeTab === 'labTests') {
        setNewLabTest(prev => ({ ...prev, orderDate: date }))
      } else {
        setNewSpecimen(prev => ({ ...prev, collectionDate: date }))
      }
      setIsCalendarOpen(false)
    }
  }

  const handleAddLabTest = () => {
    setLabTests(prev => [...prev, { ...newLabTest, id: prev.length + 1 }])
    setNewLabTest({
      patientName: '',
      testName: '',
      orderDate: new Date(),
      status: 'Pending',
      priority: 'Routine',
      results: '',
    })
  }

  const handleAddSpecimen = () => {
    setSpecimens(prev => [...prev, { ...newSpecimen, id: prev.length + 1 }])
    setNewSpecimen({
      patientName: '',
      specimenType: '',
      collectionDate: new Date(),
      status: 'Collected',
    })
  }

  const filteredLabTests = labTests.filter(test => 
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSpecimens = specimens.filter(specimen => 
    specimen.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specimen.specimenType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Laboratory Management</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="labTests" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="labTests">Lab Tests</TabsTrigger>
          <TabsTrigger value="specimens">Specimens</TabsTrigger>
        </TabsList>
        <TabsContent value="labTests">
          <Card>
            <CardHeader>
              <CardTitle>Lab Tests</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search lab tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Results</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLabTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.patientName}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{format(test.orderDate, 'PP')}</TableCell>
                      <TableCell>{test.status}</TableCell>
                      <TableCell>
                        {test.priority === 'STAT' ? (
                          <span className="flex items-center text-red-500">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            {test.priority}
                          </span>
                        ) : test.priority === 'Urgent' ? (
                          <span className="text-orange-500">{test.priority}</span>
                        ) : (
                          <span>{test.priority}</span>
                        )}
                      </TableCell>
                      <TableCell>{test.results || 'Pending'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specimens">
          <Card>
            <CardHeader>
              <CardTitle>Specimens</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search specimens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Specimen Type</TableHead>
                    <TableHead>Collection Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpecimens.map((specimen) => (
                    <TableRow key={specimen.id}>
                      <TableCell>{specimen.patientName}</TableCell>
                      <TableCell>{specimen.specimenType}</TableCell>
                      <TableCell>{format(specimen.collectionDate, 'PP')}</TableCell>
                      <TableCell>{specimen.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full p-3">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeTab === 'labTests' ? 'Add New Lab Test' : 'Add New Specimen'}</DialogTitle>
          </DialogHeader>
          {activeTab === 'labTests' ? (
            <form className="space-y-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" name="patientName" value={newLabTest.patientName} onChange={handleLabTestInputChange} />
              </div>
              <div>
                <Label htmlFor="testName">Test Name</Label>
                <Input id="testName" name="testName" value={newLabTest.testName} onChange={handleLabTestInputChange} />
              </div>
              <div>
                <Label htmlFor="orderDate">Order Date</Label>
                <div className="flex items-center">
                  <Input
                    id="orderDate"
                    name="orderDate"
                    value={format(newLabTest.orderDate, 'PP')}
                    readOnly
                    onClick={() => {
                      setActiveDate('orderDate')
                      setIsCalendarOpen(true)
                    }}
                  />
                  <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => {
                    setActiveDate('orderDate')
                    setIsCalendarOpen(true)
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={newLabTest.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" value={newLabTest.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="results">Results</Label>
                <Textarea id="results" name="results" value={newLabTest.results} onChange={handleLabTestInputChange} />
              </div>
              <Button type="button" onClick={handleAddLabTest}>Add Lab Test</Button>
            </form>
          ) : (
            <form className="space-y-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" name="patientName" value={newSpecimen.patientName} onChange={handleSpecimenInputChange} />
              </div>
              <div>
                <Label htmlFor="specimenType">Specimen Type</Label>
                <Input id="specimenType" name="specimenType" value={newSpecimen.specimenType} onChange={handleSpecimenInputChange} />
              </div>
              <div>
                <Label htmlFor="collectionDate">Collection Date</Label>
                <div className="flex items-center">
                  <Input
                    id="collectionDate"
                    name="collectionDate"
                    value={format(newSpecimen.collectionDate, 'PP')}
                    readOnly
                    onClick={() => {
                      setActiveDate('collectionDate')
                      setIsCalendarOpen(true)
                    }}
                  />
                  <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => {
                    setActiveDate('collectionDate')
                    setIsCalendarOpen(true)
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={newSpecimen.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Collected">Collected</SelectItem>
                    <SelectItem value="In Lab">In Lab</SelectItem>
                    <SelectItem value="Analyzed">Analyzed</SelectItem>
                    <SelectItem value="Disposed">Disposed</SelectItem>
                  
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={handleAddSpecimen}>Add Specimen</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {isCalendarOpen && (
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Date</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={activeTab === 'labTests' ? newLabTest.orderDate : newSpecimen.collectionDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}