'use client';
import { useState } from "react";

export default function FeedbackForm() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Bug",
        submitterName: "",
        submitterEmail: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        });
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try{
            const response = await fetch("http://localhost:5000/api/feedbacks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if(response.ok) {
                setMessage("Feedback submitted successfully!");
                setFormData({
                    title: "",
                    description: "",
                    category: "Bug",
                    submitterName: "",
                    submitterEmail: ""
                });
            } else {
                setMessage(data.error || "Failed to submit feedbacks. Please try again.");
            }

        }catch(error) {
            setMessage("An error occurred while submitting your feedback. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Feedback Form</h2>

            {message && (<div className="mb-4 text-sm text-center text-blue-600">{message}</div>)}

            <form onSubmit={handleSubmitForm} className="space-y-4">
                {/*Title*/}
                <input type="text" name="title" placeholder="Feedback title" value={formData.title} onChange={handleChanges}
                required className="w-full border rounded-lg p-2" />

                {/*Description*/}
                <textarea name="description" placeholder="Describe your feedback" value={formData.description} onChange={handleChanges}
                required rows={4} className="w-full border rounded-lg p-2" />

                {/*Category*/}
                <select name="category" title="Select feedback category" value={formData.category} onChange={handleChanges} className="w-full border rounded-lg p-2">
                    <option value="Bug">Bug</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Improvement">Improvement</option>
                    <option value="Other">Other</option>  
                </select>

                {/*Name*/}
                <input type="text" name="submitterName" placeholder="Enter your name" value={formData.submitterName} onChange={handleChanges}
                className="w-full border rounded-lg p-2" />

                {/*Email*/}
                <input type="email" name="submitterEmail" placeholder="Enter your email" value={formData.submitterEmail} onChange={handleChanges}
                className="w-full border rounded-lg p-2" />

                {/*Submit button*/ }
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    {loading ? "Submitting...": "Submit feedback"}
                </button>

            </form>

        </div>
    );

}