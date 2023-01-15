import React, { useEffect, useState } from "react"
import { getParseTreeNode } from "typescript"

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

type PilotAndDrone = Drone & Pilot

function App() {
	const [drones, setDrones] = useState<PilotAndDrone[] | undefined>()

	useEffect(() => {
		let interval = setInterval(async () => {
			const res = await fetch("http://localhost:5000/status", {
				method: "GET",
			})
			const data = await res.json()
			setDrones(data)
		}, 1000 * 2)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div
			className='App'
			role='main'
			style={{
				display: "flex",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					minWidth: 500,
				}}
			>
				<h3>Drones</h3>
				{drones === undefined ? (
					<>Loading</>
				) : (
					<>
						<p className='text-2xl  text-black'>
							Total pilots that have violated the NFZ in the last 10 minutes:{" "}
							{drones.length}
						</p>
						<Table drones={drones} />
					</>
				)}
			</div>
		</div>
	)
}

function Table({ drones }: { drones: PilotAndDrone[] }) {
	return (
		<div>
			<table style={{ borderCollapse: "collapse" }}>
				<thead
					style={{ textAlign: "left", background: "green", color: "orange" }}
				>
					<tr>
						<th style={{ paddingRight: "20px" }}>Drone ID</th>
						<th style={{ paddingRight: "20px" }}>Pilot</th>
						<th style={{ paddingRight: "20px" }}>Phone</th>
						<th style={{ paddingRight: "20px" }}>Email</th>
					</tr>
				</thead>
				<tbody>
					{drones.map((drone) => {
						return (
							<tr style={{ borderTop: "1px solid", borderBottom: "1px solid" }}>
								<td style={{ paddingRight: "20px" }}>{drone.serialNumber}</td>
								<td style={{ paddingRight: "20px" }}>
									{drone.firstName} {drone.lastName}
								</td>
								<td style={{ paddingRight: "20px" }}>{drone.firstName}</td>
								<td style={{ paddingRight: "20px" }}>{drone.email}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default App
