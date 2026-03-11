"use client"

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            FeedPulse
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Your feedback matters! Share your thoughts or manage your feedbacks.
          </p>

          <div className="space-y-4">
            {/* Submit Feedback Button */}
            <Link href="/feedback">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-lg">
                 Submit Feedback
              </button>
            </Link>

            {/* Admin Login Button */}
            <Link href="/admin">
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg">
                 Admin Login
              </button>
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Feedback helps us improve. Thank you for using FeedPulse!
          </p>
        </div>
      </div>
    </div>
  );
}
