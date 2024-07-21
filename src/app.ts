import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://tisxquhwharbxlrwzycc.supabase.co",

  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpc3hxdWh3aGFyYnhscnd6eWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI3OTI1NTIsImV4cCI6MjAxODM2ODU1Mn0.kV6lDxrNPPFESZG0ztrISRuvBXJLY_KVjY110-byxR0"
);

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

//get all list bucket supabase FM1 path
app.get("/songs/FM1", async (req: Request, res: Response) => {
  const { data, error } = await supabase.storage.from("songs").list("FM1", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "desc" },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

//get all list bucket supabase FM2 path
app.get("/songs/FM2", async (req: Request, res: Response) => {
  const { data, error } = await supabase.storage.from("songs").list("FM2", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

//get all list bucket supabase FM3 path
app.get("/songs/FM3", async (req: Request, res: Response) => {
  const { data, error } = await supabase.storage.from("songs").list("FM3", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

//get all list bucket supabase FM4 path
app.get("/songs/FM4", async (req: Request, res: Response) => {
  const { data, error } = await supabase.storage.from("songs").list("FM4", {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

//upload audio file to supabase FM4  bucket from local file[0] in ./audio folder
app.get("/upload/FM4", async (req: Request, res: Response) => {
  /// avatarFile from local file[0] in ./audio/FM2.wav is blob
  // Read the file from the filesystem
  const filePath = path.join(__dirname, "../audio/FM2.wav");

  try {
    const avatarFile = fs.readFileSync(filePath);
    const blob = new Blob([avatarFile], { type: "audio/wav" });
    const { data, error } = await supabase.storage
      .from("songs")
      .upload(`FM4/${new Date()}.wav`, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to read the file" });
  }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
