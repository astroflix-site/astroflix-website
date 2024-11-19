import React, { useState, useEffect } from "react";
import CreatePlaylistForm from "../../components/form/CreatePlaylistForm "; // Import Create Playlist For


const AdminUpload = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState(""); // For saving the video title
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false); // State to control the playlist creation form

  // Fetch playlists based on the search term
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (searchTerm) {
        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch(`http://localhost:3000/api/search-playlists?title=${searchTerm}`, {
            credentials: 'include', // Ensure credentials (cookies/sessions) are sent
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error("Failed to fetch playlists.");
          }

          setPlaylists(data.playlists);
        } catch (err) {
          setError("Failed to fetch playlists.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPlaylists();
  }, [searchTerm]);

  // Handle file input
  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Handle video title change
  const handleTitleChange = (e) => {
    setVideoTitle(e.target.value);
  };

  // Handle form submission for uploading video
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlaylist || !videoFile || !videoTitle) {
        alert("Please select a playlist, upload a video, and provide a title.");
        return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("playlistId", selectedPlaylist);
    formData.append("title", videoTitle); // Include the video title

    try {
        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData,
            credentials: 'include', // Include credentials (cookies/sessions)
        });

        if (!response.ok) {
            throw new Error("Failed to upload video.");
        }

        const result = await response.json();
        alert(result.message);
        setVideoFile(null);
        setVideoTitle("");
    } catch (error) {
        alert(`Failed to upload video: ${error.message}`);
    }
};


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-6">Upload Video</h1>

      {/* Playlist Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Playlist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Playlist Dropdown */}
      <div className="mb-6">
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Playlist</option>
          {isLoading ? (
            <option>Loading playlists...</option>
          ) : error ? (
            <option>{error}</option>
          ) : (
            playlists.map((playlist) => (
              <option key={playlist._id} value={playlist._id}>
                {playlist.title}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Video Title Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter Video Title"
          value={videoTitle}
          onChange={handleTitleChange}
          className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Video Upload Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-6">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-300"
        >
          Upload Video
        </button>
      </form>

      {/* Button to open the Create Playlist form */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsCreatingPlaylist(true)}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Create New Playlist
        </button>
      </div>

      {/* Create Playlist Form Modal */}
      {isCreatingPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CreatePlaylistForm onClose={() => setIsCreatingPlaylist(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
