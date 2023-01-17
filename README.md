Solution to Reaktors trainee assignment for the summer of 2023

[DEMO](https://reaktor.linusjern.com/)
 
 The backend is built using [bun.sh](https://bun.sh/) (a new javascript runtime with native support for typescript). To run the backend:
 1. `Install bun.sh`
 2. `cd backend && bun install && bun run index.ts`

 The frontend is built using next.js. I initially used bun for as well but switched back to node as bun ran into bugs with the package I used for a virtualized table (rsuite). To run the frontend:
 1. `Install node (and optionally yarn)`
 2. `cd frontend && yarn && yarn dev`

 You can now view the site at http://localhost:3000
