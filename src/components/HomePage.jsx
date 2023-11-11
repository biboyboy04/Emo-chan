// HomePage.js

import React from "react";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="navbar-header">
        <div className="logo">Emo-chan</div>
        <div className="hamburger">X</div>
      </div>
      <div className="search-and-add">
        <input type="text" placeholder="Search for books" />
        <button>Add Book</button>
      </div>
      {/* Display the imported or default books here */}
      <div className="book-list">
        {/* Example book item */}
        <div className="book">
          <img src="book-cover.jpg" alt="Book Title" />
          <div className="book-details">
            <h3>Book Title</h3>
            <p>Author: Author Name</p>
            <p>Genre: Fiction</p>
          </div>
        </div>
        <div className="book">
          <img src="book-cover.jpg" alt="Book Title" />
          <div className="book-details">
            <h3>Book Title</h3>
            <p>Author: Author Name</p>
            <p>Genre: Fiction</p>
          </div>
        </div>
        <div className="book">
          <img src="book-cover.jpg" alt="Book Title" />
          <div className="book-details">
            <h3>Book Title</h3>
            <p>Author: Author Name</p>
            <p>Genre: Fiction</p>
          </div>
        </div>
        {/* Repeat this structure for each book */}
      </div>
    </div>
  );
};

export default HomePage;
