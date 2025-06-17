"use client";
import { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export function Draw({chapter, index, setStep, data}){
    const canvasRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleClear = () => {
        canvasRef.current?.clearCanvas();
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
        // Get base64 image
        const base64Data = await canvasRef.current?.exportImage("jpeg");

        // Convert base64 to Blob
        const blob = await (await fetch(base64Data)).blob();

        // Create file-like object
        const file = new File([blob], "drawing.jpg", { type: "image/jpeg" });

        // Send to backend using FormData (like file input)
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("https://unfathomable08-fluentyx-cnn.hf.space/predict", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const result = await res.json()
            console.log(result)

            if (result.prediction == data[index - 1].prediction){
                setStep(prev => prev + 1)
                handleClear()
            }
            else {
                const pred = data.filter(d => d.prediction == result.prediction)
                console.log(pred)
                alert("Your drawing is classified as: " + pred[0].pronounce)
                handleClear()
            }
        } else {
            alert("Upload failed.");
        }
        } catch (error) {
        console.error("Error exporting or uploading:", error);
        } finally {
        setIsSaving(false);
        }
    };

    if (!isActive) return null;

    return (
        <div className="flex flex-col items-center gap-4">
        <ReactSketchCanvas
            ref={canvasRef}
            width="80%"
            height="300px"
            strokeWidth={8}
            strokeColor="#000"
            className="border rounded-lg w-full max-w-[600px]"
        />

        <div className="flex gap-4">
            <button onClick={handleClear} className="px-4 py-2 bg-gray-300 rounded">
            Clear
            </button>
            <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded"
            >
            {isSaving ? "Submitting..." : "Submit"}
            </button>
        </div>
        </div>
    );
}