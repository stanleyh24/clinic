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
import { Calendar as CalendarIcon, Plus, Search } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'

type HealthRecord = {
  id: number;
  patientName: string;
  dateOfBirth: Date;
  gender: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  lastUpdated: Date;
}

export function ElectronicHealthRecordsComponent() {
  const [records, setRecords] = useState<HealthRecord[]>([
    { 
      id: 1, 
      patientName: "John Doe", 
      dateOfBirth: new Date(1980, 5, 15), 
      gender: "Male",
      diagnosis: "Hypertension", 
      treatment: "Lifestyle changes, regular check-ups", 
      medication: "Lisinopril 10mg daily",
      lastUpdated: new Date(2024, 9, 1)
    },
    { 
      id: 2, 
      patientName: "Jane Smith", 
      dateOfBirth: new Date(1992, 8, 22), 
      gender: "Female",
      diagnosis: "Type 2 Diabetes", 
      treatment: "Diet control, exercise regimen", 
      medication: "Metformin 500mg twice daily",
      lastUpdated: new Date(2024, 9, 5)
    },
  ])
  const [newRecord, setNewRecord] = useState<Omit<HealthRecord, 'id' | 'lastUpdated'>>({
    patientName: '',
    dateOfBirth: new Date(),
    gender: '',
    diagnosis: '',
    treatment: '',
    medication: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRecord(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewRecord(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewRecord(prev => ({ ...prev, dateOfBirth: date }))
      setIsCalendarOpen(false)
    }
  }

  const handleAddRecord = () => {
    setRecords(prev => [...prev, { ...newRecord, id: prev.length + 1, lastUpdated: new Date() }])
    setNewRecord({
      patientName: '',
      dateOfBirth: new Date(),
      gender: '',
      diagnosis: '',
      treatment: '',
      medication: '',
    })
  }

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Electronic Health Records</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Records List</TabsTrigger>
          <TabsTrigger value="add">Add Record</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search records..."
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
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.patientName}</TableCell>
                      <TableCell>{format(record.dateOfBirth, 'PP')}</TableCell>
                      <TableCell>{record.gender}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>{record.medication}</TableCell>
                      <TableCell>{format(record.lastUpdated, 'PP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Health Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" name="patientName" value={newRecord.patientName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="flex items-center">
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={format(newRecord.dateOfBirth, 'PP')}
                      readOnly
                      onClick={() => setIsCalendarOpen(true)}
                    />
                    <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setIsCalendarOpen(true)} />
                  </div>
                  {isCalendarOpen && (
                    <div className="absolute z-10 bg-white border rounded-md shadow-md">
                      <Calendar
                        mode="single"
                        selected={newRecord.dateOfBirth}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" value={newRecord.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea id="diagnosis" name="diagnosis" value={newRecord.diagnosis} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea id="treatment" name="treatment" value={newRecord.treatment} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="medication">Medication</Label>
                  <Textarea id="medication" name="medication" value={newRecord.medication} onChange={handleInputChange} />
                </div>
                <Button type="button" onClick={handleAddRecord}>Add Health Record</Button>
              </form>
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
            <DialogTitle>Quick Add Health Record</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="quickPatientName">Patient Name</Label>
              <Input id="quickPatientName" name="patientName" value={newRecord.patientName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickDateOfBirth">Date of Birth</Label>
              <div className="flex items-center">
                <Input
                  id="quickDateOfBirth"
                  name="dateOfBirth"
                  value={format(newRecord.dateOfBirth, 'PP')}
                  readOnly
                  onClick={() => setIsCalendarOpen(true)}
                />
                <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setIsCalendarOpen(true)} />
              </div>
              {isCalendarOpen && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={newRecord.dateOfBirth}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="quickGender">Gender</Label>
              <Select name="gender" value={newRecord.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quickDiagnosis">Diagnosis</Label>
              <Textarea id="quickDiagnosis" name="diagnosis" value={newRecord.diagnosis} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickTreatment">Treatment</Label>
              <Textarea id="quickTreatment" name="treatment" value={newRecord.treatment} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickMedication">Medication</Label>
              <Textarea id="quickMedication" name="medication" value={newRecord.medication} onChange={handleInputChange} />
            </div>
            <Button type="button" onClick={handleAddRecord}>Add Health Record</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}