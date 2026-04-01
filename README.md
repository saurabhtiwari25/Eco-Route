**Eco_Route -- Logistics Optimization System**

<img width="1916" height="1079" alt="1" src="https://github.com/user-attachments/assets/bb626fc7-6eb0-49d8-9d13-a0c15d5726c6" />

<img width="1907" height="1079" alt="4" src="https://github.com/user-attachments/assets/4c39c4e7-5214-4f2d-9e77-44f63ed42a2a" />


A full-stack, production-grade logistics system that optimizes delivery routes, simulates real-time driver movement, and provides analytics — built with a clean modular architecture and deterministic optimization engine.

---

##  Overview

This system allows admins to:
- Manage drivers and orders
- Generate optimized delivery routes
- Visualize routes on an interactive map
- Simulate real-time driver movement
- Analyze efficiency improvements

---

##  Tech Stack

### Backend
- FastAPI (Python)
- MongoDB (pymongo)
- JWT Authentication (bcrypt + jose)
- WebSocket (real-time updates)

### Frontend
- React (JavaScript) + Vite
- React Router
- Axios
- React Leaflet (map UI)

### AI
- Pure Python package
- Fully deterministic 

---

##  Project Structure
logistics-system/
├── backend/

├── frontend/

---

##  Authentication

- Register & Login with JWT
- Role-based access:
  - admin
  - driver

---

##  Core Features

###  Drivers
- Create drivers
- Define:
  - Capacity
  - Start location

---

###  Orders
- Create delivery orders
- Define:
  - Location
  - Priority
  - Time window

---

## Optimization Engine

### Input
- Drivers + Orders

### Pipeline
1. Haversine distance calculation  
2. Clustering (K = number of drivers)  
3. Route generation (Nearest Neighbor)  
4. Route optimization (2-opt)  
5. ETA calculation  
6. Metrics computation  

### Output
- Optimized routes
- Distance before & after
- Efficiency gain %

---

##  Incremental Optimization

- Triggered when a new order is added
- Finds closest driver
- Recomputes only that route
- Improves performance significantly

---

##  Map UI

- Displays:
  - Orders (markers)
  - Drivers (markers)
  - Routes (polylines)
<img width="1919" height="1079" alt="2" src="https://github.com/user-attachments/assets/38f18c77-cb29-41c7-a0d2-30e79ff30a4f" />
### Features
- Color-coded routes
- Click route → view details
- Layer toggles
- Run Optimization button
- Live simulation

---

##  Real-Time Simulation

- WebSocket-based updates
- Smooth driver movement (no teleporting)
- Interpolated positions along route

---

##  Analytics

- View optimization performance:
  - Before distance
  - After distance
  - Efficiency gain

---

##  Database Collections

- users
- orders
- drivers
- assignments

---

##  API Endpoints
POST /auth/register
POST /auth/login

GET /orders
POST /orders

GET /drivers
POST /drivers

<img width="1500" height="646" alt="3" src="https://github.com/user-attachments/assets/00b6ad9e-2c1a-40a2-b26e-21cffbef38ff" />

POST /optimize
POST /optimize/partial

GET /assignments/latest

WS /ws/simulate


---

##  Getting Started

### 1. Start MongoDB -- mongod

---

### 2. Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

3. Optimizer Setup

cd ../optimizer
pip install -e .

Frontend


npm install
npm install axios
npm install leaflet react-leaflet
npm install @types/leaflet
npm install react-router-dom
npm run dev

go to:
http://localhost:5173

---

##  Usage Flow

1. Register as admin  
2. Login  
3. Create drivers  
4. Create orders  
5. Open map  
6. Run optimization  
7. View routes  
8. Watch live simulation  
9. Check analytics  

---

##  Constraints

- No randomness (fully deterministic)
- No business logic in API routes
- Clean separation of concerns
- Modular and scalable architecture

---

##  Key Highlights

- Deterministic optimization engine  
- Real-time simulation with WebSockets  
- Partial re-optimization for performance  
- Interactive map-based UI  
- Clean full-stack architecture  

---

##  Future Improvements

- Time-window constrained routing  
- Multi-depot optimization  
- Traffic-aware routing  
- Driver status tracking  
- Docker deployment  

---


Full-stack logistics optimization system demonstrating:
- System design
- Algorithmic optimization
- Real-time systems
- Scalable architecture
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 1990ac6 (updated ui)
