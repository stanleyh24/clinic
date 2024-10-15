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
import { Calendar as CalendarIcon, Plus, Search, Package, AlertTriangle } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastRestocked: Date;
  expirationDate: Date;
  minimumStock: number;
}

export function InventoryManagementComponent() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { 
      id: 1, 
      name: "Surgical Masks", 
      category: "PPE",
      quantity: 5000,
      unit: "piece",
      lastRestocked: new Date(2024, 9, 1),
      expirationDate: new Date(2026, 9, 1),
      minimumStock: 1000
    },
    { 
      id: 2, 
      name: "Ibuprofen 200mg", 
      category: "Medication",
      quantity: 10000,
      unit: "tablet",
      lastRestocked: new Date(2024, 8, 15),
      expirationDate: new Date(2025, 8, 15),
      minimumStock: 2000
    },
  ])
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    lastRestocked: new Date(),
    expirationDate: new Date(),
    minimumStock: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'lastRestocked' | 'expirationDate'>('lastRestocked')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({ ...prev, [name]: name === 'quantity' || name === 'minimumStock' ? parseInt(value) : value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewItem(prev => ({ ...prev, [activeDate]: date }))
      setIsCalendarOpen(false)
    }
  }

  const handleAddItem = () => {
    setInventoryItems(prev => [...prev, { ...newItem, id: prev.length + 1 }])
    setNewItem({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      lastRestocked: new Date(),
      expirationDate: new Date(),
      minimumStock: 0
    })
  }

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <div className='w-20'>
      <Link href={'/'}><Button className="w-full">Back</Button></Link> 
      </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Inventory List</TabsTrigger>
          <TabsTrigger value="add">Add Item</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search inventory..."
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
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{format(item.lastRestocked, 'PP')}</TableCell>
                      <TableCell>{format(item.expirationDate, 'PP')}</TableCell>
                      <TableCell>
                        {item.quantity <= item.minimumStock ? (
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
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Inventory Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input id="name" name="name" value={newItem.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" value={newItem.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PPE">PPE</SelectItem>
                      <SelectItem value="Medication">Medication</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Supplies">Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" value={newItem.quantity} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" value={newItem.unit} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="lastRestocked">Last Restocked</Label>
                  <div className="flex items-center">
                    <Input
                      id="lastRestocked"
                      name="lastRestocked"
                      value={format(newItem.lastRestocked, 'PP')}
                      readOnly
                      onClick={() => {
                        setActiveDate('lastRestocked')
                        setIsCalendarOpen(true)
                      }}
                    />
                    <CalendarIcon className="ml-2 h-4 w-4 cursor-pointer" onClick={() => {
                      setActiveDate('lastRestocked')
                      setIsCalendarOpen(true)
                    }} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <div className="flex items-center">
                    <Input
                      id="expirationDate"
                      name="expirationDate"
                      value={format(newItem.expirationDate, 'PP')}
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
                  <Label htmlFor="minimumStock">Minimum Stock</Label>
                  <Input id="minimumStock" name="minimumStock" type="number" value={newItem.minimumStock} onChange={handleInputChange} />
                </div>
                <Button type="button" onClick={handleAddItem}>Add Inventory Item</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {isCalendarOpen && (
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Date</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={newItem[activeDate]}
              onSelect={handleDateChange}
              initialFocus
            />
          </DialogContent>
        </Dialog>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full p-3">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Inventory Item</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="quickName">Item Name</Label>
              <Input id="quickName" name="name" value={newItem.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickCategory">Category</Label>
              <Select name="category" value={newItem.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PPE">PPE</SelectItem>
                  <SelectItem value="Medication">Medication</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quickQuantity">Quantity</Label>
              <Input id="quickQuantity" name="quantity" type="number" value={newItem.quantity} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickUnit">Unit</Label>
              <Input id="quickUnit" name="unit" value={newItem.unit} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="quickMinimumStock">Minimum Stock</Label>
              <Input id="quickMinimumStock" name="minimumStock" type="number" value={newItem.minimumStock} onChange={handleInputChange} />
            </div>
            <Button type="button" onClick={handleAddItem}>Add Inventory Item</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}