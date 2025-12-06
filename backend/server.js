const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { readData, writeData } = require("./dataStore");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// ===== SOCKET.IO HANDLER =====
io.on("connection", async (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chatMessage", async (data) => {
    io.emit("chatMessage", data);

    const chatMessages = await readData("chat.json");
    chatMessages.push({
      id: Date.now(),
      teamId: data.teamId,
      senderId: data.senderId,
      senderName: data.senderName,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
    await writeData("chat.json", chatMessages);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ===== BASIC HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Backend Running ✔");
});

// ===== AUTH ROUTES =====

// Register
app.post("/auth/register", async (req, res) => {
  const { name, email, password, skills } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const users = await readData("users.json");
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    passwordHash: hashed,
    skills: skills || [],
  };

  users.push(newUser);
  await writeData("users.json", users);

  res.json({ message: "Registered", user: { id: newUser.id, name, email } });
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const users = await readData("users.json");
  const found = users.find((u) => u.email === email);

  if (!found) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, found.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  res.json({
    message: "Login success",
    user: { id: found.id, name: found.name, email: found.email, skills: found.skills },
  });
});

// ===== IDEAS =====
app.post("/idea/submit", async (req, res) => {
  const { title, description, requiredSkills, postedByUserId } = req.body;

  const ideas = await readData("ideas.json");
  const newIdea = {
    id: Date.now(),
    title,
    description,
    requiredSkills: requiredSkills || [],
    postedByUserId,
    createdAt: new Date().toISOString(),
  };

  ideas.push(newIdea);
  await writeData("ideas.json", ideas);

  res.json({ message: "Idea submitted", idea: newIdea });
});

app.get("/idea/list", async (req, res) => {
  const ideas = await readData("ideas.json");
  res.json(ideas);
});

// ===== TEAM MATCHING HELPER =====
function calculateSkillScore(requiredSkills, userSkills) {
  if (!requiredSkills?.length || !userSkills?.length) return 0;

  const reqSet = new Set(requiredSkills.map((s) => s.toLowerCase()));
  const usrSet = new Set(userSkills.map((s) => s.toLowerCase()));
  let matches = 0;

  reqSet.forEach((s) => usrSet.has(s) && matches++);

  return matches / reqSet.size;
}

// Suggest collaborators
app.post("/team/suggest", async (req, res) => {
  const { ideaId } = req.body;

  const ideas = await readData("ideas.json");
  const users = await readData("users.json");

  const idea = ideas.find((i) => i.id == ideaId);
  if (!idea) return res.status(404).json({ error: "Idea not found" });

  const scored = users.map((u) => ({
    ...u,
    score: calculateSkillScore(idea.requiredSkills, u.skills),
  }));

  scored.sort((a, b) => b.score - a.score);

  res.json(scored.slice(0, 3));
});

// Create team
app.post("/team/create", async (req, res) => {
  const { ideaId, memberIds } = req.body;

  const teams = await readData("teams.json");
  const newTeam = {
    id: Date.now(),
    ideaId,
    memberIds,
    tasks: [],
  };

  teams.push(newTeam);
  await writeData("teams.json", teams);

  res.json({ message: "Team created", team: newTeam });
});

// Add Task
app.post("/team/task/add", async (req, res) => {
  const { teamId, title, assignedTo } = req.body;

  const teams = await readData("teams.json");
  const team = teams.find((t) => t.id == teamId);

  if (!team) return res.status(404).json({ error: "Team not found" });

  const newTask = {
    id: Date.now(),
    title,
    assignedTo,
    status: "pending",
  };

  team.tasks.push(newTask);
  await writeData("teams.json", teams);

  res.json({ message: "Task added", team });
});

// Mark Task complete
app.post("/team/task/complete", async (req, res) => {
  const { teamId, taskId } = req.body;

  const teams = await readData("teams.json");
  const team = teams.find((t) => t.id == teamId);

  if (!team) return res.status(404).json({ error: "Team not found" });

  const task = team.tasks.find((tk) => tk.id == taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.status = "done";
  await writeData("teams.json", teams);

  res.json({ message: "Task completed", team });
});

// ===== SOLUTION PUBLISH =====
app.post("/solution/publish", async (req, res) => {
  const { ideaId, teamId, title, description, link, submittedBy } = req.body;

  const solutions = await readData("solutions.json");
  const newSol = {
    id: Date.now(),
    ideaId,
    teamId,
    title,
    description,
    link,
    submittedBy,
    createdAt: new Date().toISOString(),
  };

  solutions.push(newSol);
  await writeData("solutions.json", solutions);

  res.json({ message: "Solution published", solution: newSol });
});

// Get published
app.get("/solution/list", async (req, res) => {
  const solutions = await readData("solutions.json");
  res.json(solutions);
});

// ===== RUN SERVER =====
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
