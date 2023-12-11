import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Analysis.css';
import Navbar2 from '../Navbar2/Navbar2';
import ReactSelect from "react-select"; 
import { Chart } from 'chart.js';
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
  ArcElement // Import the BarController
} from 'chart.js';

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
  const [submissionType, setSubmissionType] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [artistArray, setArtistArray] = useState([]);
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const [chartContainerClass, setChartContainerClass] = useState("chart-container");


  // Function to toggle dropdown state
  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const getDateValues = () => {
    const startDate = document.getElementById('start-date-input').value;
    const endDate = document.getElementById('end-date-input').value;
    return { startDate, endDate };
  };

  const handleSubmit = async (type, startDate, endDate) => {
    let queryString = `type=${type}`;
    if (startDate) queryString += `&start=${startDate}`;
    if (endDate) queryString += `&end=${endDate}`;
    console.log("Query String:", queryString); // Log the query string
    try {
      const response = await fetch(`http://localhost:5001/song-analysis?${queryString}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      const responseData = await response.json();
      if (responseData && responseData.success) {
        setBase64Image(responseData.data);
        setSubmitted(true);
      } else {
        console.error('No image data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmitSong = (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    handleSubmit('song', startDate, endDate);
  };

  const handleSubmitAlbum = (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    handleSubmit('album', startDate, endDate);
  };

  const handleSubmitArtist = (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    handleSubmit('artist', startDate, endDate);
  };


  const handleSubmitArtistAverage = async (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    const requestBody = { artists: artistArray };

    let queryString = `http://localhost:5001/artist-average-analysis`;
  // Check if startDate and endDate are provided and append them to the queryString
  if (startDate || endDate) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start', startDate);
    if (endDate) queryParams.append('end', endDate);
    queryString += `?${queryParams.toString()}`;
  }

  console.log("Request URL:", queryString);

    try {
      const response = await fetch(`http://localhost:5001/artist-average-analysis`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // If you're using an authorization token, include it here
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify(requestBody)
      });
      const responseData = await response.json();
      if (responseData && responseData.success) {
        setChartData(responseData.data);
        setSubmitted(true);
      } else {
        console.error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  
  
  const handleSubmitArtistSongsCount = async (event) => {
    event.preventDefault();
    const { startDate, endDate } = getDateValues();
    const requestBody = { artists: artistArray };
  
    let queryString = `http://localhost:5001/artist-songs-count-analysis`;
    // Check if startDate and endDate are provided and append them to the queryString
    if (startDate || endDate) {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start', startDate);
      if (endDate) queryParams.append('end', endDate);
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
        body: JSON.stringify(requestBody)
      });
      const responseData = await response.json();
      if (responseData && responseData.success) {
        setChartData(responseData.data);
        setSubmitted(true);
      } else {
        console.error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    if (submitted && chartData.length > 0 && chartRef.current) {
      // Define an array of colors for the chart elements
      const chartColors = ['#8bbe52', '#4bc0c0', '#ffcd56', '#ff6384', '#36a2eb'];
      
      // Determine chart type based on submissionType
      const chartType = submissionType === "Song Count Analysis" ? 'doughnut' : 'bar';
      const label = submissionType === "Song Count Analysis" ? 'Song Count' : 'Average Score';

      if (submissionType === "Song Count Analysis") {
        setChartContainerClass("chart-container doughnut-chart");
      } else {
        setChartContainerClass("chart-container");
      }
  
      // Map through the artists and assign a color from the array above
      // For a doughnut chart, we usually don't need one color per artist, but one per data point
      const backgroundColors = chartData.map((_, index) => chartColors[index % chartColors.length]);
  
      const chartInstance = new Chart(chartRef.current, {
        type: chartType,
        data: {
          labels: artistArray,
          datasets: [{
            label: label,
            data: chartData,
            backgroundColor: backgroundColors,
            // Additional properties for doughnut chart like borderWidth, hoverBackgroundColor, etc., can be added here
          }]
        },
        options: {
          // Additional options can be configured here
          scales: chartType === 'bar' ? {
            y: {
              beginAtZero: true
            }
          } : {}
        }
      });
    
      // Clean up the chart instance on unmount or when new data is submitted
      return () => chartInstance.destroy();
    }
  }, [submitted, chartData, artistArray, submissionType]);
  


  // Adjust the styles of the submission container based on the dropdown state
  const submissionContainerStyle = {
    marginTop: isDropdownOpen ? '100px' : '20px',
    transition: 'top 0.3s ease', // Ensure the transition is smooth
    top: '90px',
  };
  

  const selectOptions = [
    { value: 'Your Favorite Songs', label: 'Your Favorite Songs' },
    { value: 'Your Favorite Albums', label: 'Your Favorite Albums' },
    { value: 'Your Favorite Artists', label: 'Your Favorite Artists' },
    { value: 'Artist Average Analysis', label: 'Artist Average Analysis' },
    { value: 'Song Count Analysis', label: 'Song Count Analysis' }
  ];  

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '10px',
      backgroundColor: 'black',
      borderColor: 'white',
      color: 'white',
      boxShadow: 'none', // Removes the default box-shadow
      '&:hover': {
        borderColor: 'white', // Border color when hovering
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '1px',
      backgroundColor: 'black',
      borderColor: 'white',
      color: 'white',
      overflow: 'hidden', // Ensures the rounded corners are respected
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'grey' : 'white', // Background color when option is focused/hovered
      color: state.isFocused ? 'black' : 'black', // Text color when option is focused/hovered
      borderRadius: '1px', // Border radius for each option
      '&:active': {
        backgroundColor: '#8bbe52', // Background color when option is selected
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
  };


  return (
    <div className="Dashboard1">
      <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>
      <Sidebar isOpen={sidebarOpen} />

      
        <div className="dropdown-container2">
          <ReactSelect
            styles={customStyles}
            options={selectOptions}
            value={selectOptions.find(option => option.value === submissionType)}
            onChange={(selectedOption) => {
              setSubmissionType(selectedOption.value);
              setSubmitted(false); // Reset the submitted state
              // Additional logic if required
            }}
            onMenuOpen={handleDropdownOpen}
            onMenuClose={handleDropdownClose}
            placeholder="Select Analysis"
            theme={(theme) => ({
              ...theme,
              borderRadius: 10,
              colors: {
                ...theme.colors,
                primary25: 'grey', // color when option is focused
                primary: 'black', // border color when focused
              }
            })}
          />
        </div>

        {submissionType === null && !submitted  && (
          <div className="submission-container" style={submissionContainerStyle}>
            <div className="text">Welcome to Analysis</div>
            <div className="underline"></div>

            <p className="recommendation-message">
              Welcome to our Analysis Service!
              Choose an option from the dropdown above to get started!
            </p>
            <div className="underline"></div>
            <p className="instruction-text">Select your way of adding songs with button above:</p>
          </div>
        )}

{submissionType === "Your Favorite Songs"  && !submitted &&  (
  <div className="submission-container" style={submissionContainerStyle}>
    <div className="text">Top 10 Favorite Songs</div>
    <div className="underline"></div>

    <div className="date-details-form">
      <label htmlFor="start-date-input" className="date-label">Enter start date (Optional):</label>
      <input
        id="start-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <label htmlFor="end-date-input" className="date-label">Enter end date (Optional) :</label>
      <input
        id="end-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <form onSubmit={handleSubmitSong}>
        {/* ... [form content] */}
        <button type="submit" className="submit-button">Submit</button>
      </form>

     

    </div>
  </div>
)}





{submissionType === "Your Favorite Albums"  && !submitted &&  (
  <div className="submission-container" style={submissionContainerStyle}>
    <div className="text">Top 10 Favorite Albums</div>
    <div className="underline"></div>

    <div className="date-details-form">
      <label htmlFor="start-date-input" className="date-label">Enter start date (Optional):</label>
      <input
        id="start-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <label htmlFor="end-date-input" className="date-label">Enter end date (Optional) :</label>
      <input
        id="end-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <form onSubmit={handleSubmitAlbum}>
        {/* ... [form content] */}
        <button type="submit" className="submit-button">Submit</button>
      </form>

     

    </div>
  </div>
)}




{submissionType === "Your Favorite Artists"  && !submitted &&  (
  <div className="submission-container" style={submissionContainerStyle}>
    <div className="text">Top 10 Favorite Artists</div>
    <div className="underline"></div>

    <div className="date-details-form">
      <label htmlFor="start-date-input" className="date-label">Enter start date (Optional):</label>
      <input
        id="start-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <label htmlFor="end-date-input" className="date-label">Enter end date (Optional) :</label>
      <input
        id="end-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <form onSubmit={handleSubmitArtist}>
        {/* ... [form content] */}
        <button type="submit" className="submit-button">Submit</button>
      </form>

     

    </div>
  </div>
)}

{submissionType === "Artist Average Analysis" && !submitted && (
    <div className="submission-container" style={submissionContainerStyle}>
      <div className="date-details-form">
      <div className="text">Average Artist Rarting Analysis</div>
    <div className="underline"></div>
      <label htmlFor="start-date-input" className="date-label">Enter start date (Optional):</label>
      <input
        id="start-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />

      <label htmlFor="end-date-input" className="date-label">Enter end date (Optional) :</label>
      <input
        id="end-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />
      </div>
      <input
  type="text"
  placeholder="Enter artist names separated by commas"
  className="track-input"
  onChange={(e) => setArtistArray(e.target.value.split(','))}
/>


      

      
      <form onSubmit={handleSubmitArtistAverage}>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  )}


{submissionType === "Song Count Analysis" && !submitted && (
  <div className="submission-container" style={submissionContainerStyle}>
    <div className="text">Song Count Analysis</div>
    <div className="underline"></div>
    <div className="date-details-form">
      <label htmlFor="start-date-input" className="date-label">Enter start date (Optional):</label>
      <input
        id="start-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />
      <label htmlFor="end-date-input" className="date-label">Enter end date (Optional):</label>
      <input
        id="end-date-input"
        type="date"
        placeholder="YYYY-MM-DD"
        className="date-input"
      />
    </div>
    <input
      type="text"
      placeholder="Enter artist names separated by commas"
      className="track-input"
      onChange={(e) => setArtistArray(e.target.value.split(','))}
    />
    <form onSubmit={handleSubmitArtistSongsCount}>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  </div>
)}

{submitted && chartData.length > 0 && (
  <div className={chartContainerClass}>
  <canvas ref={chartRef}></canvas>
</div>

)}

{submitted && base64Image && (
        <div className="deneme">
          <img src={base64Image} alt="Analysis Result" className="analysis-image" />
        </div>
      )}



    </div>
    
  );
  

  
};


export default Analysis;