import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal, Stack } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Add custom styles for Quill editor and form layout
const styles = {
  quillContainer: {
    marginBottom: '5rem',
    height: 'auto',
    minHeight: '200px',
    position: 'relative' // Add this to help with positioning
  },
  quillEditor: {
    height: '200px',
    marginBottom: '3rem', // Space for toolbar
    display: 'block' // Force block display
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  sectionDivider: {
    marginTop: '2rem',
    marginBottom: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #dee2e6'
  },
  modalBody: {
    maxHeight: '60vh',
    overflowY: 'auto'
  }
};

// Add custom CSS for Quill editor
const quillStyles = `
  .ql-container {
    display: block !important;
    float: none !important;
  }
  
  .ql-toolbar {
    display: block !important;
    float: none !important;
  }
  
  .ql-editor {
    display: block !important;
    float: none !important;
  }
  
  .ql-toolbar.ql-snow {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  
  .ql-container.ql-snow {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const FormsElements = () => {
  // Form Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');

  // Package Details
  const [packageType, setPackageType] = useState('Personal');
  const [showModal, setShowModal] = useState(false);
  const [totalDays, setTotalDays] = useState(1);

  // Itinerary Management
  const [itinerary, setItinerary] = useState([]);
  const [dateRanges, setDateRanges] = useState([{ startDate: '', endDate: '' }]);

  // Activity Management
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  // Image Management
  const [image, setImage] = useState('');

  // Destination and Sightseeing Management
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [sightSeeing, setSightSeeing] = useState([]);
  const [filteredSightSeeing, setFilteredSightSeeing] = useState([]);

  // Cancellation Policy
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // Add new state variables for inclusions and exclusions
  const [inclusions, setInclusions] = useState('');
  const [exclusions, setExclusions] = useState('');

  // Add new state variables for day-wise destination modal
  const [showDayDestinationModal, setShowDayDestinationModal] = useState(false);
  const [selectedDayForDestination, setSelectedDayForDestination] = useState(null);

  // Add new state variables for hotel selection
  const [hotels, setHotels] = useState([]);
  // const [filteredHotels, setFilteredHotels] = useState([]);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [selectedDayForHotel, setSelectedDayForHotel] = useState(null);

  // Quill editor modules/formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'color', 'background', 'align', 'link', 'image'];

  // Helper functions
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    // Load destinations and sightseeing from localStorage
    const destinations = localStorage.getItem('destinations');
    setDestinations(destinations ? JSON.parse(destinations) : []);

    const sightSeeing = localStorage.getItem('sightSeeing');
    const parsedSightSeeing = sightSeeing ? JSON.parse(sightSeeing) : [];
    console.log('Loaded SightSeeing:', parsedSightSeeing);
    setSightSeeing(parsedSightSeeing);

    // Load hotels from localStorage
    const storedHotels = localStorage.getItem('hotels');
    if (storedHotels) {
      setHotels(JSON.parse(storedHotels));
    }
  }, []);

  useEffect(() => {
    // Filter destinations based on selected region
    if (region.trim()) {
      const filtered = destinations.filter((dest) => dest.region.toLowerCase().includes(region.toLowerCase()));
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations([]);
    }
  }, [region, destinations]);

  useEffect(() => {
    if (sightSeeing.length === 0) {
      return;
    }
  }, [sightSeeing]);

  useEffect(() => {
    console.log('Itinerary:', itinerary);
  }, [itinerary]);

  useEffect(() => {
    console.log('Inclusions:', inclusions);
  }, [inclusions]);

  useEffect(() => {
    console.log('Exclusions:', exclusions);
  }, [exclusions]);

  useEffect(() => {
    console.log('Cancellation Policy:', cancellationPolicy);
  }, [cancellationPolicy]);

  const handleStartDateChange = (index, value) => {
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index].startDate = value;

    // Only update end date if start date is valid
    if (updatedDateRanges[index].startDate) {
      const startDate = new Date(updatedDateRanges[index].startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + totalDays); // Calculate end date by adding total days directly
      updatedDateRanges[index].endDate = endDate.toISOString().split('T')[0];
    } else {
      updatedDateRanges[index].endDate = ''; 
    }

    setDateRanges(updatedDateRanges);
  };

  const handleTotalDaysChange = (e) => {
    const days = Number(e.target.value);
    setTotalDays(days);

    // Update end date based on existing start date
    const updatedDateRanges = dateRanges.map((range) => {
      if (range.startDate) {
        const startDate = new Date(range.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days); // Set end date directly based on total days
        return { startDate: range.startDate, endDate: endDate.toISOString().split('T')[0] };
      }
      return range; // Keep unchanged if no start date
    });

    setDateRanges(updatedDateRanges);
  };

  // In useEffect, revise total days calculation
  useEffect(() => {
    if (dateRanges[0].startDate && dateRanges[0].endDate) {
      const start = new Date(dateRanges[0].startDate);
      const end = new Date(dateRanges[0].endDate);
      // Calculate days correctly
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Add 1 to include the start date

      if (days !== totalDays) {
        setTotalDays(days);
      }

      setItinerary(
        Array.from({ length: days }, (_, index) => ({
          day: index + 1,
          destinations: '',
          activities: [],
          accommodation: '',
          meals: [],
          transport: ''
        }))
      );
    }
  }, [dateRanges]);

  // Helper functions
  const handleCheckboxChange = (destination) => {
    setSelectedDestinations((prevSelected) =>
      prevSelected.includes(destination) ? prevSelected.filter((item) => item !== destination) : [...prevSelected, destination]
    );
  };

  const getDayDestinations = (index) => {
    return Array.isArray(itinerary[index]?.destinations) ? itinerary[index].destinations : [];
  };

  const handleShowActivity = (index) => {
    setSelectedDayIndex(index);

    // Get destinations for the selected day
    const dayDestinations = getDayDestinations(index);

    console.log('Day Destinations:', dayDestinations);
    console.log('All Destinations:', destinations);
    console.log('SightSeeing:', sightSeeing);

    // Filter sightseeing based on the selected day's destinations
    if (dayDestinations.length > 0) {
      const filtered = sightSeeing.filter((sight) => {
        // Find the destination that matches the name
        const matchingDestination = destinations.find((dest) => dayDestinations.includes(dest.name));

        console.log('Matching Destination:', matchingDestination);
        console.log('Sight DestinationId:', sight.destinationId);
        console.log('Destination ID:', matchingDestination?.destinationId);

        // Check if the sightseeing item's destinationId matches the destination's id
        return matchingDestination && String(sight.destinationId) === String(matchingDestination.destinationId);
      });

      console.log('Filtered Sightseeing:', filtered);
      setFilteredSightSeeing(filtered);
    } else {
      setFilteredSightSeeing([]);
    }

    setShowActivityModal(true);
  };

  const handleCheckboxChangeActivity = (activity) => {
    if (selectedDayIndex === null) return;

    setItinerary((prevItinerary) =>
      prevItinerary.map((day, index) =>
        index === selectedDayIndex
          ? {
              ...day,
              activities: day.activities.includes(activity) ? day.activities.filter((a) => a !== activity) : [...day.activities, activity]
            }
          : day
      )
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage((prevImages) => [...prevImages, reader.result]);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      id: new Date().getTime(),
      title,
      description,
      price,
      region,
      packageType,
      selectedDestinations,
      dateRanges,
      totalDays,
      itinerary,
      image,
      inclusions,
      exclusions,
      cancellationPolicy
    };

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.region ||
      !formData.packageType ||
      formData.selectedDestinations.length === 0 ||
      formData.dateRanges.length === 0 ||
      !formData.totalDays ||
      !formData.itinerary ||
      !formData.inclusions ||
      !formData.exclusions ||
      !formData.cancellationPolicy
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const existingData = JSON.parse(localStorage.getItem('travelPackages')) || [];

    const isDuplicate = existingData.some(
      (pkg) =>
        pkg.title === formData.title &&
        pkg.price === formData.price &&
        JSON.stringify(pkg.dateRanges) === JSON.stringify(formData.dateRanges) &&
        JSON.stringify(pkg.selectedDestinations) === JSON.stringify(formData.selectedDestinations)
    );

    if (isDuplicate) {
      alert('This package already exists!');
      return;
    }

    localStorage.setItem('travelPackages', JSON.stringify([...existingData, formData]));

    alert('Package created successfully!!');
    // Reset the form fields
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setRegion('');
    setPackageType('Personal');
    setSelectedDestinations([]);
    setTotalDays(1);
    setItinerary([]);
    setDateRanges([{ startDate: '', endDate: '' }]);
    setInclusions('');
    setExclusions('');
    setCancellationPolicy('');
  };

  // Add new handlers for day-wise destination selection
  const handleShowDayDestination = (index) => {
    setSelectedDayForDestination(index);
    setShowDayDestinationModal(true);
  };

  const handleCloseDayDestination = () => {
    setShowDayDestinationModal(false);
    setSelectedDayForDestination(null);
  };

  const handleCheckboxChangeDayDestination = (index, destination) => {
    setItinerary((prevItinerary) =>
      prevItinerary.map((day, i) =>
        i === index
          ? {
              ...day,
              destinations: Array.isArray(day.destinations)
                ? day.destinations.includes(destination)
                  ? day.destinations.filter((d) => d !== destination)
                  : [...day.destinations, destination]
                : [destination]
            }
          : day
      )
    );
  };

  // Add a new function to get filtered destinations for day-wise selection
  const getFilteredDayDestinations = () => {
    return destinations.filter((dest) => selectedDestinations.includes(dest.name));
  };

  // Add new function to filter hotels based on destination
  const getFilteredHotels = (destinationName) => {
    // Find the destination that matches the name
    const matchingDestination = destinations.find((dest) => dest.name === destinationName);
    console.log('Matching Destination:', matchingDestination);

    if (!matchingDestination) {
      console.log('No matching destination found for:', destinationName);
      return [];
    }

    // Filter hotels that match either the city or region
    const filteredHotels = hotels.filter((hotel) => {
      const cityMatch = hotel.city.toLowerCase() === matchingDestination.region.toLowerCase();
      const regionMatch = hotel.city.toLowerCase() === matchingDestination.name.toLowerCase();
      console.log('Hotel:', hotel.hotelName, 'City:', hotel.city, 'City Match:', cityMatch, 'Region Match:', regionMatch);
      return cityMatch || regionMatch;
    });

    console.log('Filtered Hotels for', destinationName, ':', filteredHotels);
    return filteredHotels;
  };

  // Add new handlers for hotel selection
  const handleShowHotelModal = (index) => {
    setSelectedDayForHotel(index);
    setShowHotelModal(true);
  };

  const handleCloseHotelModal = () => {
    setShowHotelModal(false);
    setSelectedDayForHotel(null);
  };

  const handleHotelSelection = (hotel) => {
    if (selectedDayForHotel === null) return;

    setItinerary((prevItinerary) =>
      prevItinerary.map((day, index) =>
        index === selectedDayForHotel
          ? {
              ...day,
              accommodation: hotel.hotelName
            }
          : day
      )
    );
    handleCloseHotelModal();
  };

  return (
    <React.Fragment>
      <style>{quillStyles}</style>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Add Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Description</Form.Label>
                      <div style={styles.quillContainer}>
                        <ReactQuill
                          theme="snow"
                          value={description}
                          onChange={setDescription}
                          modules={modules}
                          formats={formats}
                          style={styles.quillEditor}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Selected Destinations</Form.Label>
                      <Form.Control as="textarea" rows={3} readOnly value={selectedDestinations.join(', ')} />
                    </Form.Group>

                    <Button variant="primary" onClick={handleShow} className="mb-4">
                      Add Destinations
                    </Button>

                    <Modal show={showModal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Select Destinations</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={styles.modalBody}>
                        {filteredDestinations.length > 0 ? (
                          filteredDestinations.map((dest) => (
                            <Form.Check
                              key={dest.id}
                              type="checkbox"
                              label={dest.name}
                              checked={selectedDestinations.includes(dest.name)}
                              onChange={() => handleCheckboxChange(dest.name)}
                            />
                          ))
                        ) : (
                          <p>No destinations available for the selected region.</p>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <Form.Group className="mb-4">
                      <Form.Label>Inclusions</Form.Label>
                      <div style={styles.quillContainer}>
                        <ReactQuill
                          theme="snow"
                          value={inclusions}
                          onChange={setInclusions}
                          modules={modules}
                          formats={formats}
                          style={styles.quillEditor}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Cancellation Policy</Form.Label>
                      <div style={styles.quillContainer}>
                        <ReactQuill
                          theme="snow"
                          value={cancellationPolicy}
                          onChange={setCancellationPolicy}
                          modules={modules}
                          formats={formats}
                          style={styles.quillEditor}
                        />
                      </div>
                    </Form.Group>
                  </Form>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Region/State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Region/State"
                      onChange={(e) => setRegion(e.target.value)}
                      value={region}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} value={price} required />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Package Type</Form.Label>
                    <Form.Control as="select" value={packageType} onChange={(e) => setPackageType(e.target.value)}>
                      <option value="Group">Group</option>
                      <option value="Personal">Personal</option>
                    </Form.Control>
                  </Form.Group>

                  {packageType === 'Group' && (
                    <Form.Group className="mb-4">
                      <Form.Label>Max Guests</Form.Label>
                      <Form.Control type="number" placeholder="Enter max guests" />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label>Package Dates</Form.Label>
                    {dateRanges.map((range, index) => (
                      <Stack key={index} direction="horizontal" gap={3} className="mb-2">
                        <Form.Control type="date" value={range.startDate} onChange={(e) => handleStartDateChange(index, e.target.value)} />
                        <Form.Control type="date" value={range.endDate} readOnly />
                      </Stack>
                    ))}
                    <Button
                      variant="secondary"
                      onClick={() => setDateRanges([...dateRanges, { startDate: '', endDate: '' }])}
                      className="mt-2"
                    >
                      Add More Dates
                    </Button>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Duration (in Days)</Form.Label>
                    <Form.Control type="number" value={totalDays} onChange={handleTotalDaysChange} required />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Upload Images</Form.Label>
                    <Form.Control type="file" multiple onChange={handleImageUpload} />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Exclusions</Form.Label>
                    <div style={styles.quillContainer}>
                      <ReactQuill
                        theme="snow"
                        value={exclusions}
                        onChange={setExclusions}
                        modules={modules}
                        formats={formats}
                        style={styles.quillEditor}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <div style={styles.sectionDivider}>
                <h5>Itinerary</h5>
                {itinerary.map((day, index) => (
                  <div key={index} className="mb-4">
                    <h6>Day {day.day}</h6>
                    <Form.Group className="mb-3">
                      <Form.Label>Selected Destinations</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        readOnly
                        value={Array.isArray(day.destinations) ? day.destinations.join(', ') : ''}
                      />
                    </Form.Group>

                    <Button variant="primary" onClick={() => handleShowDayDestination(index)} className="mb-3">
                      Add Destinations for Day {index + 1}
                    </Button>

                    <Modal show={showDayDestinationModal} onHide={handleCloseDayDestination}>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Select Destinations for Day {selectedDayForDestination !== null ? selectedDayForDestination + 1 : ''}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={styles.modalBody}>
                        {getFilteredDayDestinations().length > 0 ? (
                          getFilteredDayDestinations().map((dest) => (
                            <Form.Check
                              key={dest.id}
                              type="checkbox"
                              label={dest.name}
                              checked={
                                Array.isArray(itinerary[selectedDayForDestination]?.destinations) &&
                                itinerary[selectedDayForDestination].destinations.includes(dest.name)
                              }
                              onChange={() => handleCheckboxChangeDayDestination(selectedDayForDestination, dest.name)}
                            />
                          ))
                        ) : (
                          <p>Please select destinations in the main destination field first.</p>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDayDestination}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <Form.Group className="mb-3">
                      <Form.Label>Selected Activities</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        readOnly
                        value={Array.isArray(day.activities) ? day.activities.join(', ') : ''}
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={() => handleShowActivity(index)}>
                      Add Activities
                    </Button>

                    <Modal show={showActivityModal && selectedDayIndex === index} onHide={() => setShowActivityModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Select Activities for Day {index + 1}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {filteredSightSeeing.length > 0 ? (
                          filteredSightSeeing.map((activity, idx) => (
                            <Form.Check
                              key={idx}
                              type="checkbox"
                              label={`${activity.name} - ${activity.description || ''} (${activity.openingHour || 'No time specified'})`}
                              checked={
                                Array.isArray(itinerary[selectedDayIndex]?.activities) &&
                                itinerary[selectedDayIndex].activities.includes(activity.name)
                              }
                              onChange={() => handleCheckboxChangeActivity(activity.name)}
                            />
                          ))
                        ) : (
                          <p>
                            {sightSeeing.length === 0
                              ? 'No sightseeing activities available in the system. Please add some activities first.'
                              : getDayDestinations(index).length === 0
                                ? 'Please select destinations for this day first.'
                                : 'No activities available for the selected destinations.'}
                          </p>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowActivityModal(false)}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <Form.Group className="mb-2">
                      <Form.Label>Accommodation</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control type="text" placeholder="Selected hotel will appear here" value={day.accommodation} readOnly />
                        <Button variant="primary" onClick={() => handleShowHotelModal(index)}>
                          Select Hotel
                        </Button>
                      </div>
                    </Form.Group>

                    <Modal show={showHotelModal && selectedDayForHotel === index} onHide={handleCloseHotelModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Select Hotel for Day {index + 1}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {day.destinations && day.destinations.length > 0 ? (
                          day.destinations.map((destinationName) => {
                            const hotelsForDestination = getFilteredHotels(destinationName);
                            return (
                              <div key={destinationName} className="mb-3">
                                <h6>Hotels in {destinationName}</h6>
                                {hotelsForDestination.length > 0 ? (
                                  hotelsForDestination.map((hotel) => (
                                    <div key={hotel.hotelId} className="mb-2">
                                      <Form.Check
                                        type="radio"
                                        label={
                                          <div>
                                            <strong>{hotel.hotelName}</strong>
                                            <br />
                                            <small className="text-muted">
                                              {hotel.address} |{' '}
                                              {Object.entries(hotel.roomTypes)
                                                .filter(([, value]) => value.available)
                                                .map(([type, value]) => `${type}: ₹${value.price}`)
                                                .join(' | ')}
                                            </small>
                                          </div>
                                        }
                                        checked={day.accommodation === hotel.hotelName}
                                        onChange={() => handleHotelSelection(hotel)}
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-muted">No hotels available for this destination.</p>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p>Please select destinations for this day first.</p>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseHotelModal}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <Form.Group className="mb-2">
                      <Form.Label>Meals</Form.Label>
                      {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                        <Form.Check
                          key={meal}
                          type="checkbox"
                          label={meal}
                          checked={day.meals.includes(meal)}
                          onChange={() => {
                            const updatedItinerary = [...itinerary];
                            const meals = updatedItinerary[index].meals.includes(meal)
                              ? updatedItinerary[index].meals.filter((m) => m !== meal)
                              : [...updatedItinerary[index].meals, meal];
                            updatedItinerary[index].meals = meals;
                            setItinerary(updatedItinerary);
                          }}
                        />
                      ))}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Transport</Form.Label>
                      {['Bus', 'Car'].map((option) => (
                        <Form.Check
                          key={option}
                          type="radio"
                          label={option}
                          name={`transport-${index}`}
                          checked={day.transport === option}
                          onChange={() => {
                            const updatedItinerary = [...itinerary];
                            updatedItinerary[index].transport = option;
                            setItinerary(updatedItinerary);
                          }}
                        />
                      ))}
                    </Form.Group>
                    <hr />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Button variant="success" onClick={handleSubmit}>
            Save Package
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FormsElements;
