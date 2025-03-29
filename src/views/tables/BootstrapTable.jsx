import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BootstrapTable = () => {
  const [packages, setPackages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [contentModalTitle, setContentModalTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('travelPackages')) || [];
    setPackages(storedData);
  }, []);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowImageModal(true);
  };

  const handleItineraryClick = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowItineraryModal(true);
  };

  const handleEditClick = (pkg) => {
    setCurrentPackage(pkg);
    setShowEditModal(true);
  };

  const handleContentClick = (content, title) => {
    setSelectedContent(content);
    setContentModalTitle(title);
    setShowContentModal(true);
  };

  const handleFlightSelection = (packageIndex) => {
    const pkg = packages[packageIndex];
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];

    const filteredFlights = storedFlights.filter((flight) => {
      if (!flight.active) return false;

      return pkg.dateRanges.some((dateRange) => {
        const packageStart = new Date(dateRange.startDate);
        const packageEnd = new Date(dateRange.endDate);

        return flight.departureDates.some((flightDate) => {
          const date = new Date(flightDate);
          return date >= packageStart && date <= packageEnd;
        });
      });
    });

    setAvailableFlights(filteredFlights);
    setSelectedPackageIndex(packageIndex);
    setSelectedFlights(packages[packageIndex].selectedFlights || {});
    setShowFlightModal(true);
  };

  const handleSaveFlights = () => {
    const updatedPackages = [...packages];
    updatedPackages[selectedPackageIndex] = {
      ...updatedPackages[selectedPackageIndex],
      selectedFlights
    };
    setPackages(updatedPackages);
    localStorage.setItem('travelPackages', JSON.stringify(updatedPackages));
    setShowFlightModal(false);
  };

  // Function to toggle active state
  const toggleActive = (index) => {
    const updatedData = [...packages];
    updatedData[index].isActive = !updatedData[index].isActive;
    setPackages(updatedData);
    localStorage.setItem('travelPackages', JSON.stringify(updatedData)); // Save to localStorage
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPackages = packages.map((pkg) => (pkg.title === currentPackage.title ? currentPackage : pkg));
    setPackages(updatedPackages);
    localStorage.setItem('travelPackages', JSON.stringify(updatedPackages));
    alert('Package updated successfully!!!');
    setShowEditModal(false);
  };

  // Filter packages based on active status
  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'active') return pkg.isActive;
    if (filter === 'inactive') return !pkg.isActive;

    const searchLower = searchQuery.toLowerCase();

    return searchQuery === '' || pkg.title.toLowerCase().includes(searchLower);
  });

  const newPackageClickHandler = () => {
    navigate('/forms/form-basic');
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title as="h5">All Package Details</Card.Title>
                <div className="d-flex justify-content-between ">
                  <Col md={4}>
                    <Form.Group className="mb-0">
                      <Form.Control
                        type="text"
                        placeholder="Search packages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Button onClick={newPackageClickHandler}>AddNewPackage</Button>
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-filter">
                      <FaFilter className="me-2" />
                      {filter === 'all' ? 'All Packages' : filter === 'active' ? 'Active Packages' : 'Inactive Packages'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item active={filter === 'all'} onClick={() => setFilter('all')}>
                        All Packages
                      </Dropdown.Item>
                      <Dropdown.Item active={filter === 'active'} onClick={() => setFilter('active')}>
                        Active Packages
                      </Dropdown.Item>
                      <Dropdown.Item active={filter === 'inactive'} onClick={() => setFilter('inactive')}>
                        Inactive Packages
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Region</th>
                    <th>Package Type</th>
                    <th>Duration</th>
                    <th>Destinations</th>
                    <th>Date</th>
                    <th>Itinerary</th>
                    <th>Inclusions</th>
                    <th>Exclusions</th>
                    <th>Cancellation Policy</th>
                    <th>Active</th>
                    <th>Images</th>
                    <th>Selected Flights</th>
                    <th>Manage Flights</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{pkg.title}</td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleContentClick(pkg.description || 'No description available', 'Package Description')}
                        >
                          View Description
                        </Button>
                      </td>
                      <td>₹{pkg.price}</td>
                      <td>{pkg.region || '-'}</td>
                      <td>{pkg.packageType}</td>
                      <td>{pkg.totalDays-1}N |{pkg.totalDays}D</td>
                      <td>{pkg.selectedDestinations?.join(', ')}</td>
                      <td>
                        {pkg.dateRanges?.map((range, i) => (
                          <div key={i}>
                            {new Date(range.startDate).toLocaleDateString('en-GB')} to {new Date(range.endDate).toLocaleDateString('en-GB')}
                          </div>
                        ))}
                      </td>
                      <td>
                        <Button variant="info" onClick={() => handleItineraryClick(pkg.itinerary)}>
                          View Itinerary
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleContentClick(pkg.inclusions || 'No inclusions specified', 'Package Inclusions')}
                        >
                          View Inclusions
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleContentClick(pkg.exclusions || 'No exclusions specified', 'Package Exclusions')}
                        >
                          View Exclusions
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleContentClick(pkg.cancellationPolicy || 'No cancellation policy specified', 'Cancellation Policy')
                          }
                        >
                          View Policy
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant={pkg.isActive ? 'success' : 'danger'}
                          onClick={() => toggleActive(index)}
                          style={{
                            backgroundColor: pkg.isActive ? '#2ed8b6' : '#ff5370',
                            borderColor: pkg.isActive ? '#2ed8b6' : '#ff5370'
                          }}
                        >
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </Button>
                      </td>
                      <td>
                        {Array.isArray(pkg.image) ? (
                          pkg.image.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleImageClick(img)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleImageClick(img);
                                }
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer'
                              }}
                            >
                              <img src={img} alt={`Package ${idx}`} width="50" height="50" style={{ margin: '5px' }} />
                            </button>
                          ))
                        ) : (
                          <p>No images available</p>
                        )}
                      </td>
                      <td>
                        {pkg.selectedFlights &&
                          Object.entries(pkg.selectedFlights).map(([rangeIndex, flightIds]) => {
                            const dateRange = pkg.dateRanges[rangeIndex];
                            const flights = flightIds
                              .map((id) => {
                                const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
                                return storedFlights.find((f) => f.flightId === id);
                              })
                              .filter(Boolean);

                            return (
                              <div key={rangeIndex} className="mb-2">
                                <small className="d-block text-muted">
                                  {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}:
                                </small>
                                {flights.map((flight, i) => (
                                  <div key={i} className="small">
                                    {flight.airlineName} - {flight.flightNumber} (₹{flight.flightPrice})
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                      </td>
                      <td>
                        <Button variant="info" onClick={() => handleFlightSelection(index)}>
                          {pkg.selectedFlights && Object.keys(pkg.selectedFlights).length > 0 ? 'Update Flights' : 'Add Flights'}
                        </Button>
                      </td>
                      <td>
                        <Button variant="primary" onClick={() => handleEditClick(pkg)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Editing Package */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPackage && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="formPackageTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPackage.title}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, title: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPackageDescription">
                <Form.Label>Description</Form.Label>
                <ReactQuill
                  value={currentPackage.description}
                  onChange={(content) => setCurrentPackage({ ...currentPackage, description: content })}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ color: [] }, { background: [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formPackagePrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={currentPackage.price}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, price: parseFloat(e.target.value) })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPackageType">
                <Form.Label>Package Type</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPackage.packageType}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, packageType: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPackageDuration">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="number"
                  value={currentPackage.totalDays}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, totalDays: parseInt(e.target.value, 10) })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formRegion">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPackage.region}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, region: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="formDestinations">
                <Form.Label>Destinations</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPackage.selectedDestinations?.join(', ')}
                  onChange={(e) =>
                    setCurrentPackage({
                      ...currentPackage,
                      selectedDestinations: e.target.value.split(',').map((dest) => dest.trim())
                    })
                  }
                  placeholder="Destinations separated by commas"
                />
              </Form.Group>
              <Form.Group controlId="formDateRanges">
                <Form.Label>Date Ranges</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPackage.dateRanges
                    ?.map(
                      (date) =>
                        `${new Date(date.startDate).toLocaleDateString('en-GB')} to ${new Date(date.endDate).toLocaleDateString('en-GB')}`
                    )
                    .join(', ')}
                  onChange={(e) => {
                    const dates = e.target.value.split(',').map((d) => d.split('to').map((part) => part.trim()));
                    const formattedDates = dates.map((dateRange) => {
                      return {
                        startDate: new Date(dateRange[0]).toISOString(),
                        endDate: new Date(dateRange[1]).toISOString()
                      };
                    });
                    setCurrentPackage({ ...currentPackage, dateRanges: formattedDates });
                  }}
                  placeholder="Enter date ranges (e.g., 01/01/2023 to 01/07/2023)"
                />
              </Form.Group>
              <Form.Group controlId="formItinerary">
                <Form.Label>Itinerary</Form.Label>
                <Form.Control
                  type="text"
                  value={JSON.stringify(currentPackage.itinerary)}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, itinerary: JSON.parse(e.target.value) })}
                  placeholder="Enter itinerary details in JSON format"
                />
              </Form.Group>
              <Form.Group controlId="formInclusions">
                <Form.Label>Inclusions</Form.Label>
                <ReactQuill
                  value={currentPackage.inclusions}
                  onChange={(content) => setCurrentPackage({ ...currentPackage, inclusions: content })}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ color: [] }, { background: [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formExclusions">
                <Form.Label>Exclusions</Form.Label>
                <ReactQuill
                  value={currentPackage.exclusions}
                  onChange={(content) => setCurrentPackage({ ...currentPackage, exclusions: content })}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ color: [] }, { background: [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formCancellationPolicy">
                <Form.Label>Cancellation Policy</Form.Label>
                <ReactQuill
                  value={currentPackage.cancellationPolicy}
                  onChange={(content) => setCurrentPackage({ ...currentPackage, cancellationPolicy: content })}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ color: [] }, { background: [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal to display enlarged image */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Body className="text-center">
          {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />}
        </Modal.Body>
      </Modal>

      {/* Modal to display itinerary */}
      <Modal show={showItineraryModal} onHide={() => setShowItineraryModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Itinerary Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItinerary ? (
            <div>
              <div className="itinerary-container">
                {Object.entries(selectedItinerary).map(([, details], index) => (
                  <div key={index} className="mb-3 p-2 border rounded">
                    {typeof details === 'object' ? (
                      <ul className="list-unstyled">
                        {Object.entries(details).map(([key, value], i) => (
                          <li key={i}>
                            <strong>{key}:</strong>{' '}
                            {Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? Object.values(value).join(', ') : value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center">No Itinerary Available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal to display content (Inclusions, Exclusions, Cancellation Policy) */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{contentModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: selectedContent }} />
        </Modal.Body>
      </Modal>

      {/* Flight Selection Modal */}
      <Modal show={showFlightModal} onHide={() => setShowFlightModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Flights</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableFlights.length > 0 ? (
            <div>
              {packages[selectedPackageIndex]?.dateRanges.map((dateRange, rangeIndex) => (
                <div key={rangeIndex} className="mb-4">
                  <h5>
                    Date Range: {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                  </h5>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Airline</th>
                        <th>Flight Number</th>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableFlights
                        .filter((flight) =>
                          flight.departureDates.some((date) => {
                            const flightDate = new Date(date);
                            return flightDate >= new Date(dateRange.startDate) && flightDate <= new Date(dateRange.endDate);
                          })
                        )
                        .map((flight, flightIndex) => (
                          <tr key={flightIndex}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedFlights[rangeIndex]?.includes(flight.flightId)}
                                onChange={(e) => {
                                  setSelectedFlights((prev) => {
                                    const newSelected = { ...prev };
                                    if (!newSelected[rangeIndex]) {
                                      newSelected[rangeIndex] = [];
                                    }
                                    if (e.target.checked) {
                                      newSelected[rangeIndex] = [...newSelected[rangeIndex], flight.flightId];
                                    } else {
                                      newSelected[rangeIndex] = newSelected[rangeIndex].filter((id) => id !== flight.flightId);
                                    }
                                    return newSelected;
                                  });
                                }}
                              />
                            </td>
                            <td>{flight.airlineName}</td>
                            <td>{flight.flightNumber}</td>
                            <td>
                              {flight.departureAirport} → {flight.arrivalAirport}
                            </td>
                            <td>
                              {flight.departureDates
                                .filter((date) => {
                                  const flightDate = new Date(date);
                                  return flightDate >= new Date(dateRange.startDate) && flightDate <= new Date(dateRange.endDate);
                                })
                                .map((date, i) => (
                                  <div key={i}>{new Date(date).toLocaleDateString()}</div>
                                ))}
                            </td>
                            <td>{flight.flightDuration}</td>
                            <td>₹{flight.flightPrice}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              ))}
            </div>
          ) : (
            <p>No flights available for the selected date ranges.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFlightModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveFlights}>
            Save Flights
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default BootstrapTable;
