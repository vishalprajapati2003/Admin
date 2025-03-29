import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ChatList from './ChatList';

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for currentUser in localStorage
    const currentUser = localStorage.getItem('currentUser');
    setIsLoggedIn(!!currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'yesterday'
    }
  ];

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        {isLoggedIn ? (
          <>
            <ListGroup.Item as="li" bsPrefix=" ">
              <Dropdown align="end">
                <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
                  <i className="feather icon-bell icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="notification notification-scroll">
                  <div className="noti-head">
                    <h6 className="d-inline-block m-b-0">Notifications</h6>
                    <div className="float-end">
                      <Link to="#" className="me-2">
                        mark as read
                      </Link>
                      <Link to="#">clear all</Link>
                    </div>
                  </div>
                  <PerfectScrollbar>
                    <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                      <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                        <p className="m-b-0">NEW</p>
                      </ListGroup.Item>
                      <ListGroup.Item as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img className="img-radius" src={avatar1} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>John Doe</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                30 min
                              </span>
                            </p>
                            <p>New ticket Added</p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                      <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                        <p className="m-b-0">EARLIER</p>
                      </ListGroup.Item>
                      {notiData.map((data, index) => {
                        return (
                          <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                            <Card
                              className="d-flex align-items-center shadow-none mb-0 p-0"
                              style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                            >
                              <img className="img-radius" src={data.image} alt="Generic placeholder" />
                              <Card.Body className="p-0">
                                <p>
                                  <strong>{data.name}</strong>
                                  <span className="n-time text-muted">
                                    <i className="icon feather icon-clock me-2" />
                                    {data.activity}
                                  </span>
                                </p>
                                <p>{data.details}</p>
                              </Card.Body>
                            </Card>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </PerfectScrollbar>
                  <div className="noti-footer">
                    <Link to="#">show all</Link>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </ListGroup.Item>
            <ListGroup.Item as="li" bsPrefix=" ">
              <Dropdown>
                <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
                  <i className="icon feather icon-mail" />
                </Dropdown.Toggle>
              </Dropdown>
            </ListGroup.Item>
            <ListGroup.Item as="li" bsPrefix=" ">
              <Link to="#" className="dropdown-item" onClick={handleLogout}>
                <i className="feather icon-log-out" /> Logout
              </Link>
            </ListGroup.Item>
          </>
        ) : (
          <ListGroup.Item as="li" bsPrefix=" ">
            <Link to="/login" className="dropdown-item" onClick={handleLogin}>
              <i className="feather icon-log-in" /> Login
            </Link>
          </ListGroup.Item>
        )}
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
