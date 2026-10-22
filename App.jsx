
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    department: "",
    email: "",
    cgpa: ""
  });

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend. Check port 5000.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      regNo: "",
      name: "",
      department: "",
      email: "",
      cgpa: ""
    });
    setEditId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        ...formData,
        cgpa: formData.cgpa === "" ? undefined : Number(formData.cgpa)
      };

      if (editId) {
        await axios.put(`${API}/${editId}`, data);
        setMessage("Student updated successfully!");
      } else {
        await axios.post(API, data);
        setMessage("Student added successfully!");
      }

      resetForm();
      await fetchStudents();
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Unable to save student."
      );
    }
  };

  const handleEdit = (student) => {
    setFormData({
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      email: student.email || "",
      cgpa: student.cgpa ?? ""
    });

    setEditId(student._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/${id}`);
      if (editId === id) resetForm();
      setMessage("Student deleted successfully!");
      await fetchStudents();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete student.");
    }
  };

  return (
    <main className="container">
      <h1>Student Management System</h1>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="regNo"
            placeholder="Register Number"
            value={formData.regNo}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="number"
            name="cgpa"
            placeholder="CGPA"
            min="0"
            max="10"
            step="0.01"
            value={formData.cgpa}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editId ? "Update Student" : "Add Student"}
            </button>

            {editId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  resetForm();
                  setMessage("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Register No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6">No student records found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.regNo}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>{student.email || "-"}</td>
                    <td>{student.cgpa ?? "-"}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;
