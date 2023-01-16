import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Table } from "rsuite"

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

const backendUrl = "localhost:5001"

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
	}, [])

	return (
		<div>
			<div>Birdnest</div>
			<Table
				height={400}
				data={rows}
				onRowClick={(rowData) => {
					console.log(rowData)
				}}
			>
				<Column width={60} align='center' fixed>
					<HeaderCell>PilotID</HeaderCell>
					<Cell dataKey='pilotId' />
				</Column>

				<Column width={150}>
					<HeaderCell>First Name</HeaderCell>
					<Cell dataKey='firstName' />
				</Column>

				<Column width={150}>
					<HeaderCell>Last Name</HeaderCell>
					<Cell dataKey='lastName' />
				</Column>

				<Column width={100}>
					<HeaderCell>Phone Number</HeaderCell>
					<Cell dataKey='phoneNumber' />
				</Column>

				<Column width={100}>
					<HeaderCell>Email</HeaderCell>
					<Cell dataKey='email' />
				</Column>

				<Column width={150}>
					<HeaderCell>Drone Serial Number</HeaderCell>
					<Cell dataKey='serialNumber' />
				</Column>
			</Table>
		</div>
	)
}
