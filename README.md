# CollabX Lite — Open Innovation & Skill-Matching Collaboration Platform

CollabX Lite is a lightweight full-stack platform designed to streamline idea sharing, collaborator discovery, team formation, and real-time project collaboration.  
The system operates **without any external database**, relying instead on JSON files and in-memory storage, making it fast to deploy and ideal for rapid prototyping environments such as hackathons.



## 1. System Architecture Overview 🧩

CollabX Lite integrates three layers:

| Layer | Description |
|-------|-------------|
| **Frontend** | Interface for user interaction: login, dashboard, challenge submission, workspace. |
| **Backend (API Layer)** | Handles all logic using Node.js + Express, processes requests, manages storage. |
| **Real-Time Layer** | WebSocket-based instant communication via Socket.io. |
| **Storage Layer (No DB)** | Uses JSON files + in-memory arrays instead of SQL/NoSQL databases. |



## 2. Technology Stack Summary ⚙️

| Component | Technology | Role |
|----------|------------|------|
| **Frontend** | HTML, CSS, JavaScript | User interface, input handling, browser-side logic |
| **Optional Frontend Enhancements** | React | For dynamic components (not mandatory) |
| **Backend Runtime** | Node.js | Executes server-side JavaScript |
| **Backend Framework** | Express.js | Manages API routes and request handling |
| **Real-Time Communication** | Socket.io (WebSockets) | Enables live chat & instant updates |
| **Storage** | JSON Files | Lightweight replacement for traditional databases |
| **Session Handling** | Browser LocalStorage | Stores active user session on client side |



## 3. Why No Database? 📂

JSON files act as a minimal database substitute. They serve as structured text files that store:

- `users.json` → registered users  
- `ideas.json` → posted challenges  
- `teams.json` → team data + members  
- `chat.json` → message logs  
- `solutions.json` → published final outputs  

**Comparison Table**

| JSON Storage | Traditional Database |
|--------------|----------------------|
| Simple text files | Full DB engine (MySQL/MongoDB) |
| Easy to read/edit | Requires query language |
| No setup needed | Requires installation/configuration |
| Good for small projects | Designed for large systems |
| Ideal for hackathons | Ideal for long-term production |



## 4. Innovation Workflow (Flowchart Style) 🔄

```
[ User Login/Register ]
          ↓
[ Submit Challenge or Browse Challenges ]
          ↓
[ Skill-Matching Algorithm Suggests Collaborators ]
          ↓
[ Team Formation (Stored in JSON) ]
          ↓
[ Collaboration Workspace Opens ]
    ├─ Real-Time Chat (Socket.io)
    ├─ Task Assignment Board
    ├─ Progress Tracking (%)
          ↓
[ Prototype / Solution Development ]
          ↓
[ Solution Publishing ]
          ↓
[ Public Solutions Page ]
```



## 5. Core Features Overview ✨

| Feature | Description |
|---------|-------------|
| **Challenge Submission** | Users can post innovation challenges with required skills. |
| **Skill Matching Engine** | Suggests top collaborators using keyword-intersection scoring. |
| **Team Formation** | Creates structured teams stored in JSON. |
| **Collaboration Workspace** | Real-time chat, task board, and progress tracking. |
| **Solution Publishing** | Teams can share final prototypes publicly. |
| **Lightweight Architecture** | No database required; runs entirely in VS Code. |



## 6. Skill-Matching Algorithm 🔍

**Purpose:** Identify collaborators whose skills align with the challenge.

### Algorithm Logic
```
matchingScore = (number of matching skills) / (total required skills)
```

**Example Table**

| Required Skills | User Skills | Overlap | Score |
|----------------|-------------|---------|-------|
| ["Node","React","NLP"] | ["Node","C++"] | 1 | 1/3 |
| ["HTML","CSS"] | ["HTML","CSS","JS"] | 2 | 2/2 |
| ["ML","DS"] | ["DS"] | 1 | 1/2 |

The backend returns the **top 3 collaborators**.

Optional upgrade: NLP similarity using HuggingFace API.



## 7. Collaboration Workspace Tools 🛠️

| Tool | Function |
|-------|----------|
| **Real-Time Chat** | Instant messaging using WebSockets (Socket.io). |
| **Task Assignment** | Create tasks, assign members, update status. |
| **Progress Tracker** | Calculates completion percentage from tasks. |
| **Shared Workspace Panel** | Team updates & activity history. |



## 8. API Endpoints (Backend Specification) 🧪

| Method | Route | Purpose |
|--------|--------|----------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| POST | `/idea/submit` | Submit challenge |
| GET | `/idea/list` | Fetch all challenges |
| POST | `/team/suggest` | Skill matching |
| POST | `/team/create` | Create team |
| POST | `/team/chat/send` | Send chat message |
| POST | `/team/task/add` | Add task |
| POST | `/team/task/complete` | Mark task done |
| POST | `/solution/publish` | Publish final output |
| GET | `/solution/list` | Fetch all solutions |



## 9. Project Folder Structure 📁

```
collabx-lite/
┣ backend/
┃ ┣ server.js
┃ ┣ websocket.js
┃ ┣ data/
┃ ┃ ┣ users.json
┃ ┃ ┣ ideas.json
┃ ┃ ┣ teams.json
┃ ┃ ┣ chat.json
┃ ┃ ┗ solutions.json
┣ frontend/
┃ ┣ index.html
┃ ┣ login.html
┃ ┣ dashboard.html
┃ ┣ submit.html
┃ ┣ browse.html
┃ ┣ workspace.html
┃ ┣ publish.html
┃ ┗ script.js
┣ README.md
```



## 10. Execution Guide ▶️

### Backend
```
cd backend
npm install
node server.js
```
Runs on: **http://localhost:3000**

### Frontend  
Open the `frontend/` folder using **VS Code Live Server** → `index.html`



## 11. Key Design Considerations 🧠

- Avoids database complexity → fast deployment  
- JSON-based persistence → transparent, portable  
- Real-time communication → enhances teamwork experience  
- Modular architecture → easy to extend with real databases or NLP later  
- Designed for short development cycles & academic demonstrations  



## 12. Potential Applications 🌍

| Domain | Use Case |
|--------|----------|
| Academic Projects | Team formation, collaboration, submission |
| Startups | Idea building, co-founder matching |
| Hackathons | Quick teaming + rapid prototypes |
| NGOs | Crowdsourcing solutions |
| Innovation Clubs | Challenge hosting and tracking |

