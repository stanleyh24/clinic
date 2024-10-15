"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
}

export function PatientManagementComponent() {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "John Doe", age: 35, gender: "Male", contact: "123-456-7890" },
    { id: 2, name: "Jane Smith", age: 28, gender: "Female", contact: "987-654-3210" },
  ])
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({ name: '', age: 0, gender: '', contact: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPatient(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }))
  }

  const handleAddPatient = () => {
    setPatients(prev => [...prev, { ...newPatient, id: prev.length + 1 }])
    setNewPatient({ name: '', age: 0, gender: '', contact: '' })
  }

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Patient Management</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Patient List</TabsTrigger>
          <TabsTrigger value="add">Add Patient</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search patients..."
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
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.contact}</TableCell>
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
              <CardTitle>Add New Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={newPatient.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={newPatient.age} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" name="gender" value={newPatient.gender} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" name="contact" value={newPatient.contact} onChange={handleInputChange} />
                </div>
                <Button type="button" onClick={handleAddPatient}>Add Patient</Button>
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
            <DialogTitle>Quick Add Patient</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="quickName">Name</Label>
              <Input id="quickName" name="name" value={newPatient.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickAge">Age</Label>
              <Input id="quickAge" name="age" type="number" value={newPatient.age} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickGender">Gender</Label>
              <Input id="quickGender" name="gender" value={newPatient.gender} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickContact">Contact</Label>
              <Input id="quickContact" name="contact" value={newPatient.contact} onChange={handleInputChange} />
            </div>
            <Button type="button" onClick={handleAddPatient}>Add Patient</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}