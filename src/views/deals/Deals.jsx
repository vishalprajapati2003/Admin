import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputGroup, Card, Dropdown, Badge } from 'react-bootstrap';
import { FaFilter, FaEdit, FaPowerOff } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPackagesModal, setShowPackagesModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [travelPackages, setTravelPackages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    dealTitle: '',
    description: '',
    dealCode: '',
    discountPercent: '',
    validUntil: new Date(),
    isActive: true
  });

  useEffect(() => {
    // Load deals from localStorage
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }

    // Load travel packages from localStorage
    const savedPackages = localStorage.getItem('travelPackages');
    if (savedPackages) {
      setTravelPackages(JSON.parse(savedPackages));
    }
  }, []);

  const handleStatusChange = (dealId) => {
    const updatedDeals = deals.map((deal) => {
      if (deal.dealId === dealId) {
        return { ...deal, isActive: !deal.isActive };
      }
      return deal;
    });
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
    alert(`Deal ${updatedDeals.find((d) => d.dealId === dealId).isActive ? 'activated' : 'deactivated'} successfully`);
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setSelectedPackages(deal.packages || []);
    setFormData({
      dealTitle: deal.dealTitle,
      description: deal.description,
      dealCode: deal.dealCode,
      discountPercent: deal.discountPercent,
      validUntil: new Date(deal.validUntil),
      isActive: deal.isActive
    });
    setImageUrl(deal.dealImage);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSave = {
      ...formData,
      dealImage: imageUrl,
      packages: selectedPackages, // This will now contain full package details
      validUntil: moment(formData.validUntil).format('YYYY-MM-DD')
    };

    let updatedDeals;
    if (editingDeal) {
      updatedDeals = deals.map((deal) => (deal.dealId === editingDeal.dealId ? { ...formDataToSave, dealId: editingDeal.dealId } : deal));
      alert('Deal updated successfully');
    } else {
      formDataToSave.dealId = `DEAL${Date.now()}`;
      updatedDeals = [...deals, formDataToSave];
      alert('Deal added successfully');
    }

    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDeal(null);
    setSelectedPackages([]);
    setImageUrl('');
    setFormData({
      dealTitle: '',
      description: '',
      discountPercent: '',
      validUntil: new Date(),
      isActive: true
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    return statusFilter === 'all' || (statusFilter === 'active' && deal.isActive) || (statusFilter === 'inactive' && !deal.isActive);
  });

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Deals Detail</h2>

        <div className="d-flex justify-content-start gap-2">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Deal
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-filter">
              <FaFilter className="me-2" />
              {statusFilter === 'all' ? 'All Deals' : statusFilter === 'active' ? 'Active Deals' : 'Inactive Deals'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                All Deals
              </Dropdown.Item>
              <Dropdown.Item active={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>
                Active Deals
              </Dropdown.Item>
              <Dropdown.Item active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>
                Inactive Deals
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Deal Title</th>
                <th>Description</th>
                <th>Deal Code</th>
                <th>Discount (%)</th>
                <th>Valid Until</th>
                <th>Deal Image</th>
                <th>Applied Packages</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.dealId} className={!deal.isActive ? 'table-secondary' : ''}>
                  <td>{deal.dealTitle}</td>
                  <td>{deal.description}</td>
                  <td>{deal.dealCode}</td>
                  <td>{deal.discountPercent}%</td>
                  <td>{moment(deal.validUntil).format('YYYY-MM-DD')}</td>
                  <td>{deal.dealImage && <img src={deal.dealImage} alt="Deal" style={{ width: 50, height: 50, objectFit: 'cover' }} />}</td>
                  <td>{deal.packages?.map((pkg) => pkg.title).join(', ')}</td>
                  <td>
                    <Badge bg={deal.isActive ? 'success' : 'danger'}>{deal.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td>
                    <Button variant="primary" className="me-2" onClick={() => handleEdit(deal)}>
                      <FaEdit />
                    </Button>
                    <Button
                      variant={deal.isActive ? 'danger' : 'success'}
                      onClick={() => handleStatusChange(deal.dealId)}
                      title={deal.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <FaPowerOff />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Deal Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.dealTitle}
                onChange={(e) => setFormData({ ...formData, dealTitle: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deal Code</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.dealCode}
                onChange={(e) => setFormData({ ...formData, dealCode: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                required
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valid Until</Form.Label>
              <DatePicker
                selected={formData.validUntil}
                onChange={(date) => setFormData({ ...formData, validUntil: date })}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deal Image</Form.Label>
              <InputGroup>
                <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              </InputGroup>
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2" style={{ maxWidth: 200 }} />}
            </Form.Group>

            <Button variant="outline-primary" className="mb-3" onClick={() => setShowPackagesModal(true)}>
              Select Travel Packages
            </Button>
            {selectedPackages.length > 0 && (
              <div className="mb-3">Selected Packages: {selectedPackages.map((pkg) => pkg.title).join(', ')}</div>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingDeal ? 'Update' : 'Add'} Deal
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showPackagesModal} onHide={() => setShowPackagesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Travel Packages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Selected Packages: {selectedPackages.length}</strong>
          </div>
          {travelPackages.map((pkg) => (
            <Form.Check
              key={pkg.id}
              type="checkbox"
              id={`package-${pkg.id}`}
              label={
                <div>
                  <strong>{pkg.title}</strong>
                  <br />
                  <small className="text-muted">
                    Price: ₹{pkg.price} | Duration: {pkg.totalDays} days | Region: {pkg.region}
                  </small>
                </div>
              }
              checked={selectedPackages.some((p) => p.id === pkg.id)}
              onChange={() => {
                setSelectedPackages((prev) => (prev.some((p) => p.id === pkg.id) ? prev.filter((p) => p.id !== pkg.id) : [...prev, pkg]));
              }}
              className="mb-3"
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center">
              <span>{selectedPackages.length} package(s) selected</span>
              <Button variant="secondary" onClick={() => setShowPackagesModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Deals;
