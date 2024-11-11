"use client";
import { useEffect, useState } from "react";

interface DataItem {
  _id: string;
  name: string;
  register: string;
  age: number;
  degree: string;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    register: "",
    age: "",
    degree: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/data/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setData(data.filter((item) => item._id !== id));
    } catch (error: any) {
      console.error("Error deleting data:", error);
      setError(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newItem = await response.json();
      setData([...data, newItem]);
      setFormData({ name: "", register: "", age: "", degree: "" });
    } catch (error: any) {
      console.error("Error creating data:", error);
      setError(error.message);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col md:flex-row bg-black">
      <div className="w-full md:w-1/2 h-full flex justify-center items-center p-4">
        <form
          className="flex flex-col justify-center items-center w-full md:w-3/4"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="border px-4 w-full h-8 m-4 rounded"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          <label className="sr-only" htmlFor="register">
            Register No.
          </label>
          <input
            id="register"
            name="register"
            className="border px-4 w-full h-8 m-4 rounded"
            type="text"
            placeholder="Enter your register no."
            value={formData.register}
            onChange={handleChange}
          />
          <label className="sr-only" htmlFor="age">
            Age
          </label>
          <input
            id="age"
            name="age"
            className="border px-4 w-full h-8 m-4 rounded"
            type="number"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
          />
          <label className="sr-only" htmlFor="degree">
            Degree
          </label>
          <input
            id="degree"
            name="degree"
            className="border px-4 w-full h-8 m-4 rounded"
            type="text"
            placeholder="Enter your degree name"
            value={formData.degree}
            onChange={handleChange}
          />
          <button
            className="bg-blue-500 text-white rounded m-4 w-full h-8"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-4">
        {error && <p className="text-red-500">{error}</p>}
        {data.map((item) => (
          <div key={item._id} className="border rounded m-4 p-2">
            <div className="flex flex-col justify-center items-center h-full">
              <p>{item.name}</p>
              <p>{item.register}</p>
              <p>{item.age}</p>
              <p>{item.degree}</p>
              <button
                className="border w-1/2 md:w-1/4 bg-white rounded text-black"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
