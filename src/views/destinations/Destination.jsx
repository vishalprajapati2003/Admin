import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [sightSeeing, setSightSeeing] = useState([]);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showSightSeeingModal, setShowSightSeeingModal] = useState(false);
  const [currentDestinationId, setCurrentDestinationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newDestination, setNewDestination] = useState({
    destinationId: new Date().getTime(),
    name: '',
    country: '',
    region: '',
    period: '',
    image: ''
  });

  const [newSightSeeing, setNewSightSeeing] = useState({
    id: new Date().getTime(),
    destinationId: null, // Added destinationId here
    name: '',
    description: '',
    entryFee: '',
    openingHour: '',
    bestTimeToVisit: '',
    image: ''
  });

  // Load destinations from localStorage
  useEffect(() => {
    const storedDestinations = JSON.parse(localStorage.getItem('destinations')) || [];
    setDestinations(storedDestinations);
  }, []);

  // Handle change for destination fields
  const handleDestinationChange = (e) => {
    setNewDestination({ ...newDestination, [e.target.name]: e.target.value });
  };

  const handleDestinationImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDestination({ ...newDestination, image: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddDestination = () => {
    const updatedDestinations = [...destinations, newDestination];
    setDestinations(updatedDestinations);
    localStorage.setItem('destinations', JSON.stringify(updatedDestinations));
    alert('Destination Add Successfully!!!');
    handleCloseDestinationModal();
  };

  const handleShowDestinationModal = () => setShowDestinationModal(true);
  const handleCloseDestinationModal = () => {
    setShowDestinationModal(false);
    setNewDestination({
      name: '',
      country: '',
      region: '',
      period: '',
      image: ''
    });
  };

  // Load sightseeing options from localStorage
  useEffect(() => {
    // Retrieve stored data from localStorage
    const storedSightSeeingString = localStorage.getItem('sightSeeing');
    try {
      const storedSightSeeing = JSON.parse(storedSightSeeingString) || [];
      setSightSeeing(storedSightSeeing);
    } catch (error) {
      console.error('Error parsing sightSeeing from localStorage:', error);
      setSightSeeing([]);
    }
  }, []);

  const handleSightSeeingChange = (e) => {
    setNewSightSeeing({ ...newSightSeeing, [e.target.name]: e.target.value });
  };

  const handleSightSeeingImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewSightSeeing({ ...newSightSeeing, image: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddSightSeeing = () => {
    const sightSeeingId = new Date().getTime();

    const updatedSightSeeingEntry = {
      ...newSightSeeing,
      id: sightSeeingId,
      destinationId: currentDestinationId
    };

    const updatedSightSeeing = [...sightSeeing, updatedSightSeeingEntry];
    setSightSeeing(updatedSightSeeing);
    localStorage.setItem('sightSeeing', JSON.stringify(updatedSightSeeing));
    alert('SightSeeing Added Successfully');
    handleCloseSightSeeingModal();
  };

  const handleShowSightSeeingModal = (destinationId) => {
    setCurrentDestinationId(destinationId);
    setShowSightSeeingModal(true);
  };

  const handleCloseSightSeeingModal = () => {
    setShowSightSeeingModal(false);
    setNewSightSeeing({
      name: '',
      description: '',
      entryFee: '',
      openingHour: '',
      bestTimeToVisit: '',
      image: ''
    });
  };
  const filteredDestinations = destinations.filter((destination) => {
    const searchLower = searchQuery.toLowerCase();

    return searchQuery === '' || destination.name.toLowerCase().includes(searchLower);
  });

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">All Destinations Details</Card.Title>
              <div  className="d-flex justify-content-between align-items-center">
              <Col md={6}>
                <Form.Group className='mb-0'>
                  <Form.Control
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <span className="d-block m-t-5">
                <Button onClick={handleShowDestinationModal}>Add New Destination</Button>
              </span>
              </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Destination Name</th>
                    <th>Destination Country</th>
                    <th>Region/State</th>
                    <th>Best Travel Period</th>
                    <th>Sight Seeing</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.map((destination, index) => (
                    <tr key={destination.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{destination.name}</td>
                      <td>{destination.country}</td>
                      <td>{destination.region}</td>
                      <td>{destination.period}</td>
                      <td>
                        <Button onClick={() => handleShowSightSeeingModal(destination.destinationId)}>Add SightSeeing</Button>
                      </td>
                      <td>
                        {destination.image ? (
                          <img src={destination.image} alt="Destination" style={{ width: '50px', height: '50px' }} />
                        ) : (
                          'Image Not Available'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Adding New Destination */}
      <Modal show={showDestinationModal} onHide={handleCloseDestinationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Destination</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDestinationName">
              <Form.Label>Destination Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newDestination.name}
                onChange={handleDestinationChange}
                placeholder="Enter destination name"
              />
            </Form.Group>
            <Form.Group controlId="formCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={newDestination.country}
                onChange={handleDestinationChange}
                placeholder="Enter"
              />
            </Form.Group>
            <Form.Group controlId="formRegion">
              <Form.Label>Region/State</Form.Label>
              <Form.Control
                type="text"
                name="region"
                value={newDestination.region}
                onChange={handleDestinationChange}
                placeholder="Enter region/state"
              />
            </Form.Group>
            <Form.Group controlId="formPeriod">
              <Form.Label>Best Travel Period</Form.Label>
              <Form.Control
                type="text"
                name="period"
                value={newDestination.period}
                onChange={handleDestinationChange}
                placeholder="Enter best travel period"
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleDestinationImageChange} />
              {newDestination.image && (
                <img src={newDestination.image} alt="Destination Preview" style={{ width: '100px', marginTop: '10px' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDestinationModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddDestination}>
            Add Destination
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding New SightSeeing */}
      <Modal show={showSightSeeingModal} onHide={handleCloseSightSeeingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add SightSeeing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSightSeeingName">
              <Form.Label>Sight Seeing Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSightSeeing.name}
                onChange={handleSightSeeingChange}
                placeholder="Enter sight seeing name"
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newSightSeeing.description}
                onChange={handleSightSeeingChange}
                placeholder="Enter Description"
              />
            </Form.Group>
            <Form.Group controlId="formEntryFee">
              <Form.Label>Entry Fee</Form.Label>
              <Form.Control
                type="number"
                name="entryFee"
                value={newSightSeeing.entryFee}
                onChange={handleSightSeeingChange}
                placeholder="Enter Entry Fee"
              />
            </Form.Group>
            <Form.Group controlId="formOpeningHours">
              <Form.Label>Opening Hours</Form.Label>
              <Form.Control
                type="text"
                name="openingHour"
                value={newSightSeeing.openingHour}
                onChange={handleSightSeeingChange}
                placeholder="Enter opening hours"
              />
            </Form.Group>
            <Form.Group controlId="formBestTimeToVisit">
              <Form.Label>Best Time To Visit</Form.Label>
              <Form.Control
                type="text"
                name="bestTimeToVisit"
                value={newSightSeeing.bestTimeToVisit}
                onChange={handleSightSeeingChange}
                placeholder="Enter Best Time To Visit"
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleSightSeeingImageChange} />
              {newSightSeeing.image && (
                <img src={newSightSeeing.image} alt="SightSeeing Preview" style={{ width: '100px', marginTop: '10px' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSightSeeingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSightSeeing}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Destination;
