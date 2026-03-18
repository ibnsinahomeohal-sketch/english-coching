import { useState, useEffect, FormEvent } from "react";
import { Search, Phone, BookOpen, UserCircle, MoreVertical, Edit, Trash2, X, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

const COURSES = ["All Courses", "Spoken English", "Writing", "Kids English", "SSC/HSC English"];

export default function StudentsList() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching students from Supabase...");
      const { data, error } = await supabase
        .from('students')
        .select('*');
        // Removed explicit order by created_at to prevent crash if column is missing

      if (error) {
        console.error("Supabase Fetch Error:", error);
        throw error;
      }
      
      console.log("Fetched Data:", data);
      setStudents(data || []);
      
      if (data && data.length === 0) {
        console.warn("No students found in the 'students' table.");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error(`Failed to load students: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    const query = searchQuery.toLowerCase();
    
    // Safely convert fields to strings for searching
    const name = String(student.name || "").toLowerCase();
    const studentId = String(student.student_id || "").toLowerCase();
    const mobile = String(student.mobile || "").toLowerCase();
    
    const matchesSearch = 
      name.includes(query) || 
      studentId.includes(query) ||
      mobile.includes(query);
      
    return matchesCourse && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('student_id', id);

      if (error) throw error;
      
      setStudents(students.filter(s => s.student_id !== id));
      toast.success("Student deleted successfully");
      setActiveDropdown(null);
    } catch (error: any) {
      toast.error("Failed to delete student");
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setActiveDropdown(null);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      try {
        const { error } = await supabase
          .from('students')
          .update({
            name: editingStudent.name,
            mobile: editingStudent.mobile,
            course: editingStudent.course,
            batch: editingStudent.batch,
          })
          .eq('student_id', editingStudent.student_id);

        if (error) throw error;

        setStudents(students.map(s => s.student_id === editingStudent.student_id ? editingStudent : s));
        setEditingStudent(null);
        toast.success("Student details updated successfully!");
      } catch (error: any) {
        toast.error("Failed to update student");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Students</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all admitted students across different courses</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
            <span className="text-sm font-medium text-indigo-600">Total Students: {students.length}</span>
          </div>
          <button 
            onClick={fetchStudents}
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Name, ID, or Phone Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 font-medium text-gray-700"
          >
            {COURSES.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading students...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student, index) => (
            <div key={student.student_id || student.id || index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-gray-100">
                      <UserCircle className="h-10 w-10 text-indigo-500" />
                    </div>
                    <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500`}></span>
                  </div>
                  
                  {/* 3-Dots Dropdown Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === student.student_id ? null : student.student_id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {activeDropdown === student.student_id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveDropdown(null)}
                        ></div>
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            onClick={() => handleEdit(student)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(student.student_id)}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">ID: {student.student_id}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span className="truncate font-medium">{student.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    <span>{student.mobile}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-200 px-2 py-1 rounded-md">
                  {student.batch || "N/A"}
                </span>
                <button 
                  onClick={() => setViewingStudent(student)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <UserCircle className="h-4 w-4" /> View Profile
                </button>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
              <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                {students.length === 0 ? "No students in database" : "No students match your search"}
              </h3>
              <p className="text-gray-500">
                {students.length === 0 
                  ? "Go to the Admission page to add your first student." 
                  : "Try adjusting your search or course filter."}
              </p>
              {students.length === 0 && (
                <button 
                  onClick={() => window.location.href = '/admission'}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Admission
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editingStudent.name} 
                  onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editingStudent.mobile} 
                  onChange={e => setEditingStudent({...editingStudent, mobile: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select 
                    value={editingStudent.course} 
                    onChange={e => setEditingStudent({...editingStudent, course: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {COURSES.filter(c => c !== "All Courses").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <input 
                    type="text" 
                    value={editingStudent.batch} 
                    onChange={e => setEditingStudent({...editingStudent, batch: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    required 
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)} 
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-28 relative">
              <button 
                onClick={() => setViewingStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="absolute -top-14 left-8">
                <div className="h-28 w-28 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center shadow-md">
                  <UserCircle className="h-20 w-20 text-indigo-500" />
                </div>
              </div>
              <div className="pt-16">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{viewingStudent.name}</h2>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700`}>
                    Active
                  </span>
                </div>
                <p className="text-indigo-600 font-semibold mb-6">Student ID: {viewingStudent.student_id}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Course</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.course}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Phone Number</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <UserCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Batch</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.batch || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => { handleEdit(viewingStudent); setViewingStudent(null); }}
                    className="flex-1 bg-indigo-50 text-indigo-700 font-semibold py-2.5 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" /> Edit Details
                  </button>
                  <button 
                    onClick={() => setViewingStudent(null)}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

