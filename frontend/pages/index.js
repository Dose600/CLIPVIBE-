import { useState } from "react";

export default function Home() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!audioFile || videoFiles.length === 0) {
      alert("Please select an audio and at least one video/image.");
      return;
    }

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("audio", audioFile);

    for (let i = 0; i < videoFiles.length; i++) {
      formData.append("videos", videoFiles[i]);
    }

    const res = await fetch("https://your-backend.onrender.com/upload ", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("Uploaded. Matching vibe...");
      const mergeRes = await fetch("https://your-backend.onrender.com/merge ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioPath: data.audioPath,
          videoPaths: data.videoPaths,
        }),
      });

      const mergeData = await mergeRes.json();
      setResults(mergeData.matches);
      setStatus("Done!");
    } else {
      setStatus("Upload failed.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>🎵 ClipVibe - Match Music to Vibe</h1>
      <p>Upload a song and videos/pictures:</p>

      <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
      <br />
      <br />
      <input
        type="file"
        accept="video/*,image/*"
        multiple
        onChange={(e) => setVideoFiles([...e.target.files])}
      />

      <br />
      <br />
      <button onClick={handleUpload}>Upload & Match</button>

      {results.length > 0 && (
        <>
          <h3>🎉 Top Matches</h3>
          <ul>
            {results.map((match, i) => (
              <li key={i}>
                {match.filename} — Score: {match.score.toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
  }
