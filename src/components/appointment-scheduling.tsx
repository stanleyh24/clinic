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
import { Calendar as CalendarIcon, Clock, Plus, Search } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'

type Appointment = {
  id: number;
  patientName: string;
  doctorName: string;
  date: Date;
  time: string;
  department: string;
}

export function AppointmentSchedulingComponent() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "Alice Johnson", doctorName: "Dr. Smith", date: new Date(2024, 9, 15), time: "10:00 AM", department: "Cardiology" },
    { id: 2, patientName: "Bob Williams", doctorName: "Dr. Lee", date: new Date(2024, 9, 16), time: "2:00 PM", department: "Neurology" },
  ])
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    patientName: '',
    doctorName: '',
    date: new Date(),
    time: '',
    department: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAppointment(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAppointment(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewAppointment(prev => ({ ...prev, date }))
      setIsCalendarOpen(false)
    }
  }

  const handleAddAppointment = () => {
    setAppointments(prev => [...prev, { ...newAppointment, id: prev.length + 1 }])
    setNewAppointment({
      patientName: '',
      doctorName: '',
      date: new Date(),
      time: '',
      department: ''
    })
  }

  const filteredAppointments = appointments.filter(appointment => 
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Appointment Scheduling</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Appointment List</TabsTrigger>
          <TabsTrigger value="add">Schedule Appointment</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Appointment List</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search appointments..."
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
                    <TableHead>Doctor Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>{format(appointment.date, 'PP')}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.department}</TableCell>
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
              <CardTitle>Schedule New Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" name="patientName" value={newAppointment.patientName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input id="doctorName" name="doctorName" value={newAppointment.doctorName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <div className="flex items-center">
                    <Input
                      id="date"
                      name="date"
                      value={format(newAppointment.date, 'PP')}
                      readOnly
                      onClick={() => setIsCalendarOpen(true)}
                    />
                    <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setIsCalendarOpen(true)} />
                  </div>
                  {isCalendarOpen && (
                    <div className="absolute z-10 bg-white border rounded-md shadow-md">
                      <Calendar
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <div className="flex items-center">
                    <Input id="time" name="time" value={newAppointment.time} onChange={handleInputChange} />
                    <Clock className="ml-2 h-4 w-4" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" value={newAppointment.department} onValueChange={(value) => handleSelectChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={handleAddAppointment}>Schedule Appointment</Button>
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
            <DialogTitle>Quick Schedule Appointment</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="quickPatientName">Patient Name</Label>
              <Input id="quickPatientName" name="patientName" value={newAppointment.patientName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickDoctorName">Doctor Name</Label>
              <Input id="quickDoctorName" name="doctorName" value={newAppointment.doctorName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickDate">Date</Label>
              <div className="flex items-center">
                <Input
                  id="quickDate"
                  name="date"
                  value={format(newAppointment.date, 'PP')}
                  readOnly
                  onClick={() => setIsCalendarOpen(true)}
                />
                <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setIsCalendarOpen(true)} />
              </div>
              {isCalendarOpen && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={newAppointment.date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="quickTime">Time</Label>
              <div className="flex items-center">
                <Input id="quickTime" name="time" value={newAppointment.time} onChange={handleInputChange} />
                <Clock className="ml-2 h-4 w-4" />
              </div>
            </div>
            <div>
              <Label htmlFor="quickDepartment">Department</Label>
              <Select name="department" value={newAppointment.department} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={handleAddAppointment}>Schedule Appointment</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}