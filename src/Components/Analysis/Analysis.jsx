import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Analysis.css";
import Navbar2 from "../Navbar2/Navbar2";
import ReactSelect from "react-select";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Chart } from "chart.js";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  DoughnutController,
  ArcElement, // Import the BarController
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  DoughnutController,
  ArcElement
);

const Analysis = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [submissionType, setSubmissionType] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [imageID, setimageID] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [artistArray, setArtistArray] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartData1, setChartData1] = useState({
    labels: [],
    datasets: [
      {
        label: 'Average Ratings per Day',
        data: [],
        backgroundColor: '#8bbe52',
        borderColor: '#8bbe52',
        borderWidth: 1,
      },
    ],
  });
  
  const chartRef = useRef(null);
  const [chartContainerClass, setChartContainerClass] =
    useState("chart-container");
  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const determineChartClass = (submissionType) => {
    if (submissionType === "Song Count Analysis") {
      return "chart-container doughnut-chart";
    }
    return "chart-container";
  };
  

  // Function to toggle dropdown state
  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const getDateValues = () => {
    const startDate = document.getElementById("start-date-input").value;
    const endDate = document.getElementById("end-date-input").value;
    return { startDate, endDate };
  };

  const handleSubmit = async (type, startDate, endDate) => {
    let queryString = `type=${type}`;
    if (startDate) queryString += `&start=${startDate}`;
    if (endDate) queryString += `&end=${endDate}`;
    console.log("Query String:", queryString); // Log the query string
    try {
      const response = await fetch(
        `http://localhost:5001/song-analysis?${queryString}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const responseData = await response.json();
      if (responseData && responseData.success) {
        setError("");
        setBase64Image(responseData.base64Image);
        setimageID(responseData.data);
        setSubmitted(true);
      } else {
        console.error("No image data received");
        setError(responseData.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmitSong = (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    handleSubmit("song", startDate, endDate);
  };

  const handleSubmitAlbum = (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    handleSubmit("album", startDate, endDate);
  };

  const handleSubmitArtist = (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    handleSubmit("artist", startDate, endDate);
  };

  const handleSubmitArtistAverage = async (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    const requestBody = { artists: artistArray };

    let queryString = `http://localhost:5001/artist-average-analysis`;
    // Check if startDate and endDate are provided and append them to the queryString
    if (startDate || endDate) {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("start", startDate);
      if (endDate) queryParams.append("end", endDate);
      queryString += `?${queryParams.toString()}`;
    }

    console.log("Request URL:", queryString);

    try {
      const response = await fetch(`${queryString}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // If you're using an authorization token, include it here
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();

      if (responseData && responseData.success) {
        setError("");
        console.log(responseData.data);
        setChartData(responseData.data);
        setSubmitted(true);
      } else {
        console.error(responseData.error);
        setError(responseData.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const shareOnTwitter = () => {
    let text = "Look at my favorites"; // Default text

    switch(submissionType) {
        case "Your Favorite Songs":
            text = "Look at my Favorite Songs";
            break;
        case "Your Favorite Albums":
            text = "Look at my Favorite Albums";
            break;
        case "Your Favorite Artists":
            text = "Look at my Favorite Artists";
            break;
    }

    const imageUrl = `http://localhost:5001/images/${imageID}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`;
    window.open(twitterUrl, "_blank");
};

  const handleSubmitArtistSongsCount = async (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    const requestBody = { artists: artistArray };

    let queryString = `http://localhost:5001/artist-songs-count-analysis`;
    // Check if startDate and endDate are provided and append them to the queryString
    if (startDate || endDate) {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("start", startDate);
      if (endDate) queryParams.append("end", endDate);
      queryString += `?${queryParams.toString()}`;
    }

    console.log("Request URL:", queryString);

    try {
      const response = await fetch(queryString, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Uncomment and replace if needed
        },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();
      if (responseData && responseData.success) {
        setError("");
        setChartData(responseData.data);
        setSubmitted(true);
      } else {
        console.error("No data received");
        setError(responseData.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {

    setChartContainerClass(determineChartClass(submissionType));
    
    if (submitted && chartData.length > 0 && chartRef.current) {
      
      // Define an array of colors for the chart elements
      const chartColors = [
        "#8bbe52",
        "#4bc0c0",
        "#ffcd56",
        "#ff6384",
        "#36a2eb",
      ];

      // Determine chart type based on submissionType
      const chartType =
        submissionType === "Song Count Analysis" ? "doughnut" : "bar";
      const label =
        submissionType === "Song Count Analysis"
          ? "Song Count"
          : "Average Score";

      if (submissionType === "Song Count Analysis") {
        setChartContainerClass("chart-container doughnut-chart");
      } else {
        setChartContainerClass("chart-container");
      }

      // Map through the artists and assign a color from the array above
      // For a doughnut chart, we usually don't need one color per artist, but one per data point
      const backgroundColors = chartData.map(
        (_, index) => chartColors[index % chartColors.length]
      );

      const chartInstance = new Chart(chartRef.current, {
        type: chartType,
        data: {
          labels: artistArray,
          datasets: [
            {
              label: label,
              data: chartData,
              backgroundColor: backgroundColors,
              // Additional properties for doughnut chart like borderWidth, hoverBackgroundColor, etc., can be added here
            },
          ],
        },
        options: {
          // Additional options can be configured here
          scales:
            chartType === "bar"
              ? {
                  y: {
                    beginAtZero: true,
                  },
                }
              : {},
        },
      });

      // Clean up the chart instance on unmount or when new data is submitted
      return () => chartInstance.destroy();
    }
  }, [submitted, chartData, artistArray, submissionType]);

  

  const fetchAverageRatingsLastMonth = async () => {
    try {
      const response = await fetch("http://localhost:5001/average-rating", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        const ratingsArray = data.data;
        setChartData1({
          labels: ratingsArray.map((item) => item.date),
          datasets: [
            {
              label: "Average Ratings per Day of Past Month",
              data: ratingsArray.map((item) => item.average),
              fill: false,
              borderColor: "#8bbe52",
              backgroundColor: "#8bbe52",
            },
          ],
        });
  
        
        setSubmitted(true);
      } else {
        setError("Failed to retrieve data");
        setSubmitted(false);
      }
    } catch (error) {
      console.error("Error fetching average ratings data:", error);
      setError(error.message);
      setSubmitted(false);
    }
  };
  

  // Adjust the styles of the submission container based on the dropdown state
  const submissionContainerStyle = {
    marginTop: isDropdownOpen ? "100px" : "20px",
    transition: "top 0.3s ease", // Ensure the transition is smooth
    top: "50px",
  };

  const selectOptions = [
    { value: "Your Favorite Songs", label: "Your Favorite Songs" },
    { value: "Your Favorite Albums", label: "Your Favorite Albums" },
    { value: "Your Favorite Artists", label: "Your Favorite Artists" },
    { value: "Artist Average Analysis", label: "Artist Average Analysis" },
    { value: "Song Count Analysis", label: "Song Count Analysis" },
    { value: "Average Ratings of the Last Month", label: "Average Ratings of the Last Month" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "10px",
      backgroundColor: "black",
      borderColor: "white",
      color: "white",
      boxShadow: "none", // Removes the default box-shadow
      "&:hover": {
        borderColor: "white", // Border color when hovering
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "1px",
      backgroundColor: "black",
      borderColor: "white",
      color: "white",
      overflow: "hidden", // Ensures the rounded corners are respected
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "grey" : "white", // Background color when option is focused/hovered
      color: state.isFocused ? "black" : "black", // Text color when option is focused/hovered
      borderRadius: "1px", // Border radius for each option
      "&:active": {
        backgroundColor: "#8bbe52", // Background color when option is selected
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div className="Dashboard1">
      <Navbar2
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSearch={setSearch}
      />
      <Sidebar isOpen={sidebarOpen} />

      <div className="dropdown-container2">
        <ReactSelect
          styles={customStyles}
          options={selectOptions}
          value={selectOptions.find(
            (option) => option.value === submissionType
          )}
          onChange={(selectedOption) => {
            
            setSubmissionType(selectedOption.value);
            setChartContainerClass(determineChartClass(selectedOption.value));
            setSubmitted(false); // Reset the submitted state
            setChartData([]);
            setArtistArray([]);
            // Additional logic if required
            setError("");
            if (selectedOption.value === "Average Ratings of the Last Month") {
              fetchAverageRatingsLastMonth();
            }
          }}
          onMenuOpen={handleDropdownOpen}
          onMenuClose={handleDropdownClose}
          placeholder="Select Analysis"
          theme={(theme) => ({
            ...theme,
            borderRadius: 10,
            colors: {
              ...theme.colors,
              primary25: "grey", // color when option is focused
              primary: "black", // border color when focused
            },
          })}
        />
      </div>

      {submissionType === null && !submitted && (
        <div className="submission-container" style={submissionContainerStyle}>
          <div className="text">Welcome to Analysis</div>
          <div className="underline"></div>

          <p className="recommendation-message">
            Welcome to our Analysis Service! Choose an option from the dropdown
            above to get started!
          </p>
          <div className="underline"></div>
          <p className="instruction-text">
            Select your way of adding songs with button above:
          </p>
        </div>
      )}

      {submissionType === "Your Favorite Songs" && !submitted && (
        <div className="submission-container" style={submissionContainerStyle}>
          <div className="text">Top 10 Favorite Songs</div>
          <div className="underline"></div>

          <div className="date-details-form">
            <label htmlFor="start-date-input" className="date-label">
              Enter start date (Optional):
            </label>
            <input
              id="start-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />

            <label htmlFor="end-date-input" className="date-label">
              Enter end date (Optional) :
            </label>
            <input
              id="end-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />
          </div>
          <div className="button-container" style={submissionContainerStyle}>
            <form onSubmit={handleSubmitSong}>
              {/* ... [form content] */}
              <button id="submit-button" className="submit-button">
                Submit
              </button>
            </form>
          </div>
          {error && !submitted && <div className="error">{error}</div>}
        </div>
      )}

      {submissionType === "Your Favorite Albums" && !submitted && (
        <div className="submission-container" style={submissionContainerStyle}>
          <div className="text">Top 10 Favorite Albums</div>
          <div className="underline"></div>

          <div className="date-details-form">
            <label htmlFor="start-date-input" className="date-label">
              Enter start date (Optional):
            </label>
            <input
              id="start-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />

            <label htmlFor="end-date-input" className="date-label">
              Enter end date (Optional) :
            </label>
            <input
              id="end-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />
          </div>
          <div className="button-container" style={submissionContainerStyle}>
            <form onSubmit={handleSubmitAlbum}>
              {/* ... [form content] */}
              <button id="submit-button" className="submit-button">
                Submit
              </button>
            </form>
          </div>
          {error && !submitted && <div className="error">{error}</div>}
        </div>
      )}

      {submissionType === "Your Favorite Artists" && !submitted && (
        <div className="submission-container" style={submissionContainerStyle}>
          <div className="text">Top 10 Favorite Artists</div>
          <div className="underline"></div>

          <div className="date-details-form">
            <label htmlFor="start-date-input" className="date-label">
              Enter start date (Optional):
            </label>
            <input
              id="start-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />

            <label htmlFor="end-date-input" className="date-label">
              Enter end date (Optional) :
            </label>
            <input
              id="end-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />
          </div>
          <div className="button-container" style={submissionContainerStyle}>
            <form onSubmit={handleSubmitArtist}>
              {/* ... [form content] */}
              <button id="submit-button" className="submit-button">
                Submit
              </button>
            </form>
          </div>
          {error && !submitted && <div className="error">{error}</div>}
        </div>
      )}

      {submissionType === "Artist Average Analysis" && !submitted && (
        <div className="submission-container" style={submissionContainerStyle}>
          <div className="date-details-form">
            <div className="text">Average Artist Rating Analysis</div>
            <div className="underline"></div>
            <label htmlFor="start-date-input" className="date-label">
              Enter start date (Optional):
            </label>
            <input
              id="start-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />

            <label htmlFor="end-date-input" className="date-label">
              Enter end date (Optional) :
            </label>
            <input
              id="end-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />
          </div>
          <div className="button-container" style={submissionContainerStyle}>
            <input
              type="text"
              placeholder="Enter artist names separated by commas"
              className="track-input"
              onChange={(e) => setArtistArray(e.target.value.split(","))}
            />
          </div>

          <div className="button-container" style={submissionContainerStyle}>
            <form onSubmit={handleSubmitArtistAverage}>
              <button id="submit-button" className="submit-button">
                Submit
              </button>
            </form>
          </div>
          {error && !submitted && <div className="error">{error}</div>}
        </div>
      )}

      {submissionType === "Song Count Analysis" && !submitted && (
        <div className="submission-container" style={submissionContainerStyle}>
          <div className="text">Song Count Analysis</div>
          <div className="underline"></div>
          <div className="date-details-form">
            <label htmlFor="start-date-input" className="date-label">
              Enter start date (Optional):
            </label>
            <input
              id="start-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />
            <label htmlFor="end-date-input" className="date-label">
              Enter end date (Optional):
            </label>
            <input
              id="end-date-input"
              type="date"
              max={today}
              placeholder="YYYY-MM-DD"
              className="date-input"
            />
          </div>
          <div className="button-container" style={submissionContainerStyle}>
            <input
              type="text"
              placeholder="Enter artist names separated by commas"
              className="track-input"
              onChange={(e) => setArtistArray(e.target.value.split(","))}
            />
          </div>

          <div className="button-container" style={submissionContainerStyle}>
            <form onSubmit={handleSubmitArtistSongsCount}>
              <button id="submit-button" className="submit-button">
                Submit
              </button>
            </form>
          </div>
          {error && !submitted && <div className="error">{error}</div>}
        </div>
      )}

      {submitted && chartData.length > 0 && (submissionType === "Artist Average Analysis" || submissionType === "Song Count Analysis") && (
        <div className={chartContainerClass}>
          <canvas ref={chartRef}></canvas>
        </div>
      )}

      {submissionType === "Your Favorite Songs" && submitted && imageID && (
        <div className="favorite-songs-section">
          <div className="share-on-twitter" onClick={shareOnTwitter}>
            <TwitterIcon style={{ fontSize: 40 }} />
            <p>Share it on Twitter</p>
          </div>
          <div className="image-container">
            <img
              src={base64Image}
              alt="Favorite Songs Analysis"
              className="analysis-image"
            />
          </div>
        </div>
      )}

      {submissionType === "Your Favorite Albums" && submitted && imageID && (
        <div className="favorite-songs-section">
          <div className="share-on-twitter" onClick={shareOnTwitter}>
            <TwitterIcon style={{ fontSize: 40, cursor: "pointer" }} />
            <p>Share it on Twitter</p>
          </div>
          <div className="image-container">
            <img
              src={base64Image}
              alt="Favorite Albums Analysis"
              className="analysis-image"
            />
          </div>
        </div>
      )}

      {submissionType === "Your Favorite Artists" && submitted && imageID && (
        <div className="favorite-songs-section">
          <div className="share-on-twitter" onClick={shareOnTwitter}>
            <TwitterIcon style={{ fontSize: 40, cursor: "pointer" }} />
            <p>Share it on Twitter</p>
          </div>
          <div className="image-container">
            <img
              src={base64Image}
              alt="Favorite Artits Analysis"
              className="analysis-image"
            />
          </div>
        </div>
      )}

{submissionType === "Average Ratings of the Last Month" && submitted && chartData1.datasets.length > 0 ? (
  <div className={chartContainerClass}>
    <Line data={chartData1} />
  </div>
) : submitted && error ? (
  <div className="error-message">{error}</div>
) : !submitted || (submitted && chartData1.datasets.length === 0) ? (
  <div className="placeholder-message">No data to display</div>
) : null}

    </div>
  );
};

export default Analysis;
