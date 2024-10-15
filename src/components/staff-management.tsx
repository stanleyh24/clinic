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
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

type StaffMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  contact: string;
  schedule: string;
}

export function StaffManagementComponent() {
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "Dr. Jane Smith", role: "Doctor", department: "Cardiology", contact: "123-456-7890", schedule: "Mon-Fri, 9AM-5PM" },
    { id: 2, name: "Nurse John Doe", role: "Nurse", department: "Emergency", contact: "987-654-3210", schedule: "Tue-Sat, 7AM-7PM" },
  ])
  const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id'>>({ name: '', role: '', department: '', contact: '', schedule: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewStaff(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewStaff(prev => ({ ...prev, [name]: value }))
  }

  const handleAddStaff = () => {
    setStaff(prev => [...prev, { ...newStaff, id: prev.length + 1 }])
    setNewStaff({ name: '', role: '', department: '', contact: '', schedule: '' })
  }

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Staff Management</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Staff List</TabsTrigger>
          <TabsTrigger value="add">Add Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Staff List</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search staff..."
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
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Schedule</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.contact}</TableCell>
                      <TableCell>{member.schedule}</TableCell>
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
              <CardTitle>Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={newStaff.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" value={newStaff.role} onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" value={newStaff.department} onValueChange={(value) => handleSelectChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" name="contact" value={newStaff.contact} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input id="schedule" name="schedule" value={newStaff.schedule} onChange={handleInputChange} />
                </div>
                <Button type="button" onClick={handleAddStaff}>Add Staff Member</Button>
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
            <DialogTitle>Quick Add Staff Member</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="quickName">Name</Label>
              <Input id="quickName" name="name" value={newStaff.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickRole">Role</Label>
              <Select name="role" value={newStaff.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quickDepartment">Department</Label>
              <Select name="department" value={newStaff.department} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quickContact">Contact</Label>
              <Input id="quickContact" name="contact" value={newStaff.contact} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickSchedule">Schedule</Label>
              <Input id="quickSchedule" name="schedule" value={newStaff.schedule} onChange={handleInputChange} />
            </div>
            <Button type="button" onClick={handleAddStaff}>Add Staff Member</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}