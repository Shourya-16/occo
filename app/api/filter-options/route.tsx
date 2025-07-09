import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shourya16",
    database: "occo_db",
  })

  const [unit] = await connection.execute("SELECT DISTINCT Unit FROM Vehicle_Details")
  const [formation] = await connection.execute("SELECT DISTINCT Formation FROM Vehicle_Details")
  const [type] = await connection.execute("SELECT DISTINCT Type_of_Veh FROM Vehicle_Details")
  const [purpose] = await connection.execute("SELECT DISTINCT Purpose FROM Vehicle_Details")

  await connection.end()

  return NextResponse.json({
    Unit: unit.map((u: any) => u.Unit),
    Formation: formation.map((f: any) => f.Formation),
    Type_of_Veh: type.map((t: any) => t.Type_of_Veh),
    Purpose: purpose.map((p: any) => p.Purpose),
  })
}
