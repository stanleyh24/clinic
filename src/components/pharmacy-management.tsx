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

import { Calendar as CalendarIcon, Plus, Search, AlertTriangle } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'

type Medication = {
  id: number;
  name: string;
  dosage: string;
  quantity: number;
  expirationDate: Date;
  supplier: string;
}

type Prescription = {
  id: number;
  patientName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  prescribedBy: string;
  status: 'Pending' | 'Dispensed' | 'Completed';
}

export function PharmacyManagementComponent() {
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: "Amoxicillin", dosage: "500mg", quantity: 1000, expirationDate: new Date(2025, 11, 31), supplier: "PharmaCorp" },
    { id: 2, name: "Lisinopril", dosage: "10mg", quantity: 500, expirationDate: new Date(2026, 5, 30), supplier: "MediSupply" },
  ])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: 1, patientName: "John Doe", medicationName: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", startDate: new Date(2024, 9, 1), endDate: new Date(2024, 9, 7), prescribedBy: "Dr. Smith", status: 'Pending' },
    { id: 2, patientName: "Jane Smith", medicationName: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: new Date(2024, 9, 2), endDate: new Date(2024, 10, 2), prescribedBy: "Dr. Johnson", status: 'Dispensed' },
  ])
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    quantity: 0,
    expirationDate: new Date(),
    supplier: '',
  })
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, 'id'>>({
    patientName: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: new Date(),
    endDate: new Date(),
    prescribedBy: '',
    status: 'Pending',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('medications')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'expirationDate' | 'startDate' | 'endDate'>('expirationDate')

  const handleMedicationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewMedication(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }))
  }

  const handlePrescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPrescription(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (activeTab === 'medications') {
      setNewMedication(prev => ({ ...prev, [name]: value }))
    } else {
      setNewPrescription(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      if (activeTab === 'medications') {
        setNewMedication(prev => ({ ...prev, [activeDate]: date }))
      } else {
        setNewPrescription(prev => ({ ...prev, [activeDate]: date }))
      }
      setIsCalendarOpen(false)
    }
  }

  const handleAddMedication = () => {
    setMedications(prev => [...prev, { ...newMedication, id: prev.length + 1 }])
    setNewMedication({
      name: '',
      dosage: '',
      quantity: 0,
      expirationDate: new Date(),
      supplier: '',
    })
  }

  const handleAddPrescription = () => {
    setPrescriptions(prev => [...prev, { ...newPrescription, id: prev.length + 1 }])
    setNewPrescription({
      patientName: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      startDate: new Date(),
      endDate: new Date(),
      prescribedBy: '',
      status: 'Pending',
    })
  }

  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPrescriptions = prescriptions.filter(pres => 
    pres.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pres.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pres.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Pharmacy Management</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="medications" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medication Inventory</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search medications..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.quantity}</TableCell>
                      <TableCell>{format(med.expirationDate, 'PP')}</TableCell>
                      <TableCell>{med.supplier}</TableCell>
                      <TableCell>
                        {med.quantity < 100 ? (
                          <span className="flex items-center text-red-500">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-green-500">In Stock</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search prescriptions..."
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
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((pres) => (
                    <TableRow key={pres.id}>
                      <TableCell>{pres.patientName}</TableCell>
                      <TableCell>{pres.medicationName}</TableCell>
                      <TableCell>{pres.dosage}</TableCell>
                      <TableCell>{pres.frequency}</TableCell>
                      <TableCell>{format(pres.startDate, 'PP')}</TableCell>
                      <TableCell>{format(pres.endDate, 'PP')}</TableCell>
                      <TableCell>{pres.prescribedBy}</TableCell>
                      <TableCell>{pres.status}</TableCell>
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
            <DialogTitle>{activeTab === 'medications' ? 'Add New Medication' : 'Add New Prescription'}</DialogTitle>
          </DialogHeader>
          {activeTab === 'medications' ? (
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Medication Name</Label>
                <Input id="name" name="name" value={newMedication.name} onChange={handleMedicationInputChange} />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" name="dosage" value={newMedication.dosage} onChange={handleMedicationInputChange} />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" value={newMedication.quantity} onChange={handleMedicationInputChange} />
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <div className="flex items-center">
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    value={format(newMedication.expirationDate, 'PP')}
                    readOnly
                    onClick={() => {
                      setActiveDate('expirationDate')
                      setIsCalendarOpen(true)
                    }}
                  />
                  <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => {
                    setActiveDate('expirationDate')
                    setIsCalendarOpen(true)
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" name="supplier" value={newMedication.supplier} onChange={handleMedicationInputChange} />
              </div>
              <Button type="button" onClick={handleAddMedication}>Add Medication</Button>
            </form>
          ) : (
            <form className="space-y-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" name="patientName" value={newPrescription.patientName} onChange={handlePrescriptionInputChange} />
              </div>
              <div>
                <Label htmlFor="medicationName">Medication Name</Label>
                <Input id="medicationName" name="medicationName" value={newPrescription.medicationName} onChange={handlePrescriptionInputChange} />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" name="dosage" value={newPrescription.dosage} onChange={handlePrescriptionInputChange} />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Input id="frequency" name="frequency" value={newPrescription.frequency} onChange={handlePrescriptionInputChange} />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <div className="flex items-center">
                  <Input
                    id="startDate"
                    name="startDate"
                    value={format(newPrescription.startDate, 'PP')}
                    readOnly
                    onClick={() => {
                      setActiveDate('startDate')
                      setIsCalendarOpen(true)
                    }}
                  />
                  <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => {
                    setActiveDate('startDate')
                    setIsCalendarOpen(true)
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="flex items-center">
                  <Input
                    id="endDate"
                    name="endDate"
                    value={format(newPrescription.endDate, 'PP')}
                    readOnly
                    onClick={() => {
                      
                      setActiveDate('endDate')
                      setIsCalendarOpen(true)
                    }}
                  />
                  <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => {
                    setActiveDate('endDate')
                    setIsCalendarOpen(true)
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="prescribedBy">Prescribed By</Label>
                <Input id="prescribedBy" name="prescribedBy" value={newPrescription.prescribedBy} onChange={handlePrescriptionInputChange} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={newPrescription.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Dispensed">Dispensed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={handleAddPrescription}>Add Prescription</Button>
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
              selected={activeTab === 'medications' ? newMedication.expirationDate : (activeDate === 'startDate' ? newPrescription.startDate : newPrescription.endDate)}
              onSelect={handleDateChange}
              initialFocus
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}