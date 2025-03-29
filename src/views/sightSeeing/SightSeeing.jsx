import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
import { FaEdit, FaPowerOff, FaFilter } from 'react-icons/fa';
import PropTypes from 'prop-types';

const SightSeeing = () => {
  const [sightSeeing, setSightSeeing] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load sight seeing data from localStorage
  useEffect(() => {
    const storedSightSeeing = JSON.parse(localStorage.getItem('sightSeeing')) || [];
    setSightSeeing(storedSightSeeing);
  }, []);

  // Filter sightseeing based on active status
  const filteredSightSeeing = sightSeeing.filter((item) => {
    if (filter === 'active') return item.isActive;
    if (filter === 'inactive') return !item.isActive;
    const searchLower = searchQuery.toLowerCase();

    return searchQuery === '' || item.name.toLowerCase().includes(searchLower);
  });

  // Function to handle edit button click
  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  // Function to toggle active state
  const toggleActive = (index) => {
    const updatedData = [...sightSeeing];
    updatedData[index].isActive = !updatedData[index].isActive;
    setSightSeeing(updatedData);
    localStorage.setItem('sightSeeing', JSON.stringify(updatedData));
  };

  // Function to handle form submission to update sight seeing item
  const handleUpdate = (event) => {
    event.preventDefault();
    const updatedData = sightSeeing.map((item) => (item.name === currentItem.name ? currentItem : item));
    setSightSeeing(updatedData);
    localStorage.setItem('sightSeeing', JSON.stringify(updatedData));
    alert('SightSeeing updated successfully!!!');
    setShowEditModal(false);
  };

  // Function to handle input change in the modal
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const Description = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleDescription = () => setIsExpanded(!isExpanded);

    return (
      <div>
        {isExpanded ? (
          <div>
            <p>{description}</p>
            <Button variant="link" onClick={toggleDescription}>
              Show Less
            </Button>
          </div>
        ) : (
          <div>
            <p>{description.length > 50 ? description.substring(0, 50) + '...' : description}</p>
            <Button variant="link" onClick={toggleDescription} style={{ display: description.length > 50 ? 'inline' : 'none' }}>
              Show More
            </Button>
          </div>
        )}
      </div>
    );
  };

  Description.propTypes = {
    description: PropTypes.string.isRequired
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title as="h5">Sight Seeing List</Card.Title>
                <div className="d-flex justify-content-between align-items-center">
                  <Col md={6}>
                    <Form.Group className='mb-0'>
                      <Form.Control
                        type="text"
                        placeholder="Search SightSeeing..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-filter">
                      <FaFilter className="me-2" />
                      {filter === 'all' ? 'All Sights' : filter === 'active' ? 'Active Sights' : 'Inactive Sights'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item active={filter === 'all'} onClick={() => setFilter('all')}>
                        All Sights
                      </Dropdown.Item>
                      <Dropdown.Item active={filter === 'active'} onClick={() => setFilter('active')}>
                        Active Sights
                      </Dropdown.Item>
                      <Dropdown.Item active={filter === 'inactive'} onClick={() => setFilter('inactive')}>
                        Inactive Sights
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Entry Fee</th>
                    <th>Opening Hours</th>
                    <th>Best Time To Visit</th>
                    <th>Image</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSightSeeing.length > 0 ? (
                    filteredSightSeeing.map((item, index) => (
                      <tr key={index} className={!item.isActive ? 'table-secondary' : ''}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>
                          <Description description={item.description} />
                        </td>
                        <td>{item.entryFee ? `₹${item.entryFee}` : 'Free'}</td>
                        <td>{item.openingHour}</td>
                        <td>{item.bestTimeToVisit}</td>
                        <td>
                          {item.image ? <img src={item.image} alt="SightSeeing" style={{ width: '50px', height: '50px' }} /> : 'No Image'}
                        </td>
                        <td>
                          <Badge bg={item.isActive ? 'success' : 'danger'}>{item.isActive ? 'Active' : 'Inactive'}</Badge>
                        </td>
                        <td>
                          <Button variant="primary" className="me-2" onClick={() => handleEdit(item)}>
                            <FaEdit />
                          </Button>
                          <Button
                            variant={item.isActive ? 'danger' : 'success'}
                            onClick={() => toggleActive(index)}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <FaPowerOff />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No Sight Seeing Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      {currentItem && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Sight Seeing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={currentItem.name} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={currentItem.description} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formEntryFee">
                <Form.Label>Entry Fee</Form.Label>
                <Form.Control type="text" name="entryFee" value={currentItem.entryFee} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formOpeningHour">
                <Form.Label>Opening Hours</Form.Label>
                <Form.Control type="text" name="openingHour" value={currentItem.openingHour} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formBestTimeToVisit">
                <Form.Label>Best Time to Visit</Form.Label>
                <Form.Control type="text" name="bestTimeToVisit" value={currentItem.bestTimeToVisit} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" name="image" value={currentItem.image} onChange={handleInputChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default SightSeeing;
