import React, { useEffect, useState } from "react"
import { Table } from "rsuite"
import "rsuite-table/dist/css/rsuite-table.css"

interface Pilot {
  pilotId: string
  firstName: string
  lastName: string
  phoneNumber: string
  createdDt: string
  email: string
}

type Status = Pilot & { updatedAt: Date; serialNumber: string }

const localUrl = "http://127.0.0.1:5001"
const backendUrl = process.env.NODE_ENV === "production" ? "" : localUrl

const { Column, HeaderCell, Cell } = Table

export default function Birdnest({
  initialStatus,
}: {
  initialStatus: Status[]
}) {
  const [rows, setRows] = useState<Status[]>(initialStatus)

  useEffect(() => {
    let interval = setInterval(async () => {
      const res = await fetch(`${backendUrl}/status`, {
        method: "GET",
      })
      const data = await res.json()
      setRows(data)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [rows])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection: "column",
        fontFamily: "monospace",
        alignItems: "center",
        padding: "0 10%",
      }}
    >
      <p style={{ fontSize: "3rem", color: "navy" }}>Birdnest</p>
      <p style={{ padding: "0 20px" }}>
        List of all pilots that have flown their drones within 100m of the
        birdnest in the past 10min
      </p>
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <Table height={500} data={rows} wordWrap='break-word'>
          <Column width={150} align='center' fixed>
            <HeaderCell style={{ color: "navy" }}>Pilot ID</HeaderCell>
            <Cell dataKey='pilotId' />
          </Column>

          <Column width={100}>
            <HeaderCell style={{ color: "navy" }}>First Name</HeaderCell>
            <Cell dataKey='firstName' />
          </Column>

          <Column width={100}>
            <HeaderCell style={{ color: "navy" }}>Last Name</HeaderCell>
            <Cell dataKey='lastName' />
          </Column>

          <Column width={140}>
            <HeaderCell style={{ color: "navy" }}>Phone Number</HeaderCell>
            <Cell dataKey='phoneNumber' />
          </Column>

          <Column width={250}>
            <HeaderCell style={{ color: "navy" }}>Email</HeaderCell>
            <Cell dataKey='email' />
          </Column>

          <Column width={170}>
            <HeaderCell style={{ color: "navy" }}>
              Drone Serial Number
            </HeaderCell>
            <Cell dataKey='serialNumber' />
          </Column>
          <Column width={80}>
            <HeaderCell style={{ color: "navy" }}>
              Most Recent Distance (m)
            </HeaderCell>
            <Cell dataKey='mostRecentDistance' />
          </Column>
          <Column width={80}>
            <HeaderCell style={{ color: "navy" }}>
              Closest Distance (m)
            </HeaderCell>
            <Cell dataKey='closestDistance' />
          </Column>
        </Table>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${localUrl}/status`)
  const initialStatus = await res.json()

  // Pass data to the page via props
  return { props: { initialStatus } }
}
