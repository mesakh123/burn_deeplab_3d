import React from 'react'
import { Col, Container, Row } from "react-bootstrap";
import { FaHeartBroken, FaSadTear } from "react-icons/fa";

function NotFound() {
    return (
		<Container>
			<Row className='pb-5'>
				<Col className="text-center">
					<h1 className="notfound">404 Not Found</h1>
					<FaHeartBroken className="broken-heart" />
					<FaSadTear className="sad-tear" />
				</Col>
			</Row>
		</Container>
	);
}

export default NotFound
