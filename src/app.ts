import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
// import cron from "node-cron";
// import axios from "axios";

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
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

//get all list bucket supabase FM2 path
app.get("/songs/FM2", async (req: Request, res: Response) => {
  const { data, error } = await supabase.storage.from("songs").list("FM2", {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

//get all list bucket supabase FM3 path
app.get("/songs/FM3", async (req: Request, res: Response) => {
  const { data, error } = await supabase.storage.from("songs").list("FM3", {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
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
app.get("/upload/:fm", async (req: Request, res: Response) => {
  const { fm } = req.params;

  /// avatarFile from local file[0] in ./audio/FM2.wav is blob

  // Read the file from the filesystem
  const filePath = path.join(__dirname, "../audio/FM2.wav");

  try {
    const avatarFile = fs.readFileSync(filePath);
    const blob = new Blob([avatarFile], { type: "audio/wav" });
    //rename file from `Tue Jul 23 2024 17:45:00 GMT+0700 (Indochina Time).wav`  to `Tue Jul 23 2024 17:45.wav`
    const fileName = `${new Date(new Date().getTime() + 0 * 60 * 60 * 1000)
      .toString()
      .slice(0, 21)}.wav`;
    //rename new fileName from `Tue Jul 23 2024 17:45.wav` to `Tue_Jul_23_2024_17_45.wav`
    const newFileName = fileName.replace(/ /g, "_");
    const { data, error } = await supabase.storage
      .from("songs")
      .upload(`${fm}/${newFileName}`, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to read the file" });
  }
});

// // Function to convert a Date object to a cron string
// function dateToCron(date: Date): string {
//   const minutes = date.getMinutes();
//   const hours = date.getHours();
//   const dayOfMonth = date.getDate();
//   const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
//   const dayOfWeek = date.getDay();
//   return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
// }
// //Define the route for get Datetime inroute param  for schedule GET request
// app.get("/schedule-get-request/:datetime", (req, res) => {
//   const { datetime } = req.params;
//   const date = new Date(datetime);
//   if (isNaN(date.getTime())) {
//     return res.status(400).send("Invalid datetime format");
//   }
//   scheduleGetRequest(res);
// });

// // Function to schedule a GET request based on the current datetime from "/schedule-get-request/:datetime"
// function scheduleGetRequest(res: ExpressResponse) {
//   const now = new Date();
//   const cronTime = dateToCron(now);

//   // Schedule a GET request to be executed at the current datetime

//   cron.schedule(
//     cronTime,
//     () => {
//       console.log(`Executing GET request at: ${new Date().toISOString()}`);
//       axios
//         .get("http://localhost:8000/upload/FM4")
//         .then((response) => {
//           console.log(response.data);
//           res.send(
//             `GET request executed successfully: ${JSON.stringify(
//               response.data
//             )}`
//           );
//         })
//         .catch((error) => {
//           console.error(error);
//           res.status(500).send(`Error executing GET request: ${error.message}`);
//         });
//     },
//     {
//       scheduled: true,
//       timezone: "Asia/Bangkok", // Replace with your timezone
//     }
//   );

//   console.log(`Scheduled GET request for: ${now.toISOString()}`);
// }

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
