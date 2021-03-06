import React, { useContext, useEffect } from "react";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContacFilter";
import Contacts from "../contacts/Contacts";
import AuthContext from "../../context/auth/authContext";
import { Link } from "react-router-dom";
const Home = () => {
	const authContext = useContext(AuthContext);

	useEffect(() => {
		authContext.loadUser();
		//eslint-disable-next-line
	}, []);

	return (
		<div className="grid-2">
			<div>
				<ContactForm />
			</div>
			<div>
				<ContactFilter />
				<Contacts />
			</div>
		</div>
	);
};

export default Home;

