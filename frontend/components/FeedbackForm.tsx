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
    const [aiAnalysis, setAiAnalysis] = useState<{
        sentiment?: string;
        priority_score?: number;
        summary?: string;
        tags?: string[];
        ai_category?: string;
    } | null>(null);

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
        setAiAnalysis(null);

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
                if (data.data) {
                    setAiAnalysis({
                        sentiment: data.data.sentiment,
                        priority_score: data.data.priority_score,
                        summary: data.data.summary,
                        tags: data.data.tags,
                        ai_category: data.data.ai_category
                    });
                }
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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Share Your Feedback</h2>
            <p className="text-gray-600 mb-6">Help us improve by sharing your thoughts and suggestions.</p>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm text-center font-semibold ${
                    message.includes("successfully") 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 mb-8">
                {/*Title*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Title *</label>
                    <input type="text" name="title" placeholder="e.g., Login button not responding" 
                        value={formData.title} onChange={handleChanges}
                        required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                {/*Description*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea name="description" placeholder="Describe your feedback in detail..." 
                        value={formData.description} onChange={handleChanges}
                        required rows={4} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                {/*Category*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category" title="Select feedback category" 
                        value={formData.category} onChange={handleChanges} 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Bug">Bug</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Improvement">Improvement</option>
                        <option value="Other">Other</option>  
                    </select>
                </div>

                {/*Name*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input type="text" name="submitterName" placeholder="Enter your name" 
                        value={formData.submitterName} onChange={handleChanges}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                {/*Email*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input type="email" name="submitterEmail" placeholder="Enter your email" 
                        value={formData.submitterEmail} onChange={handleChanges}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                {/*Submit button*/}
                <button type="submit" disabled={loading} 
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400">
                    {loading ? "Submitting...": "Submit Feedback"}
                </button>

            </form>

            {/* AI Analysis Results */}
            {aiAnalysis && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-900 mb-4"> AI Analysis</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Sentiment */}
                        {aiAnalysis.sentiment && (
                            <div className="bg-white p-4 rounded-lg border border-yellow-200">
                                <div className="text-sm font-semibold text-gray-600">Sentiment</div>
                                <div className={`text-lg font-bold mt-2 px-3 py-1 rounded-full w-fit ${
                                    aiAnalysis.sentiment === "Positive" ? "bg-green-100 text-green-800" :
                                    aiAnalysis.sentiment === "Negative" ? "bg-red-100 text-red-800" :
                                    "bg-gray-100 text-gray-800"
                                }`}>
                                    {aiAnalysis.sentiment}
                                </div>
                            </div>
                        )}

                        {/* Priority Score */}
                        {aiAnalysis.priority_score && (
                            <div className="bg-white p-4 rounded-lg border border-yellow-200">
                                <div className="text-sm font-semibold text-gray-600">Priority Score</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="text-2xl font-bold text-blue-600">{aiAnalysis.priority_score}</div>
                                    <div className="text-xs text-gray-500">/ 10</div>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" 
                                        style={{width: `${(aiAnalysis.priority_score / 10) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* AI Category */}
                        {aiAnalysis.ai_category && (
                            <div className="bg-white p-4 rounded-lg border border-yellow-200">
                                <div className="text-sm font-semibold text-gray-600">Analyzed Category</div>
                                <div className="text-lg font-semibold text-purple-700 mt-2">
                                    {aiAnalysis.ai_category}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {aiAnalysis.summary && (
                        <div className="bg-white p-4 rounded-lg border border-yellow-200 mt-4">
                            <div className="text-sm font-semibold text-gray-600 mb-2">AI Summary</div>
                            <p className="text-gray-700">{aiAnalysis.summary}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {aiAnalysis.tags && aiAnalysis.tags.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-yellow-200 mt-4">
                            <div className="text-sm font-semibold text-gray-600 mb-3">Extracted Tags</div>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-yellow-200 text-yellow-900 text-sm font-medium px-3 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );

}