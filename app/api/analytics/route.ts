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

    // ✅ Latest position of each vehicle
    const [vehicles] = await connection.execute(`
      SELECT 
        vd.rfid,
        vd.BA_NO,
        vd.Type_of_Veh,
        vd.Unit,
        vd.Formation,
        vd.Lane,
        vd.No_of_Trps,
        vd.Purpose,
        l.cpid,
        l.timestamp,
        c.lane
      FROM Vehicle_Details vd
      LEFT JOIN logs l ON vd.rfid = l.rfid
      LEFT JOIN checkpoints c ON l.cpid = c.cpid
      WHERE l.timestamp = (
        SELECT MAX(timestamp) 
        FROM logs l2 
        WHERE l2.rfid = vd.rfid
      )
      ORDER BY l.timestamp DESC
    `)

    // ✅ Unique vehicle per lane (latest log per RFID)
    const [laneStats] = await connection.execute(`
      SELECT 
        c.lane AS lane,
        COUNT(DISTINCT l.rfid) AS vehicle_count
      FROM (
        SELECT rfid, MAX(timestamp) AS max_time
        FROM logs
        GROUP BY rfid
      ) latest
      JOIN logs l ON l.rfid = latest.rfid AND l.timestamp = latest.max_time
      JOIN checkpoints c ON l.cpid = c.cpid
      GROUP BY c.lane
    `)

    // ✅ Category distribution from Vehicle_Details
    const [categoryStats] = await connection.execute(`
      SELECT Type_of_Veh, COUNT(*) AS count
      FROM Vehicle_Details
      GROUP BY Type_of_Veh
    `)

    return NextResponse.json({
      success: true,
      isPreview: false,
      vehicles,
      laneStats,
      categoryStats,
    })
  } catch (error) {
    console.error("❌ Analytics API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics", details: (error as Error).message },
      { status: 500 }
    )
  } finally {
    if (connection) await connection.end()
  }
}
