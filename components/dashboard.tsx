"use client"

import { useState, useEffect } from "react"
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
import FilterLogs from "./filter-logs"

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [lastUpdateText, setLastUpdateText] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const now = new Date()
    setLastUpdate(now)
    setLastUpdateText(now.toLocaleTimeString())
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  useEffect(() => {
    const now = new Date()
    setLastUpdate(now)
    setLastUpdateText(now.toLocaleTimeString())
  }, [])

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Refresh Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-md shadow border">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Last updated:</span>{" "}
          {lastUpdateText || "—"}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-full px-4 py-1 text-sm transition-all hover:scale-105"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Tab Interface */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-white border rounded-md shadow-sm overflow-hidden">
          <TabsTrigger value="upload" className="text-sm">Upload Data</TabsTrigger>
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="filter" className="text-sm">Filter Logs</TabsTrigger>
          <TabsTrigger value="live" className="text-sm">Live Tracking</TabsTrigger>
          <TabsTrigger value="test" className="text-sm">Database Test</TabsTrigger>
          <TabsTrigger value="debug" className="text-sm">Debug</TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="upload">
          <ExcelUploader />
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-md border rounded-lg transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Lane Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <LaneVisualization />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border rounded-lg transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Traffic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <TrafficCharts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <TrafficCharts />
        </TabsContent>

        <TabsContent value="filter">
          <FilterLogs />
        </TabsContent>

        <TabsContent value="live">
          <LiveTracker />
        </TabsContent>

        <TabsContent value="test">
          <DatabaseTester />
        </TabsContent>

        <TabsContent value="debug">
          <DatabaseDebug />
        </TabsContent>
      </Tabs>
    </div>
  )
}
