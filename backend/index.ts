import express from "express"
import { XMLParser } from "fast-xml-parser"
import cors from "cors"

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

type DroneObservation = Pilot & {
  updatedAt: Date
  closestDistance: number
  mostRecentDistance: number
}

const app = express()
app.use(cors())
const port = 5001

app.get("/status", (_, res) => {
  const statusResponse = Object.keys(observations).map((serialNumber) => {
    return {
      ...observations[serialNumber],
      serialNumber: serialNumber,
    }
  })
  statusResponse.sort((a, b) => a.mostRecentDistance - b.mostRecentDistance)

  res.send(statusResponse)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const dronesUrl: string = "assignments.reaktor.com/birdnest/drones"
const pilotUrl: string = "assignments.reaktor.com/birdnest/pilots/"

// All pilots that have had drones in NDZ during the last 10min
const observations: { [serialNumber: string]: DroneObservation } = {}

setInterval(async () => {
  updatePilots()

  // Remove old pilots
  const currentTime = new Date()
  for (var key of Object.keys(observations)) {
    if (
      currentTime.getTime() - observations[key].updatedAt.getTime() >
      10 * 60 * 1000
    ) {
      delete observations[key]
    }
  }
}, 2000)

async function updatePilots() {
  const drones = await getAllCurrentDrones()
  const dronesWithinRange = drones.filter((drone) => {
    return distanceBetweenDroneAndCenter(drone) < 100000
  })

  const currentTime: Date = new Date()
  for (var drone of dronesWithinRange) {
    const distance = distanceBetweenDroneAndCenter(drone)

    if (drone.serialNumber in observations) {
      observations[drone.serialNumber].updatedAt = currentTime

      observations[drone.serialNumber].mostRecentDistance =
        convertToMeters(distance)
      if (
        convertToMeters(distance) <
        observations[drone.serialNumber].closestDistance
      ) {
        observations[drone.serialNumber].closestDistance =
          convertToMeters(distance)
      }
    } else {
      const pilot = await getPilotInfo(drone.serialNumber)

      observations[drone.serialNumber] = {
        ...pilot,
        updatedAt: currentTime,
        closestDistance: convertToMeters(distance),
        mostRecentDistance: convertToMeters(distance),
      }
    }
  }
}

// Function to get all drones within 500m of the birdsnest
async function getAllCurrentDrones(): Promise<Drone[]> {
  const parser = new XMLParser()

  // request from api
  const response = await fetch(dronesUrl)
  const xmlAsText = await response.text()

  const parsed = await parser.parse(xmlAsText)
  // We could check that the type is correct but for the purpose of this
  // exercise we simply cast it.
  const drones: Drone[] = parsed.report.capture.drone

  return drones
}

async function getPilotInfo(serialNumber: string): Promise<Pilot> {
  const response = await fetch(`${pilotUrl}${serialNumber}`)

  // Again, we assume the response type is correct.
  return await response.json()
}

interface Coord {
  x: number
  y: number
}

function distanceBetweenDroneAndCenter(drone: Drone): number {
  const centerCoords = {
    x: 250000,
    y: 250000,
  }
  const droneCoords = {
    x: drone.positionX,
    y: drone.positionY,
  }
  return distance(centerCoords, droneCoords)
}

function distance(a: Coord, b: Coord): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

function convertToMeters(x: number): number {
  return Math.round(x / 100) / 10
}
