// Import necessary libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the component
const CustomerDataTable = () => {
  // State variables
  const [customerData, setCustomerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('date'); // Default sorting by date
  const recordsPerPage = 20;

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/api/customerData')
      .then(response => setCustomerData(response.data))
      .catch(error => console.error('Error fetching customer data: ', error));
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(customerData.length / recordsPerPage);

  // Get the current records to display based on the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = customerData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Handle sorting
  const sortedRecords = currentRecords.sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortOption === 'time') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Filter the customerData based on search term
  const filteredData = sortedRecords.filter((customer) => {
    const nameLowerCase = customer.customer_name ? customer.customer_name.toLowerCase() : '';
    const locationLowerCase = customer.location ? customer.location.toLowerCase() : '';

    return nameLowerCase.includes(searchTerm.toLowerCase()) || locationLowerCase.includes(searchTerm.toLowerCase());
  });

  // Render the component
  return (
    <div>
      <h2>Customer Data Table</h2>
      <input
        type="text"
        placeholder="Search by Name or Location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <label>Sort By:</label>
      <select onChange={(e) => handleSortChange(e.target.value)}>
        <option value="date">Date</option>
        <option value="time">Time</option>
      </select>

      <table>
        {/* Table Header */}
        <thead>
          <tr>
            <th>SNo</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {filteredData.map(customer => (
            <tr key={customer.sno}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerDataTable;
