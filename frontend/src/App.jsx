// Install React and required libraries
// npm install react react-dom react-bootstrap bootstrap react-router-dom

import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, Button, Table, Modal, Form, Alert } from "react-bootstrap";
import { ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { toast } from 'react-toastify';


const App = () => {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Event Dashboard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events">Event Management</Nav.Link>
            <Nav.Link as={Link} to="/attendees">Attendee Management</Nav.Link>
            <Nav.Link as={Link} to="/tasks">Task Tracker</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/events" element={<EventManagement />} />
          <Route path="/attendees" element={<AttendeeManagement />} />
          <Route path="/tasks" element={<TaskTracker />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </Container>
    </Router>
  );
};

const Home = () => (
  <div>
    <h1>Welcome to the Event Dashboard</h1>
    <p>Use the navigation bar to manage events, attendees, and tasks.</p>
  </div>
);

const NotFound = () => (
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Go back to Home</Link>
  </div>
);

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', location: '', date: '' });
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);


  // Fetch events from API (Read operation)
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
  };

  useEffect(() => {
    fetchEvents(); // Initial fetch
  }, []);

  // Add new event (Create operation)
  const addEvent = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        toast.success('Event added successfully!');
        setNewEvent({ name: '', description: '', location: '', date: '' });
        setShowAddModal(false);
        fetchEvents(); // Re-fetch events
      } else {
        toast.error('Failed to add event');
      }
    } catch (error) {
      toast.error('Error adding event');
    }
  };

  // Delete event (Delete operation)
  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${id}`, { method: 'DELETE' });

      if (response.ok) {
        toast.error('Event deleted successfully!');
        fetchEvents(); // Re-fetch events
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      toast.error('Error deleting event');
    }
  };

  // Open edit dialog for updating an event
  const openEditDialog = (event) => {
    setCurrentEvent({ ...event });
    setIsEditDialogOpen(true);
  };

  // Update event (Update operation)
  const updateEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${currentEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEvent),
      });

      if (response.ok) {
        toast.success('Event updated successfully!');
        setCurrentEvent(null);
        setIsEditDialogOpen(false);
        fetchEvents(); // Re-fetch events
      } else {
        toast.error('Failed to update event');
      }
    } catch (error) {
      toast.error('Error updating event');
    }
  };

  return (
    <div>
      <h3>Event Management</h3>
      <Button onClick={() => setShowAddModal(true)}>Add Event</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.location}</td>
              <td>{event.date}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => openEditDialog(event)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => deleteEvent(event._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addEvent}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={isEditDialogOpen} onHide={() => setIsEditDialogOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEvent && (
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEvent.name}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEvent.description}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEvent.location}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentEvent.date}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateEvent}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AttendeeManagement = () => {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchAttendees(); // Fetch attendees when the component loads
  }, []);

  // Fetch attendees from API (Read operation)
  const fetchAttendees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/attendees');
      setAttendees(response.data.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  // Add a new attendee (Create operation)
  const addAttendee = async () => {
    if (!newAttendee.name.trim() || !newAttendee.email.trim()) {
      alert('Both name and email are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/attendees', newAttendee);
      setAttendees([...attendees, response.data.data]);
      setNewAttendee({ name: '', email: '' });
    } catch (error) {
      console.error('Error adding attendee:', error);
    }
  };

  // Remove an attendee (Delete operation)
  const removeAttendee = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/attendees/${id}`);
      setAttendees(attendees.filter((attendee) => attendee._id !== id));
    } catch (error) {
      console.error('Error deleting attendee:', error);
    }
  };

  return (
    <div>
      <h3>Attendee Management</h3>

      {/* Input fields for adding a new attendee */}
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Attendee Name"
            value={newAttendee.name}
            onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
            className="mb-2"
          />
          <Form.Control
            type="email"
            placeholder="Attendee Email"
            value={newAttendee.email}
            onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
          />
        </Form.Group>
        <Button className="mt-2" onClick={addAttendee}>
          Add Attendee
        </Button>
      </Form>

      {/* List of attendees */}
      <ListGroup className="mt-3">
        {attendees.map((attendee) => (
          <ListGroup.Item key={attendee._id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{attendee.name}</strong> - {attendee.email}
            </div>
            <Button variant="danger" size="sm" onClick={() => removeAttendee(attendee._id)}>
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    deadline: '',
    assignedAttendee: [], // Changed from assignedAttendees to assignedAttendee
    status: 'Pending',
  });
  const [attendees, setAttendees] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch tasks from API (Read operation)
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data.task);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch attendees from API
  const fetchAttendees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/attendees');
      setAttendees(response.data.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAttendees();
  }, []);

  // Add a new task (Create operation)
  const addTask = async () => {
    if (!newTask.name || !newTask.deadline || newTask.assignedAttendees.length === 0) {
      alert('All fields are required and at least one attendee must be assigned!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/tasks', newTask);
      setTasks([...tasks, response.data.data]);
      setNewTask({ name: '', deadline: '', assignedAttendee: [], status: 'Pending' });
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete a task (Delete operation)
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.error('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Open edit dialog for updating a task
  const openEditDialog = (task) => {
    setCurrentTask(task);
    setIsEditDialogOpen(true);
  };

  // Update a task (Update operation)
  const updateTask = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/tasks/${currentTask._id}`, currentTask);
      const updatedTasks = tasks.map((task) =>
        task._id === response.data.data._id ? response.data.data : task
      );
      setTasks(updatedTasks);
      setCurrentTask(null);
      setIsEditDialogOpen(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle change for assigning attendees
  const handleAssignedAttendeesChange = (e) => {
    const selectedAttendees = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewTask({ ...newTask, assignedAttendee: selectedAttendees });
  };

  return (
    <div>
      <h3>Task Tracker</h3>
      <Form>
        <Form.Group>
          <Form.Label>Task Name</Form.Label>
          <Form.Control
            type="text"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Assign Attendees</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={newTask.assignedAttendees}
            onChange={handleAssignedAttendeesChange}
          >
            <option value="">Select Attendees</option>
            {attendees.map((attendee) => (
              <option key={attendee._id} value={attendee._id}>
                {attendee.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button className="mt-2" onClick={addTask}>
          Add Task
        </Button>
      </Form>

      {/* Task List */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Deadline</th>
            <th>Assigned Attendees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td>{task.deadline}</td>
              <td>
                {/* Map attendee IDs to attendee names */}
                {task.assignedAttendees
                  ? task.assignedAttendees
                    .map(
                      (attendeeId) =>
                        attendees.find((attendee) => attendee._id === attendeeId)?.name
                    )
                    .join(', ')
                  : 'No attendees assigned'}
              </td>
              <td>{task.status}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => openEditDialog(task)}>
                  Edit
                </Button>{' '}
                <Button size="sm" variant="danger" onClick={() => deleteTask(task._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Task Dialog */}
      {isEditDialogOpen && (
        <div>
          <h4>Edit Task</h4>
          <Form>
            <Form.Group>
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={currentTask.name}
                onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={currentTask.deadline}
                onChange={(e) => setCurrentTask({ ...currentTask, deadline: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Assign Attendees</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={currentTask.assignedAttendees}
                onChange={(e) =>
                  setCurrentTask({
                    ...currentTask,
                    assignedAttendee: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                <option value="">Select Attendees</option>
                {attendees.map((attendee) => (
                  <option key={attendee._id} value={attendee._id}>
                    {attendee.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button className="mt-2" onClick={updateTask}>
              Update Task
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};


export default App;
