"use client";
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Calendar, Clock, MapPin } from "lucide-react";

// Styled Components
const Section = styled.section`
  padding: 4rem 1.5rem;
  background-color: white;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  max-width: 768px;
  margin: 0 auto;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const FilterBar = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const FilterButton = styled.button.attrs((props) => ({
  "data-active": props.$active,
}))`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  color: ${(props) => (props.$active ? "#2563eb" : "#6b7280")};
  border-bottom: ${(props) => (props.$active ? "2px solid #2563eb" : "none")};
  transition: all 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    background-color: #f9fafb;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  td {
    padding: 1rem 1.5rem;
    vertical-align: middle;
  }
`;

const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const Icon = styled.div`
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  margin-right: 0.5rem;
`;

const DateTimeRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const RouteColumn = styled.div`
  display: flex;
  align-items: flex-start;

  ${Icon} {
    margin-top: 0.125rem;
  }
`;

const TextMuted = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;

  ${(props) =>
    props.status === "completed" &&
    `
    background-color: #dcfce7;
    color: #166534;
  `}

  ${(props) =>
    props.status === "upcoming" &&
    `
    background-color: #dbeafe;
    color: #1e40af;
  `}
`;

const DetailsButton = styled.button`
  color: #2563eb;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #1d4ed8;
  }
`;

const NoTripsMessage = styled.td`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
`;

const TripHistory = () => {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState("all");

  // Sample trip data
  const trips = [
    {
      id: 1,
      date: "2023-08-15",
      time: "14:30",
      pickup: "123 Business Ave.",
      destination: "Airport Terminal 2",
      driver: "Alex Johnson",
      vehicle: "Executive Sedan",
      status: "completed",
      price: 75.8,
    },
    {
      id: 2,
      date: "2023-08-22",
      time: "09:15",
      pickup: "Grand Hotel",
      destination: "Convention Center",
      driver: "Samantha Lee",
      vehicle: "Premium SUV",
      status: "completed",
      price: 92.5,
    },
    {
      id: 3,
      date: "2023-09-03",
      time: "18:45",
      pickup: "Office Park Tower",
      destination: "Residential Heights",
      driver: "Michael Brown",
      vehicle: "Executive Sedan",
      status: "completed",
      price: 65.2,
    },
    {
      id: 4,
      date: "2023-09-10",
      time: "11:00",
      pickup: "Downtown Plaza",
      destination: "Riverfront Restaurant",
      driver: "Olivia Wilson",
      vehicle: "Luxury Van",
      status: "upcoming",
      price: 110.0,
    },
  ];

  // Filter trips based on status
  const filteredTrips =
    filter === "all" ? trips : trips.filter((trip) => trip.status === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add("animate-fade-up");
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <Section>
      <Container ref={sectionRef}>
        <Header>
          <Title>Trip History</Title>
          <Subtitle>View and manage your past and upcoming trips.</Subtitle>
        </Header>

        <Card>
          <FilterBar>
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All Trips
            </FilterButton>
            <FilterButton
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </FilterButton>
            <FilterButton
              active={filter === "upcoming"}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </FilterButton>
          </FilterBar>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <DateTimeRow>
                            <Icon as={Calendar} />
                            <span>{trip.date}</span>
                          </DateTimeRow>
                          <DateTimeRow>
                            <Icon as={Clock} />
                            <TextMuted>{trip.time}</TextMuted>
                          </DateTimeRow>
                        </div>
                      </td>
                      <td>
                        <RouteColumn>
                          <Icon as={MapPin} />
                          <div>
                            <div>{trip.pickup}</div>
                            <TextMuted>{trip.destination}</TextMuted>
                          </div>
                        </RouteColumn>
                      </td>
                      <td>{trip.driver}</td>
                      <td>{trip.vehicle}</td>
                      <td style={{ fontWeight: 500 }}>
                        ${trip.price.toFixed(2)}
                      </td>
                      <td>
                        <StatusBadge status={trip.status}>
                          {trip.status === "completed"
                            ? "Completed"
                            : "Upcoming"}
                        </StatusBadge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <DetailsButton>
                          <a href="/trips">Details</a>
                        </DetailsButton>
                      </td>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <NoTripsMessage colSpan="7">
                      No trips found for the selected filter.
                    </NoTripsMessage>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Section>
  );
};

export default TripHistory;
