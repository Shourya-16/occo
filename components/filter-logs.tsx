"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function FilterLogs() {
  const [logs, setLogs] = useState([])
  const [filters, setFilters] = useState({
    Unit: "",
    Formation: "",
    Type_of_Veh: "",
    Purpose: "",
  })

  const [dropdownOptions, setDropdownOptions] = useState({
    Unit: [],
    Formation: [],
    Type_of_Veh: [],
    Purpose: [],
  })

  useEffect(() => {
    fetchOptions()
    fetchLogs()
  }, [])

  const fetchOptions = async () => {
    const res = await fetch("/api/filter-options")
    const data = await res.json()
    setDropdownOptions(data)
  }

  const fetchLogs = async (customFilters = filters) => {
    const res = await fetch("/api/filter-logs", {
      method: "POST",
      body: JSON.stringify(customFilters),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    setLogs(data.logs)
  }

  const handleFilterChange = async (key: string, value: string) => {
    const updated = {
      ...filters,
      [key]: value,
      ...(key === "Unit" ? { Formation: "", Type_of_Veh: "", Purpose: "" } : {}),
      ...(key === "Formation" ? { Type_of_Veh: "", Purpose: "" } : {}),
      ...(key === "Type_of_Veh" ? { Purpose: "" } : {}),
    }

    setFilters(updated)
    await fetchLogs(updated)

    // Fetch updated dropdown options based on new selection
    const res = await fetch("/api/filter-options")
    const allOptions = await res.json()

    setDropdownOptions({
      Unit: allOptions.Unit,
      Formation:
        key === "Unit" && value
          ? await getFilteredOptions("Formation", { Unit: value })
          : allOptions.Formation,
      Type_of_Veh:
        (key === "Formation" || key === "Unit") && value
          ? await getFilteredOptions("Type_of_Veh", {
              Unit: updated.Unit,
              Formation: updated.Formation,
            })
          : allOptions.Type_of_Veh,
      Purpose:
        (key === "Type_of_Veh" ||
          key === "Formation" ||
          key === "Unit") && value
          ? await getFilteredOptions("Purpose", {
              Unit: updated.Unit,
              Formation: updated.Formation,
              Type_of_Veh: updated.Type_of_Veh,
            })
          : allOptions.Purpose,
    })
  }

  const getFilteredOptions = async (field: string, filterObj: any) => {
    const res = await fetch("/api/filter-logs", {
      method: "POST",
      body: JSON.stringify(filterObj),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    const unique = Array.from(new Set(data.logs.map((log) => log[field])))
    return unique
  }

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle>Filter Vehicle Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Unit", "Formation", "Type_of_Veh", "Purpose"].map((key) => (
            <Select
              key={key}
              value={filters[key]}
              onValueChange={(value) => handleFilterChange(key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${key}`} />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions[key]?.map((val: string) => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFID</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Checkpoint</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, i) => (
              <TableRow key={i}>
                <TableCell>{log.rfid}</TableCell>
                <TableCell>{log.Unit}</TableCell>
                <TableCell>{log.Formation}</TableCell>
                <TableCell>{log.Type_of_Veh}</TableCell>
                <TableCell>{log.Purpose}</TableCell>
                <TableCell>{log.cpid}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
