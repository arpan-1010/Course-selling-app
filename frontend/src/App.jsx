import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import CourseDetails from "./pages/CourseDetails"
import MyCourses from "./pages/MyCourses"
import CoursePlayer from "./pages/CoursePlayer"
import Courses from "./pages/Courses"
import Demo from "./pages/Demo"
import CourseLessons from "./pages/CourseLessons"

function App() {

  return (
    
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/signin" element={<SignIn />} />

      <Route path="/courses" element={<Courses />} />

      <Route path="/demo" element={<Demo />} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin" >
          <AdminDashboard />
        </ProtectedRoute>} 
      />
      
      <Route path="/user/dashboard" element={
        <ProtectedRoute allowedRole="user" >
          <UserDashboard />
        </ProtectedRoute>} 
      />

      <Route path="/admin/course/:courseId" element={
        <ProtectedRoute allowedRole="admin">
            <CourseDetails />
        </ProtectedRoute>
      } />

      <Route path="/user/course/:courseId" element={
        <ProtectedRoute allowedRole="user">
            <CourseDetails />
        </ProtectedRoute>
      } />

      <Route path="/course/:courseId" element={<CourseDetails />} />

      <Route path="/user/my-course" element = {
        <ProtectedRoute allowedRole="user">
          <MyCourses />
        </ProtectedRoute>
      }
      />

      <Route path="/user/course/:courseId/learn" element={
          <ProtectedRoute allowedRole="user">
              <CoursePlayer />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/course/:courseId/lessons" element={
        <ProtectedRoute allowedRole="admin">
          <CourseLessons />
        </ProtectedRoute>
      }
      />

    </Routes>

  )
}

export default App