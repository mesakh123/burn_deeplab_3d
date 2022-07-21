import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({ title, description, keywords }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />

		</Helmet>
	);
};

Title.defaultProps = {
	title: "Welcome to BEN",
	description: "We server the best AI model prediction in the work for burns and scalds",
	keywords: "AI, Deep Learning, burns, scalds",
};

export default Title;
