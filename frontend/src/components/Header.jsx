import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { GiHouse } from "react-icons/gi";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {


	return (
		<div>
		<Navbar
				sticky="top"
				bg="dark"
				variant="dark"
				expand="lg"
				collapseOnSelect
			>
				<Container fluid>
					<LinkContainer to="/">
						<Navbar.Brand>
							Burns Estimation Network
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse
						id="basic-navbar-nav"
					>
						<Nav className="me-auto">
							<LinkContainer to="/">
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/about">
								<Nav.Link>About</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/upload">
								<Nav.Link>Upload</Nav.Link>
							</LinkContainer>

						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>

	);
};

export default Header;
