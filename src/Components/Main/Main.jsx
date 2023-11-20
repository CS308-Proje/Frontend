import React from 'react'
import videoBG from '../Assets/Soundwave-Loop.mp4'


const Main = () => {
  return (
    <div className='Main'>

      <div className="overlay"></div>
      <video src={videoBG} autoPlay loop muted></video>
      <div className='mainpagecontent'>
      <h1 className="cool-text">
          Welcome to the Cutting-Edge Song Recommendation System
        </h1>
        <h2 className="small-text">Powered by Machine Learning</h2>
        <div className="additional-content">
          <h2>Your Musical Journey, Our Priority</h2>
          <p>
            Our mission is to elevate your musical experience. With cutting-edge machine learning technology,
            we deliver personalized song recommendations for every moment. Explore new horizons
            effortlessly as we curate the perfect soundtrack for your life.
            
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main
