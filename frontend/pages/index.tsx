import React, { useEffect, useState } from "react"
import { Table, Container } from "rsuite"
import "rsuite-table/dist/css/rsuite-table.css"

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

const backendUrl = "http://localhost:5001"

const { Column, HeaderCell, Cell } = Table

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
	}, [rows])

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				fontFamily: "monospace",
				alignItems: "center",
				padding: "10%",
			}}
		>
			<p style={{ fontSize: "3rem" }}>Birdnest</p>
			<div style={{ width: "80%", maxWidth: "1200px" }}>
				<Table
					height={500}
					data={rows}
					onRowClick={(rowData) => {
						console.log(rowData)
					}}
					wordWrap='break-word'
				>
					<Column width={200} align='center' fixed>
						<HeaderCell>Pilot ID</HeaderCell>
						<Cell dataKey='pilotId' />
					</Column>

					<Column width={100}>
						<HeaderCell>First Name</HeaderCell>
						<Cell dataKey='firstName' />
					</Column>

					<Column width={100}>
						<HeaderCell>Last Name</HeaderCell>
						<Cell dataKey='lastName' />
					</Column>

					<Column width={140}>
						<HeaderCell>Phone Number</HeaderCell>
						<Cell dataKey='phoneNumber' />
					</Column>

					<Column width={250}>
						<HeaderCell>Email</HeaderCell>
						<Cell dataKey='email' />
					</Column>

					<Column width={170}>
						<HeaderCell>Drone Serial Number</HeaderCell>
						<Cell dataKey='serialNumber' />
					</Column>
					<Column width={80}>
						<HeaderCell>Most Recent Distance (m)</HeaderCell>
						<Cell dataKey='mostRecentDistance' />
					</Column>
					<Column width={80}>
						<HeaderCell>Closest Distance (m)</HeaderCell>
						<Cell dataKey='closestDistance' />
					</Column>
				</Table>
			</div>
		</div>
	)
}
