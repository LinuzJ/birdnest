import Head from "next/head"
import React, { useEffect, useState } from "react"
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"

interface Drone {
	serialNumber: string
	positionY: number
	positionX: number
}

interface Pilot {
	pilotId: string
	firstName: string
	lastName: string
	phoneNumber: string
	createdDt: string
	email: string
}

type Status = Pilot & { updatedAt: Date; serialNumber: string }

const columns: GridColDef[] = [
	{ field: "id", headerName: "PilotID", width: 70 },
	{ field: "firstName", headerName: "First name", width: 130 },
	{ field: "lastName", headerName: "Last name", width: 130 },
	{ field: "phoneNumber", headerName: "Phone Number", width: 90 },
	{ field: "email", headerName: "Email", width: 90 },
	{ field: "serialNumber", headerName: "Drone SerialNumber", width: 130 },
	{ field: "updateAt", headerName: "Last seen within premise", width: 130 },
]

const backendUrl = "localhost:5001"
export default function Home({}) {
	const [rows, setRows] = useState<Status[]>([])

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
	}, [])

	return (
		<div>
			<div>Birdnest</div>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[5]}
			/>
		</div>
	)
}
