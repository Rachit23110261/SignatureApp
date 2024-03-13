import React, { useRef, useState } from 'react';
import './App.css'
import axios from 'axios';

const SignaturePad = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [strokeSize, setStrokeSize] = useState(5); // Default stroke size
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const Upload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    if (isErasing) {
      ctx.strokeStyle = 'white'; // Set color to white for erasing
      ctx.lineWidth = strokeSize * 4; // Set line width for eraser
    } else {
      ctx.strokeStyle = 'black'; // Set color back to black for drawing
      ctx.lineWidth = strokeSize; // Set line width for drawing
    }

    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/jpeg');

    // Download the signature as a JPG file
    const link = document.createElement('a');
    setFile('signature.jpg')
    link.download = 'signature.jpg';
    link.href = dataUrl;
    link.click();
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const changeStrokeSize = (event) => {
    setStrokeSize(parseInt(event.target.value));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{ border: '1px solid #ccc' }}
      />
      <br />
      
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={saveSignature}>Save</button>
      <button onClick={toggleEraser}>{isErasing ? 'Draw' : 'Erase'}</button>
      <input
        type="range"
        min="1"
        max="20"
        value={strokeSize}
        onChange={changeStrokeSize}/>
      <input type="file" onChange={handleFileChange} />
      <button onClick={Upload} disabled={!file}>upload</button>
      
      
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Signature App</h1>
      <SignaturePad />
    </div>
  );
};

export default App;
