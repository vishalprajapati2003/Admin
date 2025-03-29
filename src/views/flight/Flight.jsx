import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Badge, Dropdown } from 'react-bootstrap';
import { FaEdit, FaPowerOff, FaFilter } from 'react-icons/fa';
import PropTypes from 'prop-types';

// ShowMore component for long text
const ShowMore = ({ text, maxLength = 30 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) return <span>{text}</span>;

  return (
    <span>
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <Button variant="link" size="sm" className="p-0 ms-1" onClick={() => setIsExpanded(!isExpanded)} style={{ textDecoration: 'none' }}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </Button>
    </span>
  );
};

ShowMore.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number
};

const initialFormState = {
  flightId: new Date().getTime(),
  airlineName: '',
  flightNumber: '',
  departureAirport: '',
  arrivalAirport: '',
  departureDates: [''], // Array to store multiple dates
  flightDuration: '',
  flightPrice: '',
  active: true
};

const Flight = () => {
  const [flights, setFlights] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedFlights = localStorage.getItem('flights');
    if (storedFlights) {
      setFlights(JSON.parse(storedFlights));
    }
  }, []);

  const filteredFlights = flights.filter((flight) => {
    if (filter === 'active') return flight.active;
    if (filter === 'inactive') return !flight.active;
    const searchLower = searchQuery.toLowerCase();

    return (
      searchQuery === '' ||
      flight.airlineName?.toLowerCase().includes(searchLower) ||
      flight.flightNumber?.toLowerCase().includes(searchLower)
    );
  });

  const handleClose = () => {
    setShow(false);
    setEditIndex(null);
    setFormData(initialFormState);
  };

  const handleShow = () => setShow(true);

  const handleSave = () => {
    let newFlights;
    if (editIndex !== null) {
      newFlights = [...flights];
      newFlights[editIndex] = formData;
    } else {
      const newFlight = {
        ...formData,
        flightId: new Date().getTime()
      };
      newFlights = [...flights, newFlight];
    }
    setFlights(newFlights);
    localStorage.setItem('flights', JSON.stringify(newFlights));
    handleClose();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(flights[index]);
    setShow(true);
  };

  const handleToggleActive = (index) => {
    const newFlights = [...flights];
    newFlights[index] = {
      ...newFlights[index],
      active: !newFlights[index].active
    };
    setFlights(newFlights);
    localStorage.setItem('flights', JSON.stringify(newFlights));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (index, value) => {
    const newDates = [...formData.departureDates];
    newDates[index] = value;
    setFormData((prev) => ({
      ...prev,
      departureDates: newDates
    }));
  };

  const addDepartureDate = () => {
    setFormData((prev) => ({
      ...prev,
      departureDates: [...prev.departureDates, '']
    }));
  };

  const removeDepartureDate = (index) => {
    setFormData((prev) => ({
      ...prev,
      departureDates: prev.departureDates.filter((_, i) => i !== index)
    }));
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Flight Details</h2>

        <div className="d-flex justify-content-between align-items-center gap-3">
            <Form.Group className='mb-0'>
              <Form.Control
                type="text"
                placeholder="Search flights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          <Button variant="primary" onClick={handleShow}>
            Add New Flight
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-filter">
              <FaFilter className="me-2" />
              {filter === 'all' ? 'All Flights' : filter === 'active' ? 'Active Flights' : 'Inactive Flights'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item active={filter === 'all'} onClick={() => setFilter('all')}>
                All Flights
              </Dropdown.Item>
              <Dropdown.Item active={filter === 'active'} onClick={() => setFilter('active')}>
                Active Flights
              </Dropdown.Item>
              <Dropdown.Item active={filter === 'inactive'} onClick={() => setFilter('inactive')}>
                Inactive Flights
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Airline Name</th>
            <th>Flight Number</th>
            <th>Route</th>
            <th>Departure Dates</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFlights.map((flight, index) => (
            <tr key={flight.flightId} className={!flight.active ? 'table-secondary' : ''}>
              <td>{flight.airlineName}</td>
              <td>{flight.flightNumber}</td>
              <td>
                <ShowMore text={`${flight.departureAirport} → ${flight.arrivalAirport}`} />
              </td>
              <td>
                <div className="d-flex flex-column">
                  {flight.departureDates.map((date, idx) => (
                    <small key={idx} className="mb-1">
                      {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </small>
                  ))}
                </div>
              </td>
              <td>{flight.flightDuration}</td>
              <td>₹{flight.flightPrice}</td>
              <td>
                <Badge bg={flight.active ? 'success' : 'danger'}>{flight.active ? 'Active' : 'Inactive'}</Badge>
              </td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => handleEdit(index)}>
                  <FaEdit />
                </Button>
                <Button
                  variant={flight.active ? 'danger' : 'success'}
                  onClick={() => handleToggleActive(index)}
                  title={flight.active ? 'Deactivate' : 'Activate'}
                >
                  <FaPowerOff />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit Flight' : 'Add New Flight'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Airline Name</Form.Label>
              <Form.Control type="text" value={formData.airlineName} onChange={(e) => handleInputChange('airlineName', e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Flight Number</Form.Label>
              <Form.Control type="text" value={formData.flightNumber} onChange={(e) => handleInputChange('flightNumber', e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Departure Airport</Form.Label>
              <Form.Control
                type="text"
                value={formData.departureAirport}
                onChange={(e) => handleInputChange('departureAirport', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Arrival Airport</Form.Label>
              <Form.Control
                type="text"
                value={formData.arrivalAirport}
                onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Departure Dates</Form.Label>
              <div className="departure-dates-container">
                {formData.departureDates.map((date, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      style={{ maxWidth: '200px' }}
                    />
                    {index > 0 && (
                      <Button variant="danger" size="sm" className="ms-2" onClick={() => removeDepartureDate(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={addDepartureDate} className="mt-2">
                  Add Another Date
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Flight Duration (in hours)</Form.Label>
              <Form.Control
                type="text"
                value={formData.flightDuration}
                onChange={(e) => handleInputChange('flightDuration', e.target.value)}
                placeholder="e.g. 2.5"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Flight Price (₹)</Form.Label>
              <Form.Control type="number" value={formData.flightPrice} onChange={(e) => handleInputChange('flightPrice', e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Flight Active"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editIndex !== null ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Flight;
