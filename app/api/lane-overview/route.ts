// File: /app/api/lane-overview/route.ts

import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Shourya16",
  database: "occo_db",
}

export async function GET() {
  let connection

  try {
    connection = await mysql.createConnection(dbConfig)

    // ✅ Get latest checkpoint per RFID per lane
    const [vehicles] = await connection.execute(`
      SELECT 
        l.rfid,
        l.cpid,
        l.timestamp,
        c.lane,
        vd.Type_of_Veh
      FROM logs l
      JOIN checkpoints c ON l.cpid = c.cpid
      JOIN vehicle_details vd ON l.rfid = vd.rfid
      JOIN (
        SELECT l.rfid, c.lane, MAX(l.timestamp) as max_time
        FROM logs l
        JOIN checkpoints c ON l.cpid = c.cpid
        GROUP BY l.rfid, c.lane
      ) latest_per_lane
      ON l.rfid = latest_per_lane.rfid 
         AND c.lane = latest_per_lane.lane 
         AND l.timestamp = latest_per_lane.max_time
    `)

    // ✅ Group vehicles by lane
    const grouped: Record<string, any[]> = {}

    for (const row of vehicles as any[]) {
      const lane = row.lane
      if (!grouped[lane]) {
        grouped[lane] = []
      }

      const checkpointNumber = parseInt((row.cpid.match(/CP(\d+)/) || [])[1] || "0")

      grouped[lane].push({
        id: row.rfid,
        checkpoint: checkpointNumber,
        category: row.Type_of_Veh,
        speed: Math.floor(Math.random() * 20 + 40), // Optional: Fake speed
      })
    }

    // ✅ Format response
    const laneData = Object.entries(grouped).map(([lane, vehicles]) => ({
      id: lane,
      name: `Lane ${lane.replace("L", "")}`,
      status: "active",
      vehicles,
    }))

    return NextResponse.json({ lanes: laneData })
  } catch (err: any) {
    console.error("Lane overview API error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
