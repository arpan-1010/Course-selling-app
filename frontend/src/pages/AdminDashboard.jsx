import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import ProfileCard from "../components/ProfileCard";
import { motion } from "framer-motion"

function AdminDashboard() {

  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false)

  const [courses, setCourses] = useState([]);
  const [courseModal, setCourseModal] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const navigate = useNavigate();
  
  const [students, setStudents] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadCourseId, setUploadCourseId] = useState(null);
  const [lessonData, setLessonData] = useState({ title: "", videoUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [videoType, setVideoType] = useState("url");
  const [videoFile, setVideoFile] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteCourseId, setDeleteCourseId] = useState(null)

  const [imageType, setImageType] = useState("url")
  const [imageFile, setImageFile] = useState(null)

  const [deleteAccountModal, setDeleteAccountModal] = useState(false)

  const closeCourseModal = () => {
      setCourseModal(false)
      setCourseData({ title: "", description: "", price: "", imageUrl: "" })
      setImageType("url")
      setImageFile(null)
      setEditCourseId(null)
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) setProfile(data.admin);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    try {
        setCreating(true)

        let response

        if (imageType === "file") {
            const formData = new FormData()
            formData.append("title", courseData.title)
            formData.append("description", courseData.description)
            formData.append("price", courseData.price)
            formData.append("imageType", "file")
            formData.append("imageFile", imageFile)

            response = await fetch(`${API_URL}/api/v1/admin/course/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            })
        } else {
            response = await fetch(`${API_URL}/api/v1/admin/course/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...courseData,
                    imageType: "url"
                })
            })
        }

        if (response.status === 401) {
            localStorage.removeItem("token")
            navigate("/signin")
            return
        }

        const data = await response.json()
        if (response.ok) {
            closeCourseModal()
            await fetchCourses()
        } else {
            alert(data.message || "Failed to create course.")
        }
    } catch (error) {
        console.log(error)
    } finally {
        setCreating(false)
    }
  }
  const fetchCourses = async () => {
    try {
      //console.log("Stored token:", localStorage.getItem("token"));
      const response = await fetch(`${API_URL}/api/v1/admin/course/bulk`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      setCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
        const response = await fetch(`${API_URL}/api/v1/admin/stats`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        const data = await response.json()
        if (response.ok) {
            setStudents(data.students)
            setRevenue(data.revenue)
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchProfile();
    fetchStats();
  }, []);

  const confirmDelete = (courseId) => {
      setDeleteCourseId(courseId)
      setDeleteModal(true)
  }

  const handleDelete = async () => {
      try {
          const response = await fetch(
              `${API_URL}/api/v1/admin/course/delete/${deleteCourseId}`,
              {
                  method: "DELETE",
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
              }
          )

          if (response.status === 401) {
              localStorage.removeItem("token")
              navigate("/signin")
              return
          }

          const data = await response.json()
          if (response.ok) {
              setDeleteModal(false)
              setDeleteCourseId(null)
              await fetchCourses()
          }
      } catch (error) {
          console.log(error)
      }
  }

  const onUpdate = (course) => {
    setEditCourseId(course._id)
    setCourseData({
        title: course.title,
        description: course.description,
        price: course.price,
        imageUrl: course.imageUrl
    })
    setImageType("url")
    setImageFile(null)
    setCourseModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
        setUpdating(true)

        let response

        if (imageType === "file" && imageFile) {
            const formData = new FormData()
            formData.append("courseId", editCourseId)
            formData.append("title", courseData.title)
            formData.append("description", courseData.description)
            formData.append("price", courseData.price)
            formData.append("imageType", "file")
            formData.append("imageFile", imageFile)

            response = await fetch(`${API_URL}/api/v1/admin/course/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            })
        } else {
            response = await fetch(`${API_URL}/api/v1/admin/course/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    courseId: editCourseId,
                    ...courseData,
                    imageType: "url"
                })
            })
        }

        if (response.status === 401) {
            localStorage.removeItem("token")
            navigate("/signin")
            return
        }

        const data = await response.json()
        //console.log(data)

        if (response.ok) {
            closeCourseModal()
            await fetchCourses()
        } else {
            alert(data.message || "Failed to update course.")
        }

    } catch (error) {
        console.log(error)
    } finally {
        setUpdating(false)
    }
  }

  const onUpload = (courseId) => {
    setUploadCourseId(courseId);
    setLessonData({ title: "", videoUrl: "" });
    setVideoType("url");
    setVideoFile(null);
    setUploadError("");
    setUploadSuccess("");
    setUploadModal(true);
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();

    if (!lessonData.title.trim()) {
      setUploadError("Lesson title is required.");
      return;
    }
    if (videoType === "url" && !lessonData.videoUrl.trim()) {
      setUploadError("Video URL is required.");
      return;
    }
    if (videoType === "file" && !videoFile) {
      setUploadError("Please select a video file.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess("");

      let response;

      if (videoType === "url") {
        response = await fetch(
          `${API_URL}/api/v1/admin/course/${uploadCourseId}/lesson`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: lessonData.title,
              videoUrl: lessonData.videoUrl,
              videoType: "url",
            }),
          },
        );
      } else {
        const formData = new FormData();
        formData.append("title", lessonData.title);
        formData.append("videoFile", videoFile);
        formData.append("videoType", "file");

        response = await fetch(
          `${API_URL}/api/v1/admin/course/${uploadCourseId}/lesson`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          },
        );
      }

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setUploadSuccess("Lesson uploaded successfully!");
        setLessonData({ title: "", videoUrl: "" });
        setVideoFile(null);
        setVideoType("url");
      } else {
        setUploadError(data.message || "Failed to upload lesson.");
      }
    } catch (error) {
      console.log(error);
      setUploadError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
      try {
          setLogoutLoading(true)
          await new Promise(resolve => setTimeout(resolve, 1000))
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          navigate("/")
      } catch (error) {
          console.log(error)
      } finally {
          setLogoutLoading(false)
      }
  }

  const handleDeleteAccount = async () => {
    try {
        const response = await fetch(`${API_URL}/api/v1/admin/delete-account`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })

        if (response.ok) {
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            navigate("/")
        }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learn@Ease
            </h1>

            <div className="flex items-center gap-4">
                <a href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/>
                    </svg>
                    Go to Home
                </a>
                <div className="hidden sm:block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
                    Admin Dashboard
                </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition"
                >
                  {profile
                    ? `${profile.firstName?.[0]}${profile.lastName?.[0]}`.toUpperCase()
                    : "A"}
                </button>

                {showProfile && profile && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                        <div className="absolute right-0 mt-2 w-72 z-50">
                            <ProfileCard profile={profile} role="admin" />
                            <button
                                onClick={() => { setShowProfile(false); setDeleteAccountModal(true) }}
                                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                </svg>
                                Delete Account
                            </button>
                        </div>
                    </>
                )}
              </div>

              <button onClick={handleLogout} disabled={logoutLoading}
                  className="px-4 py-2 border border-slate-700 rounded-2xl hover:bg-red-500 transition disabled:opacity-60 flex items-center gap-2">
                  {logoutLoading ? (
                      <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Logging out...
                      </>
                  ) : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold">Welcome Back 👋</h2>
        <p className="text-slate-400 mt-2">
          Create, edit and manage all your courses
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Courses</p>
            <h3 className="text-3xl font-bold text-blue-400 mt-2">
              {courses?.length || 0}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Students</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">{students}</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Revenue</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">INR {revenue.toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Courses</h2>
          <button
            disabled={creating}
            onClick={() => {
              setEditCourseId(null);

              setCourseData({
                title: "",
                description: "",
                price: "",
                imageUrl: "",
              });
              setCourseModal(true);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition font-medium"
          >
            Create Course
          </button>
        </div>

        {courses?.length === 0 ? (
          <div className="mt-8 text-slate-400">
            No Courses found. Create your first course
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 items-stretch">
            {courses?.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                description={course.description}
                price={course.price}
                imageUrl={course.imageUrl}
                onDelete={confirmDelete}
                onEdit={() => onUpdate(course)}
                onUpload={onUpload}
              />
            ))}
          </div>
        )}
      </section>

      {courseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="border border-white/10 bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl text-center font-bold mb-6">
              {editCourseId ? "Edit Course" : "Create Course"}
            </h2>

            <form onSubmit={editCourseId ? handleUpdate : handleCreateCourse}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="mb-4">
                <textarea
                  placeholder="Course Description"
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  rows={4}
                />
              </div>

              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={courseData.price}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      price:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="mb-4">
                <div className="mb-4">
                    <label className="block text-slate-400 mb-2 text-sm">Course Image</label>
                    <div className="flex bg-slate-800 p-1 rounded-xl mb-3">
                        <button type="button"
                            onClick={() => { setImageType("url"); setImageFile(null) }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${imageType === "url" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}>
                            🔗 Image URL
                        </button>
                        <button type="button"
                            onClick={() => { setImageType("file"); setCourseData({...courseData, imageUrl: ""}) }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${imageType === "file" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}>
                            📁 Upload File
                        </button>
                    </div>

                    {imageType === "url" ? (
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={courseData.imageUrl}
                            onChange={(e) => setCourseData({...courseData, imageUrl: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                        />
                    ) : (
                        <div
                            onClick={() => document.getElementById("courseImageInput").click()}
                            className={`w-full px-4 py-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition
                                ${imageFile ? "border-purple-500/50 bg-purple-500/5" : "border-slate-700 bg-slate-800 hover:border-slate-500"}`}
                        >
                            {imageFile ? (
                                <div>
                                    <p className="text-purple-400 text-sm font-medium">✓ {imageFile.name}</p>
                                    <p className="text-slate-500 text-xs mt-1">{(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-slate-400 text-sm">Click to select an image</p>
                                    <p className="text-slate-500 text-xs mt-1">JPG, PNG, WebP — max 10MB</p>
                                </div>
                            )}
                        </div>
                    )}
                    <input
                        id="courseImageInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            setImageFile(e.target.files[0] || null)
                        }}
                    />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => closeCourseModal()}
                  className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  disabled={updating || creating}
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                >
                  {updating ? "Updating..." : creating ? "Creating..." : editCourseId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {uploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="border border-white/10 bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl text-center font-bold mb-2">
              Upload Lesson
            </h2>
            <p className="text-slate-400 text-center text-sm mb-6">
              Add a new lesson to this course
            </p>

            {uploadError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-4 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadContent}>
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to React"
                  value={lessonData.title}
                  onChange={(e) => {
                    setUploadError("");
                    setLessonData({ ...lessonData, title: e.target.value });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">
                  Video Source
                </label>
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoType("url");
                      setUploadError("");
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${videoType === "url" ? "bg-green-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    🔗 Video URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoType("file");
                      setUploadError("");
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${videoType === "file" ? "bg-green-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    📁 Local File
                  </button>
                </div>
              </div>

              {videoType === "url" && (
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={lessonData.videoUrl}
                    onChange={(e) => {
                      setUploadError("");
                      setLessonData({
                        ...lessonData,
                        videoUrl: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              )}

              {videoType === "file" && (
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">
                    Video File
                  </label>
                  <div
                        onClick={() =>
                        document.getElementById("videoFileInput").click()
                        }
                        className={`w-full px-4 py-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition
                        ${videoFile ? "border-green-500/50 bg-green-500/5" : "border-slate-700 bg-slate-800 hover:border-slate-500"}`}
                    >
                        {videoFile ? (
                      <div>
                        <p className="text-green-400 text-sm font-medium">
                          ✓ {videoFile.name}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                        ) : (
                      <div>
                        <p className="text-slate-400 text-sm">
                          Click to select a video file
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          MP4, WebM, MKV, MOV — MAX (500MB)
                        </p>
                      </div>
                        )}
                    </div>
                  <input
                    id="videoFileInput"
                    type="file"
                    accept="video/mp4,video/webm,video/x-matroska,.mov"
                    className="hidden"
                    onChange={(e) => {
                      setUploadError("");
                      setVideoFile(e.target.files[0] || null);
                    }}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition font-medium disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {deleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-8 w-full max-w-sm mx-6 shadow-2xl shadow-amber-900/20 backdrop-blur-xl"
              >
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                  </div>

                  <h3 className="text-xl font-bold text-center text-white mb-2">
                      Delete Course
                  </h3>
                  <p className="text-slate-400 text-center text-sm mb-8">
                      Are you sure you want to delete this course?
                  </p>

                  <div className="flex gap-3">
                      <button
                          onClick={() => {
                              setDeleteModal(false)
                              setDeleteCourseId(null)
                          }}
                          className="flex-1 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition font-medium text-amber-300"
                      >
                          Cancel
                      </button>
                      <button
                          onClick={handleDelete}
                          className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-medium text-white"
                      >
                          Delete
                      </button>
                  </div>
              </motion.div>
          </div>
      )}

      {deleteAccountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/5 border border-red-500/30 rounded-2xl p-8 w-full max-w-sm mx-6 shadow-2xl backdrop-blur-xl">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-2">Delete Account</h3>
                <p className="text-slate-400 text-center text-sm mb-8">
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setDeleteAccountModal(false)}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-slate-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-medium text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )}

    </div>
  );
}

export default AdminDashboard;