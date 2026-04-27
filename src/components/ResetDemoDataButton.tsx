import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export default function ResetDemoDataButton() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReset = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/reset-demo-data", { method: "POST" });
      if (!response.ok) throw new Error("Failed to reset");
      
      alert("Demo data cleared successfully. Your app is ready for real students.");
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Failed to fetch') {
        alert("Server connection failed. The backend API might be down or starting up. Please try again in a moment.");
      } else {
        alert("Failed to reset demo data: " + error.message);
      }
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        Reset Demo Data
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <AlertTriangle className="h-8 w-8" />
              <h3 className="text-xl font-bold text-gray-900">Reset Demo Data?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all demo students, teachers, fees, attendance, exams and other test data. This cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button 
                onClick={handleReset}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isDeleting ? "Clearing demo data..." : "Yes, Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
