import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { FaHotel, FaPlane, FaMapMarkerAlt, FaBinoculars, FaSuitcase, FaLocationArrow } from 'react-icons/fa';

const DashDefault = () => {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [sightSeeing, setSightSeeing] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const storedHotels = localStorage.getItem('hotels');
    const storedFlights = localStorage.getItem('flights');
    const storedDestinations = localStorage.getItem('destinations');
    const storedSightSeeing = localStorage.getItem('sightSeeing');
    const storedPackages = localStorage.getItem('travelPackages');

    if (storedHotels) setHotels(JSON.parse(storedHotels));
    if (storedFlights) setFlights(JSON.parse(storedFlights));
    if (storedDestinations) setDestinations(JSON.parse(storedDestinations));
    if (storedSightSeeing) setSightSeeing(JSON.parse(storedSightSeeing));
    if (storedPackages) setPackages(JSON.parse(storedPackages));
  }, []);

  // Calculate statistics
  const stats = {
    hotels: {
      total: hotels.length,
      active: hotels.filter((h) => h.active).length,
      roomTypes: hotels.reduce((acc, hotel) => {
        Object.entries(hotel.roomTypes || {}).forEach(([type, data]) => {
          if (data.available) acc[type] = (acc[type] || 0) + 1;
        });
        return acc;
      }, {})
    },
    flights: {
      total: flights.length,
      active: flights.filter((f) => f.active).length,
      routes: [...new Set(flights.map((f) => `${f.departureAirport}-${f.arrivalAirport}`))].length
    },
    destinations: {
      total: destinations.length,
      sightSeeingCount: sightSeeing.length,
      regions: [...new Set(destinations.map((d) => d.region))].length
    },
    packages: {
      total: packages.length,
      active: packages.filter((p) => p.isActive).length,
      averagePrice: packages.length ? Math.round(packages.reduce((acc, pkg) => acc + Number(pkg.price), 0) / packages.length) : 0
    }
  };

  const dashboardCards = [
    {
      title: 'Total Hotels',
      amount: stats.hotels.total,
      icon: <FaHotel className="text-c-green f-30 m-r-5" />,
      active: stats.hotels.active,
      class: 'progress-c-theme'
    },
    {
      title: 'Total Flights',
      amount: stats.flights.total,
      icon: <FaPlane className="text-c-blue f-30 m-r-5" />,
      active: stats.flights.active,
      class: 'progress-c-theme2'
    },
    {
      title: 'Destinations',
      amount: stats.destinations.total,
      icon: <FaMapMarkerAlt className="text-c-red f-30 m-r-5" />,
      active: stats.destinations.sightSeeingCount,
      class: 'progress-c-theme'
    },
    {
      title: 'Travel Packages',
      amount: stats.packages.total,
      icon: <FaSuitcase className="text-c-purple f-30 m-r-5" />,
      active: stats.packages.active,
      class: 'progress-c-theme2'
    }
  ];

  const recentHotels = hotels.slice(-3).reverse();
  const recentFlights = flights.slice(-3).reverse();
  const recentPackages = packages.slice(-3).reverse();

  return (
    <React.Fragment>
      <Row>
        {dashboardCards.map((card, index) => (
          <Col key={index} xl={6} xxl={3}>
            <Card>
              <Card.Body>
                <h6 className="mb-4">{card.title}</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center">
                      {card.icon} {card.amount}
                    </h3>
                  </div>
                  <div className="col-3 text-end">
                    <p className="m-b-0">{Math.round((card.active / card.amount) * 100) || 0}%</p>
                  </div>
                </div>
                <div className="progress m-t-30" style={{ height: '7px' }}>
                  <div
                    className={`progress-bar ${card.class}`}
                    role="progressbar"
                    style={{ width: `${(card.active / card.amount) * 100 || 0}%` }}
                    aria-valuenow={(card.active / card.amount) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        <Col md={6} xl={8}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Recent Travel Packages</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover>
                <tbody>
                  {recentPackages.map((pkg, index) => (
                    <tr key={index} className={!pkg.isActive ? 'table-secondary' : ''}>
                      <td>
                        <h6 className="mb-1">{pkg.title}</h6>
                        <p className="m-0">
                          <FaLocationArrow className="me-1" />
                          {pkg.selectedDestinations?.join(', ')}
                        </p>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-muted">₹{pkg.price}</span>
                          <span className="text-muted">{pkg.totalDays} Days</span>
                        </div>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className={`fa fa-circle ${pkg.isActive ? 'text-c-green' : 'text-c-red'} f-10 m-r-15`} />
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </h6>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <Card.Title as="h5">Recent Hotels</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover>
                <tbody>
                  {recentHotels.map((hotel, index) => (
                    <tr key={index} className={!hotel.active ? 'table-secondary' : ''}>
                      <td>
                        <h6 className="mb-1">{hotel.hotelName}</h6>
                        <p className="m-0">{hotel.address}</p>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className={`fa fa-circle ${hotel.active ? 'text-c-green' : 'text-c-red'} f-10 m-r-15`} />
                          {hotel.active ? 'Active' : 'Inactive'}
                        </h6>
                      </td>
                      <td>
                        {Object.entries(hotel.roomTypes || {})
                          .filter(([, value]) => value.available)
                          .map(([type, value]) => (
                            <div key={type} className="text-muted">
                              {type}: ₹{value.price}
                            </div>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={4}>
          <Card className="card-event">
            <Card.Body>
              <div className="row align-items-center justify-content-center">
                <div className="col">
                  <h5 className="m-0">Recent Flights</h5>
                </div>
              </div>
              <div className="mt-3">
                {recentFlights.map((flight, index) => (
                  <div key={index} className="mb-2 pb-2 border-bottom">
                    <h6 className="m-0">
                      {flight.airlineName} - {flight.flightNumber}
                    </h6>
                    <p className="text-muted mb-0">
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </p>
                    <small className="text-muted">
                      Price: ₹{flight.flightPrice} | Duration: {flight.flightDuration}
                    </small>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h5 className="mb-4">Destination Overview</h5>
              <div className="row">
                <div className="col-6">
                  <div className="d-flex align-items-center mb-3">
                    <FaMapMarkerAlt className="text-c-red f-22 m-r-10" />
                    <div>
                      <h6 className="m-0">Total Regions</h6>
                      <p className="text-muted m-0">{stats.destinations.regions}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center mb-3">
                    <FaBinoculars className="text-c-blue f-22 m-r-10" />
                    <div>
                      <h6 className="m-0">Sightseeing</h6>
                      <p className="text-muted m-0">{stats.destinations.sightSeeingCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h6>Popular Destinations</h6>
                {destinations.slice(0, 3).map((dest, index) => (
                  <div key={index} className="d-flex align-items-center mt-3">
                    {dest.image && (
                      <img
                        src={dest.image}
                        alt={dest.name}
                        style={{ width: '40px', height: '40px', borderRadius: '4px', marginRight: '10px' }}
                      />
                    )}
                    <div>
                      <h6 className="mb-0">{dest.name}</h6>
                      <small className="text-muted">
                        {dest.region}, {dest.country}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
