const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Contact = require("../models/Contacts");
const router = express.Router();

router.get("/", auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(contacts);
	} catch (error) {
		console.error(error.msg);
		res.status(500).send("Server error");
	}
});

router.post("/", auth, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const newContact = new Contact({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			type: req.body.type,
			user: req.user.id,
		});

		const contact = await newContact.save();

		res.json(contact);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal Server Error");
		console.error("Server Error");
	}
});

router.put("/:id", auth, async (req, res) => {
	const id = req.params.id;
	const { name, email, phone, type } = req.body;

	let contactFields = {};

	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		let contact = await Contact.findById(id);
		if (!contact) {
			return res.status(400).json({ msg: "No Contact Found" });
		}

		if (contact.user.toString() !== req.user.id) {
			return res.status(404).json({ msg: "UnAuthorized" });
		}

		contact = await Contact.findByIdAndUpdate(
			id,
			{ $set: contactFields },
			{ new: true },
		);

		res.json(contact);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

router.delete("/:id", auth, async (req, res) => {
	const id = req.params.id;
	try {
		const contact = await Contact.findById(id);
		if (!contact) return res.status(400).send({ msg: "Contact Not Found" });

		if (contact.user.toString() !== req.user.id) {
			return res.status(400).send({ msg: "UnAuthorized" });
		}

		await Contact.findByIdAndRemove(id);
		res.json({ msg: "Contact Deleted Successfully" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
