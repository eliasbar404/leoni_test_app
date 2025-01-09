import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const FormateurEditGroupPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get group ID from the route parameter
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch group data
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, description } = response.data;

        setName(name || ""); // Populate name
        setDescription(description || ""); // Populate description
      } catch (error) {
        console.error("Failed to fetch group:", error);
        setErrorMessage("Failed to load group data. Please try again.");
      }
    };

    fetchGroup();
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/groups/${id}`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Le groupe a été mis à jour avec succès",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/formateur/dashboard/groupes");
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("Failed to update group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Modifier le groupe
        </h1>

        {errorMessage && (
          <div className="mb-4 text-red-600 font-medium">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom du groupe :
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Entrez le nom du groupe"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[120px] resize-none p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Entrez la description du groupe"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Mettre à jour le groupe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormateurEditGroupPage;
