"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrafficCharts from "./traffic-charts"
import LiveTracker from "./live-tracker"
import LaneVisualization from "./lane-visualization"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import DatabaseTester from "./database-tester"
import DatabaseDebug from "./database-debug"
import ExcelUploader from "./excel-uploader"
import FilterLogs from "./filter-logs" // ✅ NEW import

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-white shadow-sm">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="filter">Filter Logs</TabsTrigger> {/* ✅ Renamed */}
          <TabsTrigger value="live">Live Tracking</TabsTrigger>
          <TabsTrigger value="test">Database Test</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <ExcelUploader />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Lane Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <LaneVisualization />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Traffic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <TrafficCharts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <TrafficCharts />
        </TabsContent>

        <TabsContent value="filter" className="space-y-6">
          <FilterLogs /> {/* ✅ NEW tab content */}
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <LiveTracker />
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <DatabaseTester />
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <DatabaseDebug />
        </TabsContent>
      </Tabs>
    </div>
  )
}
