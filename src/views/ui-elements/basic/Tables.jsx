import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';

const dummyData = [
  {
    id: 1,
    firstName: 'Niki',
    lastName: 'Sharma',
    email: 'nikisharma@gmail.com',
    phoneNumber: '9678452354',
    dateOfBirth: '11-02-1996',
    location: 'Ahmedabad',
    loyaltyPoints: 200,
    createdAt: '19-01-2025'
  },
  {
    id: 2,
    firstName: 'Manish',
    lastName: 'Bhati',
    email: 'manish@gmail.com',
    phoneNumber: '8798765789',
    dateOfBirth: '12-12-2003',
    location: 'Raoti',
    loyaltyPoints: 500,
    createdAt: '20-01-2025'
  },
  {
    id: 3,
    firstName: 'Priyanshi',
    lastName: 'Mehta',
    email: 'priyanshi@gmail.com',
    phoneNumber: '7896547896',
    dateOfBirth: '20-05-2004',
    location: 'Indore',
    loyaltyPoints: 100,
    createdAt: '20-01-2025'
  },
  {
    id: 4,
    firstName: 'Darshika',
    lastName: 'Bhati',
    email: 'bhatidarshika@gmail.com',
    phoneNumber: '7685942374',
    dateOfBirth: '10-09-2002',
    location: 'Ujjain',
    loyaltyPoints: 600,
    createdAt: '24-01-2025'
  },
  {
    id: 5,
    firstName: 'Kunal',
    lastName: 'Nathawat',
    email: 'kunalsingh11@gmail.com',
    phoneNumber: '8756789345',
    dateOfBirth: '29-09-2002',
    location: 'Jaipur',
    loyaltyPoints: 50,
    createdAt: '01-02-2025'
  },
  {
    id: 6,
    firstName: 'Kartik',
    lastName: 'Saini',
    email: 'kartiksaini@gmail.com',
    phoneNumber: '9678445645',
    dateOfBirth: '30-09-2002',
    location: 'Indore',
    loyaltyPoints: 10,
    createdAt: '01-02-2025'
  }
];

const Tables = () => {
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">User Details</Card.Title>
              {/* <span className="d-block m-t-5">
                    use props <code>hover</code> with <code>Table</code> component
                  </span> */}
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="text-nowrap">
                <thead>
                  <tr className="bg-light">
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Date of Birth</th>
                    <th>Location</th>
                    <th>Loyalty Points</th>
                    <th>User Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.map((user) => (
                    <tr key={user.id}>
                      <th scope="row">{user.id}</th>
                      <td>{`${user.firstName} ${user.lastName}`}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.dateOfBirth}</td>
                      <td>{user.location}</td>
                      <td>{user.loyaltyPoints}</td>
                      <td>{user.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Tables;
