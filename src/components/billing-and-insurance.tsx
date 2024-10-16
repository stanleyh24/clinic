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

import { Calendar as CalendarIcon, Plus, Search, DollarSign} from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'

type BillingRecord = {
  id: number;
  patientName: string;
  dateOfService: Date;
  totalAmount: number;
  insuranceProvider: string;
  claimStatus: string;
  amountPaid: number;
  balance: number;
}

export function BillingAndInsuranceComponent() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([
    { 
      id: 1, 
      patientName: "John Doe", 
      dateOfService: new Date(2024, 9, 1), 
      totalAmount: 1500,
      insuranceProvider: "Blue Cross",
      claimStatus: "Submitted",
      amountPaid: 1200,
      balance: 300
    },
    { 
      id: 2, 
      patientName: "Jane Smith", 
      dateOfService: new Date(2024, 9, 5), 
      totalAmount: 2000,
      insuranceProvider: "Aetna",
      claimStatus: "Approved",
      amountPaid: 1800,
      balance: 200
    },
  ])
  const [newRecord, setNewRecord] = useState<Omit<BillingRecord, 'id' | 'balance'>>({
    patientName: '',
    dateOfService: new Date(),
    totalAmount: 0,
    insuranceProvider: '',
    claimStatus: '',
    amountPaid: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewRecord(prev => ({ ...prev, [name]: name === 'totalAmount' || name === 'amountPaid' ? parseFloat(value) : value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewRecord(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewRecord(prev => ({ ...prev, dateOfService: date }))
      setIsCalendarOpen(false)
    }
  }

  const handleAddRecord = () => {
    const balance = newRecord.totalAmount - newRecord.amountPaid
    setBillingRecords(prev => [...prev, { ...newRecord, id: prev.length + 1, balance }])
    setNewRecord({
      patientName: '',
      dateOfService: new Date(),
      totalAmount: 0,
      insuranceProvider: '',
      claimStatus: '',
      amountPaid: 0
    })
  }

  const filteredRecords = billingRecords.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Billing & Insurance</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Billing Records</TabsTrigger>
          <TabsTrigger value="add">Add Billing Record</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Billing Records</CardTitle>
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
                    <TableHead>Date of Service</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Insurance Provider</TableHead>
                    <TableHead>Claim Status</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.patientName}</TableCell>
                      <TableCell>{format(record.dateOfService, 'PP')}</TableCell>
                      <TableCell>${record.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{record.insuranceProvider}</TableCell>
                      <TableCell>{record.claimStatus}</TableCell>
                      <TableCell>${record.amountPaid.toFixed(2)}</TableCell>
                      <TableCell>${record.balance.toFixed(2)}</TableCell>
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
              <CardTitle>Add New Billing Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" name="patientName" value={newRecord.patientName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="dateOfService">Date of Service</Label>
                  <div className="flex items-center">
                    <Input
                      id="dateOfService"
                      name="dateOfService"
                      value={format(newRecord.dateOfService, 'PP')}
                      readOnly
                      onClick={() => setIsCalendarOpen(true)}
                    />
                    <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setIsCalendarOpen(true)} />
                  </div>
                  {isCalendarOpen && (
                    <div className="absolute z-10 bg-white border rounded-md shadow-md">
                      <Calendar
                        mode="single"
                        selected={newRecord.dateOfService}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <Input id="totalAmount" name="totalAmount" type="number" value={newRecord.totalAmount} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input id="insuranceProvider" name="insuranceProvider" value={newRecord.insuranceProvider} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="claimStatus">Claim Status</Label>
                  <Select name="claimStatus" value={newRecord.claimStatus} onValueChange={(value) => handleSelectChange("claimStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amountPaid">Amount Paid</Label>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <Input id="amountPaid" name="amountPaid" type="number" value={newRecord.amountPaid} onChange={handleInputChange} />
                  </div>
                </div>
                <Button type="button" onClick={handleAddRecord}>Add Billing Record</Button>
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
            <DialogTitle>Quick Add Billing Record</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="quickPatientName">Patient Name</Label>
              <Input id="quickPatientName" name="patientName" value={newRecord.patientName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickDateOfService">Date of Service</Label>
              <div className="flex items-center">
                <Input
                  id="quickDateOfService"
                  name="dateOfService"
                  value={format(newRecord.dateOfService, 'PP')}
                  readOnly
                  onClick={() => setIsCalendarOpen(true)}
                />
                <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setIsCalendarOpen(true)} />
              </div>
              {isCalendarOpen && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={newRecord.dateOfService}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="quickTotalAmount">Total Amount</Label>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <Input id="quickTotalAmount" name="totalAmount" type="number" value={newRecord.totalAmount} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="quickInsuranceProvider">Insurance Provider</Label>
              <Input id="quickInsuranceProvider" name="insuranceProvider" value={newRecord.insuranceProvider} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickClaimStatus">Claim Status</Label>
              <Select name="claimStatus" value={newRecord.claimStatus} onValueChange={(value) => handleSelectChange("claimStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quickAmountPaid">Amount Paid</Label>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <Input id="quickAmountPaid" name="amountPaid" type="number" value={newRecord.amountPaid} onChange={handleInputChange} />
              </div>
            </div>
            <Button type="button" onClick={handleAddRecord}>Add Billing Record</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}