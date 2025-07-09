// File: /app/api/filter-logs/route.ts

import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { Unit, Formation, Type_of_Veh, Purpose } = body

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Shourya16",
      database: "occo_db",
    })

    const conditions = []
    const values = []

    if (Unit) {
      conditions.push("vd.Unit = ?")
      values.push(Unit)
    }

    if (Formation) {
      conditions.push("vd.Formation = ?")
      values.push(Formation)
    }

    if (Type_of_Veh) {
      conditions.push("vd.Type_of_Veh = ?")
      values.push(Type_of_Veh)
    }

    if (Purpose) {
      conditions.push("vd.Purpose = ?")
      values.push(Purpose)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    const [logs] = await connection.execute(
      `
      SELECT 
        l.rfid,
        l.cpid,
        l.timestamp,
        vd.Unit,
        vd.Formation,
        vd.Type_of_Veh,
        vd.Purpose,
        c.lane
      FROM logs l
      JOIN Vehicle_Details vd ON l.rfid = vd.rfid
      JOIN checkpoints c ON l.cpid = c.cpid
      ${whereClause}
      ORDER BY l.timestamp DESC
      LIMIT 50
      `,
      values
    )

    await connection.end()

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error in filter-logs API:", error)
    return NextResponse.json({ error: "Failed to fetch filtered logs", details: error.message }, { status: 500 })
  }
}
