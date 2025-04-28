"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical } from "lucide-react"

interface MenuItem {
  id: string
  title: string
  path: string
  icon: string
  enabled: boolean
  order: number
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/admin",
      icon: "BarChart3",
      enabled: true, // enabled by default
      order: 0
    },
    {
      id: "users",
      title: "User Management",
      path: "/admin/users",
      icon: "Users",
      enabled: false,
      order: 1
    },
    {
      id: "vehicles",
      title: "Vehicle Management",
      path: "/admin/vehicles",
      icon: "Car",
      enabled: true, // enabled by default
      order: 2
    },
    {
      id: "reports",
      title: "Reports",
      path: "/admin/reports",
      icon: "FileSpreadsheet",
      enabled: false,
      order: 3
    },
    {
      id: "code",
      title: "Code Management",
      path: "/admin/code-management",
      icon: "Code",
      enabled: false,
      order: 4
    },
    {
      id: "menu",
      title: "Menu Management",
      path: "/admin/menu-management",
      icon: "Code",
      enabled: false,
      order: 5
    }
  ])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(menuItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setMenuItems(updatedItems)
    // Save to localStorage for now (will be replaced with API call later)
    localStorage.setItem('adminMenuConfig', JSON.stringify(updatedItems))
  }

  const toggleMenuItem = (id: string) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    )
    setMenuItems(updatedItems)
    // Save to localStorage for now (will be replaced with API call later)
    localStorage.setItem('adminMenuConfig', JSON.stringify(updatedItems))
  }

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('adminMenuConfig')
    if (savedConfig) {
      setMenuItems(JSON.parse(savedConfig))
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Menu Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="menu-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {menuItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between p-4 bg-white border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-500" />
                            </div>
                            <span>{item.title}</span>
                          </div>
                          <Switch
                            checked={item.enabled}
                            onCheckedChange={() => toggleMenuItem(item.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  )
}