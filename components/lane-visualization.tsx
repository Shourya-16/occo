"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, MapPin } from "lucide-react"

interface LaneData {
  id: string
  name: string
  vehicles: VehiclePosition[]
  status: "active" | "maintenance" | "blocked"
}

interface VehiclePosition {
  id: string
  checkpoint: number
  category: "A" | "B"
  speed: number
}

const mockLaneData: LaneData[] = [
  {
    id: "L1",
    name: "Lane 1",
    vehicles: [
      { id: "V001", checkpoint: 3, category: "A", speed: 45 },
      { id: "V002", checkpoint: 7, category: "B", speed: 52 },
      { id: "V003", checkpoint: 9, category: "A", speed: 38 },
    ],
    status: "active",
  },
  {
    id: "L2",
    name: "Lane 2",
    vehicles: [
      { id: "V004", checkpoint: 2, category: "B", speed: 48 },
      { id: "V005", checkpoint: 5, category: "A", speed: 41 },
    ],
    status: "active",
  },
  {
    id: "L3",
    name: "Lane 3",
    vehicles: [
      { id: "V006", checkpoint: 1, category: "B", speed: 55 },
      { id: "V007", checkpoint: 4, category: "A", speed: 39 },
      { id: "V008", checkpoint: 8, category: "B", speed: 51 },
    ],
    status: "active",
  },
  {
    id: "L4",
    name: "Lane 4",
    vehicles: [{ id: "V009", checkpoint: 6, category: "A", speed: 42 }],
    status: "maintenance",
  },
]

export default function LaneVisualization() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 border-green-300"
      case "maintenance":
        return "bg-yellow-100 border-yellow-300"
      case "blocked":
        return "bg-red-100 border-red-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const
      case "maintenance":
        return "secondary" as const
      case "blocked":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-4">
      {mockLaneData.map((lane) => (
        <Card key={lane.id} className={`border-2 ${getStatusColor(lane.status)}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{lane.name}</span>
                <Badge variant={getStatusBadgeVariant(lane.status)}>{lane.status}</Badge>
              </div>
              <span className="text-sm text-gray-600">
                {lane.vehicles.length} vehicle{lane.vehicles.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Lane visualization */}
            <div className="relative">
              {/* Lane track */}
              <div className="h-12 bg-gray-200 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 opacity-50" />

                {/* Checkpoints */}
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-gray-400"
                    style={{ left: `${(i + 1) * 10}%` }}
                  >
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      {i + 1}
                    </div>
                  </div>
                ))}

                {/* Vehicles */}
                {lane.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                      selectedVehicle === vehicle.id ? "scale-110 z-10" : "hover:scale-105"
                    }`}
                    style={{ left: `${vehicle.checkpoint * 10}%` }}
                    onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                  >
                    <div
                      className={`w-8 h-6 rounded-sm flex items-center justify-center ${
                        vehicle.category === "A" ? "bg-blue-500" : "bg-green-500"
                      } text-white text-xs font-bold shadow-lg`}
                    >
                      <Car className="h-3 w-3" />
                    </div>
                    {selectedVehicle === vehicle.id && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {vehicle.id} - {vehicle.speed} km/h
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 bg-blue-500 rounded-sm" />
                  <span>Category A</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 bg-green-500 rounded-sm" />
                  <span>Category B</span>
                </div>
                <span>Click vehicle for details</span>
              </div>
            </div>

            {/* Vehicle details */}
            {lane.vehicles.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {lane.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`p-2 rounded border text-sm ${
                      selectedVehicle === vehicle.id ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{vehicle.id}</div>
                    <div className="text-gray-600">
                      CP{vehicle.checkpoint} • {vehicle.speed} km/h
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
