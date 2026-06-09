import { useEffect, useState } from "react";
import ViewCourseCard from "../components/ViewCourseCard";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {

    const [courses, setCourses] = useState([]);

    const navigate = useNavigate()

    const fetchCourses = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/v1/course/my-courses`,
                {
                    headers: {
                        Authorization : `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/signin");
                return;
            }

            const data = await response.json();

            //console.log(data);

            setCourses(data.courses || []);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">

            <h1 className="text-4xl font-bold mb-8">
                My Courses
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {courses.map((course) => (
                    <ViewCourseCard
                        key={course._id}
                        id={course._id}
                        title={course.title}
                        description={course.description}
                        price={course.price}
                        imageUrl={course.imageUrl}
                    />
                ))}

            </div>

        </div>
    );
}