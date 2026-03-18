import { useState, FormEvent } from "react";
import { Search, Phone, BookOpen, UserCircle, MoreVertical, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const COURSES = ["All Courses", "Spoken English", "Writing", "Kids English", "SSC/HSC English"];

const INITIAL_STUDENTS: any[] = [];

export default function StudentsList() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewingStudent, setViewingStudent] = useState<typeof INITIAL_STUDENTS[0] | null>(null);
  const [editingStudent, setEditingStudent] = useState<typeof INITIAL_STUDENTS[0] | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      student.name.toLowerCase().includes(query) || 
      student.id.includes(query) ||
      student.phone.includes(query);
    return matchesCourse && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success("Student deleted successfully");
    setActiveDropdown(null);
  };

  const handleEdit = (student: typeof INITIAL_STUDENTS[0]) => {
    setEditingStudent(student);
    setActiveDropdown(null);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
      setEditingStudent(null);
      toast.success("Student details updated successfully!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Students</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all admitted students across different courses</p>
        </div>
        {/* Add New Student button removed as requested, since Admission page exists */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <img src={student.photo} alt={student.name} className="h-16 w-16 rounded-full object-cover border-2 border-gray-100" />
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                </div>
                
                {/* 3-Dots Dropdown Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {activeDropdown === student.id && (
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
                          onClick={() => handleDelete(student.id)}
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
              <p className="text-sm text-gray-500 font-medium mb-4">ID: {student.id}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span className="truncate font-medium">{student.course}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-200 px-2 py-1 rounded-md">
                {student.batch}
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
            <h3 className="text-lg font-medium text-gray-900">No students found</h3>
            <p className="text-gray-500">Try adjusting your search or course filter.</p>
          </div>
        )}
      </div>

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
                  value={editingStudent.phone} 
                  onChange={e => setEditingStudent({...editingStudent, phone: e.target.value})} 
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editingStudent.status} 
                  onChange={e => setEditingStudent({...editingStudent, status: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                <img 
                  src={viewingStudent.photo} 
                  alt={viewingStudent.name} 
                  className="h-28 w-28 rounded-full border-4 border-white object-cover bg-white shadow-md" 
                />
              </div>
              <div className="pt-16">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{viewingStudent.name}</h2>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${viewingStudent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {viewingStudent.status}
                  </span>
                </div>
                <p className="text-indigo-600 font-semibold mb-6">Student ID: {viewingStudent.id}</p>
                
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
                      <p className="font-semibold text-gray-900">{viewingStudent.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <UserCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Batch</p>
                      <p className="font-semibold text-gray-900">{viewingStudent.batch}</p>
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

