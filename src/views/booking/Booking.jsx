import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Table, Form, Row, Col, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const dummyBookings = [
  {
    BookingId: 'B001',
    UserId: 'U1001',
    PackageId: '1740833920874',
    BookingDate: '2024-12-11',
    PackageStartDate: '2025-03-02',
    NumberOfPeople: 2,
    TotalAdults: 2,
    TotalChildrens: 0,
    TotalInfants: 0,
    Email: 'aaravsharma@gmail.com',
    PhoneNumber: '+91 9876543210',
    Address: '123 MG Road, Mumbai, Maharashtra, India',
    TotalPrice: 5000,
    Status: 'Confirmed'
  },
  {
    BookingId: 'B002',
    UserId: 'U1002',
    PackageId: '1740996569313',
    BookingDate: '2024-12-30',
    PackageStartDate: '2025-03-09',
    NumberOfPeople: 4,
    TotalAdults: 2,
    TotalChildrens: 2,
    TotalInfants: 0,
    Email: 'rahulkapoor@gmail.com',
    PhoneNumber: '+91 9988776655',
    Address: '78 Brigade Road, Bangalore, Karnataka, India',
    TotalPrice: 9000,
    Status: 'Pending'
  },
  {
    BookingId: 'B003',
    UserId: 'U1003',
    PackageId: '1741149471588',
    BookingDate: '2024-02-24',
    PackageStartDate: '2025-03-04',
    NumberOfPeople: 1,
    TotalAdults: 1,
    TotalChildrens: 0,
    TotalInfants: 0,
    Email: 'rohanbose@gmail.com',
    PhoneNumber: '+91 9234567890',
    Address: '88 Park Street, Kolkata, West Bengal, India',
    TotalPrice: 2500,
    Status: 'Cancelled'
  },
  {
    BookingId: 'B004',
    UserId: 'U1004',
    PackageId: '1741150312530',
    BookingDate: '2024-03-14',
    PackageStartDate: '2025-03-25',
    NumberOfPeople: 3,
    TotalAdults: 2,
    TotalChildrens: 0,
    TotalInfants: 1,
    Email: 'amitjoshi@gmail.com',
    PhoneNumber: '+91 9567890123',
    Address: '19 Civil Lines, Ahmedabad, Gujarat, India',
    TotalPrice: 7500,
    Status: 'Confirmed'
  }
];

const dummyPassengers = [
  {
    PassengerId: 'P001',
    BookingId: 'B001',
    FirstName: 'Aarav',
    LastName: 'Sharma',
    DateOfBirth: '1990-05-15',
    Gender: 'Male',
    Type: 'Adult'
  },
  {
    PassengerId: 'P002',
    BookingId: 'B001',
    FirstName: 'Priya',
    LastName: 'Sharma',
    DateOfBirth: '1992-08-22',
    Gender: 'Female',
    Type: 'Adult'
  },
  {
    PassengerId: 'P003',
    BookingId: 'B002',
    FirstName: 'Rahul',
    LastName: 'Kapoor',
    DateOfBirth: '1988-03-10',
    Gender: 'Male',
    Type: 'Adult'
  },
  {
    PassengerId: 'P004',
    BookingId: 'B002',
    FirstName: 'Anjali',
    LastName: 'Kapoor',
    DateOfBirth: '1991-12-05',
    Gender: 'Female',
    Type: 'Adult'
  },
  {
    PassengerId: 'P005',
    BookingId: 'B002',
    FirstName: 'Arjun',
    LastName: 'Kapoor',
    DateOfBirth: '2015-06-18',
    Gender: 'Male',
    Type: 'Child'
  },
  {
    PassengerId: 'P006',
    BookingId: 'B002',
    FirstName: 'Meera',
    LastName: 'Kapoor',
    DateOfBirth: '2018-09-25',
    Gender: 'Female',
    Type: 'Child'
  },
  {
    PassengerId: 'P007',
    BookingId: 'B003',
    FirstName: 'Rohan',
    LastName: 'Bose',
    DateOfBirth: '2000-07-19',
    Gender: 'Male',
    Type: 'Adult'
  },
  {
    PassengerId: 'P008',
    BookingId: 'B004',
    FirstName: 'Deepak',
    LastName: 'RJoshi',
    DateOfBirth: '2024-11-30',
    Gender: 'Male',
    Type: 'Infants'
  },
  {
    PassengerId: 'P009',
    BookingId: 'B004',
    FirstName: 'Meera',
    LastName: 'Joshi',
    DateOfBirth: '1994-02-28',
    Gender: 'Female',
    Type: 'Adult'
  },
  {
    PassengerId: 'P010',
    BookingId: 'B004',
    FirstName: 'Amit',
    LastName: 'Joshi',
    DateOfBirth: '1987-12-03',
    Gender: 'Male',
    Type: 'Adult'
  }
];

const getStatusBadgeVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

const PackageTooltip = ({ packageId }) => {
  const [packageDetails, setPackageDetails] = useState(null);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem('travelPackages');
      if (!rawData) {
        console.log('No travel packages found in localStorage');
        return;
      }

      const travelPackages = JSON.parse(rawData);
      const matchedPackage = travelPackages.find((pkg) => String(pkg.id) === String(packageId));

      if (matchedPackage) {
        setPackageDetails(matchedPackage);
      }
    } catch (error) {
      console.error('Error processing travel packages:', error);
    }
  }, [packageId]);

  if (!packageDetails) {
    return <span>{packageId}</span>;
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-${packageId}`}>
          <div className="text-start">
            <strong>Package Details:</strong>
            <br />
            Name: {packageDetails.title}
            <br />
            Duration: {packageDetails.totalDays} Days
            <br />
            Price per person: ₹{packageDetails.price}
          </div>
        </Tooltip>
      }
    >
      <span style={{ cursor: 'pointer', color: '#0d6efd' }}>{packageId}</span>
    </OverlayTrigger>
  );
};

PackageTooltip.propTypes = {
  packageId: PropTypes.string.isRequired
};

const PassengerModal = ({ show, onHide, bookingId }) => {
  const passengers = dummyPassengers.filter((p) => p.BookingId === bookingId);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Passenger Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((passenger) => (
              <tr key={passenger.PassengerId}>
                <td>
                  {passenger.FirstName} {passenger.LastName}
                </td>
                <td>{passenger.DateOfBirth}</td>
                <td>{passenger.Gender}</td>
                <td>{passenger.Type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PassengerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  bookingId: PropTypes.string.isRequired
};

const BookingRow = ({ booking }) => {
  const [packageDetails, setPackageDetails] = useState(null);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem('travelPackages');
      if (!rawData) return;

      const travelPackages = JSON.parse(rawData);
      const matchedPackage = travelPackages.find((pkg) => String(pkg.id) === String(booking.PackageId));

      if (matchedPackage) {
        setPackageDetails(matchedPackage);
      }
    } catch (error) {
      console.error('Error processing travel packages:', error);
    }
  }, [booking.PackageId]);

  const calculatedTotalPrice = packageDetails ? packageDetails.price * booking.NumberOfPeople : booking.TotalPrice;

  return (
    <>
      <tr key={booking.BookingId}>
        <td>{booking.BookingId}</td>
        <td>{booking.UserId}</td>
        <td>
          <PackageTooltip packageId={booking.PackageId} />
        </td>
        <td>{booking.BookingDate}</td>
        <td>{booking.PackageStartDate}</td>
        <td>
          <Button variant="link" className="p-0 text-decoration-none" onClick={() => setShowPassengerModal(true)}>
            {booking.NumberOfPeople}
          </Button>
        </td>
        <td>{booking.TotalAdults}</td>
        <td>{booking.TotalChildrens}</td>
        <td>{booking.TotalInfants}</td>
        <td>{booking.Email}</td>
        <td>{booking.PhoneNumber}</td>
        <td>{booking.Address}</td>
        <td>₹{calculatedTotalPrice}</td>
        <td>
          <span className={`badge bg-${getStatusBadgeVariant(booking.Status)}`}>{booking.Status}</span>
        </td>
      </tr>
      <PassengerModal show={showPassengerModal} onHide={() => setShowPassengerModal(false)} bookingId={booking.BookingId} />
    </>
  );
};

BookingRow.propTypes = {
  booking: PropTypes.shape({
    BookingId: PropTypes.string.isRequired,
    UserId: PropTypes.string.isRequired,
    PackageId: PropTypes.string.isRequired,
    BookingDate: PropTypes.string.isRequired,
    PackageStartDate: PropTypes.string.isRequired,
    NumberOfPeople: PropTypes.number.isRequired,
    TotalAdults: PropTypes.number.isRequired,
    TotalChildrens: PropTypes.number.isRequired,
    TotalInfants: PropTypes.number.isRequired,
    Email: PropTypes.string.isRequired,
    PhoneNumber: PropTypes.string.isRequired,
    Address: PropTypes.string.isRequired,
    TotalPrice: PropTypes.number.isRequired,
    Status: PropTypes.string.isRequired
  }).isRequired
};

const Booking = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = dummyBookings.filter((booking) => {
    const matchesStatus = statusFilter === 'all' || booking.Status.toLowerCase() === statusFilter.toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      booking.BookingId.toLowerCase().includes(searchLower) ||
      booking.UserId.toLowerCase().includes(searchLower) ||
      booking.Email.toLowerCase().includes(searchLower) ||
      booking.PhoneNumber.toLowerCase().includes(searchLower) ||
      booking.Address.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group>
            <Form.Label>Search Bookings</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by Booking ID, User ID, Email, Phone, or Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Package ID</th>
            <th>Booking Date</th>
            <th>Package Start Date</th>
            <th>Number of People</th>
            <th>Adults</th>
            <th>Childrens</th>
            <th>Infants</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <BookingRow key={booking.BookingId} booking={booking} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Booking;
