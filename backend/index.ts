import express, { json } from "express"
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser")
console.log("hej")
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

interface Coord {
	x: number
	y: number
}

type DroneObservationStatus = Pilot & { updatedAt: Date }

const app = express()
const port = 5001

const dronesUrl: string = "assignments.reaktor.com/birdnest/drones"
const pilotUrl: string = "assignments.reaktor.com/birdnest/pilots/"

console.log("hej")
// State of pilots that have had drones in the area in the previous 10min
const store: { [serialNumber: string]: DroneObservationStatus } = {}

function distanceBetweenPoints(pointOne: Coord, pointTwo: Coord): number {
	return Math.sqrt(
		Math.pow(pointTwo.x - pointOne.x, 2) + Math.pow(pointTwo.y - pointOne.y, 2)
	)
}

console.log("hej")
function distanceBetweenDroneAndCenter(drone: Drone): number {
	const centerCoords: Coord = {
		x: 250000,
		y: 250000,
	}
	const droneCoords: Coord = {
		x: drone.positionX,
		y: drone.positionY,
	}
	return distanceBetweenPoints(centerCoords, droneCoords)
}

console.log("hej")
// Function to get all drones within 500m of the birdsnest
async function getAllCurrentDrones(): Promise<Drone[]> {
	const parser = new XMLParser()
	// request from api
	const raw = await fetch(dronesUrl)
	const xmlAsText = await raw.text()
	// parse
	const parsed = await parser.parse(xmlAsText)
	const drones: Drone[] = parsed.report.capture.drone

	return drones
}

async function getPilotInfo(serialNumber: string): Promise<Pilot> {
	// Get pilot data
	const rawResponse = await fetch(`${pilotUrl}${serialNumber}`)

	// Parse
	const jsonPilotData: Pilot = await rawResponse.json()
	return jsonPilotData
}

async function updatePilotStatus(listOfActievDrones: Drone[]) {
	// Check which drones are within range
	const dronesWithinRange = listOfActievDrones.filter((drone: Drone) => {
		return distanceBetweenDroneAndCenter(drone) < 100000
	})
	// Get pilot and update status if needed
	const currentDronesWithPilot: (Pilot & Drone)[] = await Promise.all(
		dronesWithinRange.map(async (drone: Drone) => {
			return {
				...drone,
				...(await getPilotInfo(drone.serialNumber)),
			}
		})
	)

	const currentTime: Date = new Date()
	for (var pilotAndDrone of currentDronesWithPilot) {
		if (store.hasOwnProperty(pilotAndDrone.serialNumber)) {
			// If pilot in store
			store[pilotAndDrone.serialNumber].updatedAt = currentTime
		} else {
			// If pilot not in store
			const storeAddition: DroneObservationStatus = {
				...pilotAndDrone,
				updatedAt: currentTime,
			}
			store[pilotAndDrone.serialNumber] = storeAddition
		}
	}
}
console.log("hej")

app.get("/status", (req, res) => {
	res.send(store)
})
console.log("hej")

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

setInterval(async () => {
	// Update store
	updatePilotStatus(await getAllCurrentDrones())

	// Remove old pilots
	const currentTime: Date = new Date()
	for (var key of Object.keys(store)) {
		if (currentTime.getTime() - store[key].updatedAt.getTime() > 600000) {
			delete store[key]
		}
	}
}, 2000)
