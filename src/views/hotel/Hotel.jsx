import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge, Dropdown } from 'react-bootstrap';
import { FaEdit, FaPowerOff, FaFilter } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Add ShowMore component
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

ShowMore.defaultProps = {
  maxLength: 20
};

const initialFormState = {
  hotelId: new Date().getTime(),
  hotelName: '',
  address: '',
  city: '',
  active: true,
  roomTypes: {
    standard: { available: true, price: '' },
    deluxe: { available: true, price: '' },
    suite: { available: true, price: '' }
  },
  amenities: {
    wifi: false,
    parking: false,
    pool: false,
    restaurant: false,
    gym: false,
    spa: false
  }
};

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedHotels = localStorage.getItem('hotels');
    if (storedHotels) {
      setHotels(JSON.parse(storedHotels));
    }
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    if (filter === 'active') return hotel.active;
    if (filter === 'inactive') return !hotel.active;

    const searchLower = searchQuery.toLowerCase();

    return (
      searchQuery === '' || 
      hotel.hotelName?.toLowerCase().includes(searchLower) || 
      hotel.city?.toLowerCase().includes(searchLower)
    );
});


  const handleClose = () => {
    setShow(false);
    setEditIndex(null);
    setFormData(initialFormState);
  };

  const handleShow = () => setShow(true);

  const handleSave = () => {
    let newHotels;
    if (editIndex !== null) {
      newHotels = [...hotels];
      newHotels[editIndex] = formData;
    } else {
      const newHotel = {
        ...formData,
        hotelId: new Date().getTime()
      };
      newHotels = [...hotels, newHotel];
    }
    setHotels(newHotels);
    localStorage.setItem('hotels', JSON.stringify(newHotels));
    handleClose();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(hotels[index]);
    setShow(true);
  };

  const handleToggleActive = (index) => {
    const newHotels = [...hotels];
    newHotels[index] = {
      ...newHotels[index],
      active: !newHotels[index].active
    };
    setHotels(newHotels);
    localStorage.setItem('hotels', JSON.stringify(newHotels));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoomPriceChange = (roomType, price) => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: {
        ...prev.roomTypes,
        [roomType]: {
          ...prev.roomTypes[roomType],
          price
        }
      }
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Hotels Details</h2>

        <div className="d-flex justify-content-between">
          <Col md={4}>
            <Form.Group className='mb-0'>
              <Form.Control
                type="text"
                placeholder="Search Hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Button variant="primary" onClick={handleShow}>
            Add New Hotel
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-filter">
              <FaFilter className="me-2" />
              {filter === 'all' ? 'All Hotels' : filter === 'active' ? 'Active Hotels' : 'Inactive Hotels'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item active={filter === 'all'} onClick={() => setFilter('all')}>
                All Hotels
              </Dropdown.Item>
              <Dropdown.Item active={filter === 'active'} onClick={() => setFilter('active')}>
                Active Hotels
              </Dropdown.Item>
              <Dropdown.Item active={filter === 'inactive'} onClick={() => setFilter('inactive')}>
                Inactive Hotels
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Hotel Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Room Types & Prices</th>
            <th>Amenities</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHotels.map((hotel, index) => (
            <tr key={index} className={!hotel.active ? 'table-secondary' : ''}>
              <td>{hotel.hotelName}</td>
              <td>{hotel.city}</td>
              <td>
                <ShowMore text={hotel.address} />
              </td>
              <td>
                {Object.entries(hotel.roomTypes)
                  .filter(([, value]) => value.available)
                  .map(([type, value]) => (
                    <div key={type}>
                      {type}: ₹{value.price}/night
                    </div>
                  ))}
              </td>
              <td>
                {Object.entries(hotel.amenities)
                  .filter(([, value]) => value)
                  .map(([amenity]) => (
                    <div key={amenity}>{amenity}</div>
                  ))}
              </td>
              <td>
                <Badge bg={hotel.active ? 'success' : 'danger'}>{hotel.active ? 'Active' : 'Inactive'}</Badge>
              </td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => handleEdit(index)}>
                  <FaEdit />
                </Button>
                <Button
                  variant={hotel.active ? 'danger' : 'success'}
                  onClick={() => handleToggleActive(index)}
                  title={hotel.active ? 'Deactivate' : 'Activate'}
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
          <Modal.Title>{editIndex !== null ? 'Edit Hotel' : 'Add New Hotel'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Hotel Name</Form.Label>
              <Form.Control type="text" value={formData.hotelName} onChange={(e) => handleInputChange('hotelName', e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Hotel Active"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
              />
            </Form.Group>

            <h5 className="mt-4">Room Types & Prices</h5>
            {Object.entries(formData.roomTypes).map(([type, value]) => (
              <Form.Group key={type} className="mb-3">
                <Form.Label>{type.charAt(0).toUpperCase() + type.slice(1)} Room Price</Form.Label>
                <Form.Control type="number" value={value.price} onChange={(e) => handleRoomPriceChange(type, e.target.value)} />
              </Form.Group>
            ))}

            <h5 className="mt-4">Amenities</h5>
            <Row className="g-3">
              {Object.entries(formData.amenities).map(([amenity, checked]) => (
                <Col xs={6} md={4} key={amenity}>
                  <Button variant={checked ? 'primary' : 'outline-primary'} onClick={() => handleAmenityChange(amenity)} className="w-100">
                    {amenity}
                  </Button>
                </Col>
              ))}
            </Row>
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

export default Hotel;
