"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

export default function TrafficCharts() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      setError(null)

      const [pieRes, typeRes, barL1Res, barL2Res, barL3Res] = await Promise.all([
        fetch("http://localhost:8000/analytics/pie"),
        fetch("http://localhost:8000/analytics/type"),
        fetch("http://localhost:8000/analytics/bar/L1"),
        fetch("http://localhost:8000/analytics/bar/L2"),
        fetch("http://localhost:8000/analytics/bar/L3"),
      ])

      const pieData = await pieRes.json()
      const typeData = await typeRes.json()
      const l1Bar = await barL1Res.json()
      const l2Bar = await barL2Res.json()
      const l3Bar = await barL3Res.json()

      const laneDistribution = pieData.map((item, i) => ({
        name: item.lane,
        value: item.vehicle_count,
        vehicles: item.vehicle_count,
      }))

      const totalType = typeData.reduce((sum, d) => sum + d.count, 0)
      const categoryDistribution = typeData.map((item, i) => ({
        name: `Type ${item.Type_of_Veh}`,
        value: totalType > 0 ? Math.round((item.count / totalType) * 100) : 0,
        color: COLORS[i % COLORS.length],
      }))

      const allCheckpoints = new Set([
        ...l1Bar.map((d) => d.cpid),
        ...l2Bar.map((d) => d.cpid),
        ...l3Bar.map((d) => d.cpid),
      ])

      const checkpointData = Array.from(allCheckpoints).map((cpid) => ({
        checkpoint: cpid,
        L1: l1Bar.find((d) => d.cpid === cpid)?.vehicle_count || 0,
        L2: l2Bar.find((d) => d.cpid === cpid)?.vehicle_count || 0,
        L3: l3Bar.find((d) => d.cpid === cpid)?.vehicle_count || 0,
      }))

      setAnalyticsData({ laneDistribution, categoryDistribution, checkpointData })
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err)
      setError(err.message || "Error fetching analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  const { laneDistribution, categoryDistribution, checkpointData } = analyticsData

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Vehicle Distribution by Lane</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={laneDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {laneDistribution.map((entry, index) => (
                  <Cell key={`lane-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Vehicle Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`type-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border-0 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Vehicles per Checkpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={checkpointData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="checkpoint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="L1" fill="#3B82F6" />
              <Bar dataKey="L2" fill="#10B981" />
              <Bar dataKey="L3" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
