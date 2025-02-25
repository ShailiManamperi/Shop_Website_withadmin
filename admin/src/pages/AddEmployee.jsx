import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css";

const AddEmployee = ({ onAddEmployee }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        nic: "",
        dob: "",
        contact: "",
        job: "",
        basic: "",
        target: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "basic" || name === "target" ? parseFloat(value) || "" : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.nic || !formData.dob || !formData.contact || !formData.job || !formData.basic) {
            toast.error("Please fill out all required employee details.");
            return;
        }

        if (formData.job === "Sales" && !formData.target) {
            toast.error("Please enter sales team details.");
            return;
        }

        try {
            const employeeData = {
                name: formData.name,
                address: formData.address,
                nic: formData.nic,
                dob: formData.dob,
                contact: formData.contact,
                job: formData.job,
                basic: formData.basic,
                target: formData.target,
            };

            const response = await fetch("http://localhost:5001/api/admin/main/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employeeData),
            });

            // 👉 Debugging: Log the raw response before parsing JSON
            const textResponse = await response.text();
            console.log("Raw Response:", textResponse);

            // 👉 Parse JSON if response is valid
            const result = JSON.parse(textResponse);

            if (!response.ok) {
                throw new Error(result.message || "Failed to add employee.");
            }

            toast.success(result.message);
            onAddEmployee(employeeData);
            handleClear();
        } catch (error) {
            console.error("Error submitting employee data:", error);
            toast.error(error.message);
        }
    };


    const handleClear = () => {
        setFormData({
            E_Id: "",
            name: "",
            address: "",
            nic: "",
            dob: "",
            contact: "",
            job: "",
            basic: "",
            target: "",
        });
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Add New Employee</h3>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Address</Label>
                            <Input type="textarea" name="address" id="address" value={formData.address} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="nic">NIC</Label>
                            <Input type="text" name="nic" id="nic" value={formData.nic} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="dob">Date of Birth</Label>
                            <Input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contact">Contact</Label>
                            <Input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="job">Job Role</Label>
                            <Input type="select" name="job" id="job" value={formData.job} onChange={handleChange} required>
                                <option value="">Select Job Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Sales">Sales</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="basic">Basic Salary</Label>
                            <Input type="number" name="basic" id="basic" value={formData.basic} onChange={handleChange} required />
                        </FormGroup>
                        {formData.job === "Sales" && (
                            <>
                                <FormGroup>
                                    <Label for="target">Sales Target</Label>
                                    <Input type="number" name="target" id="target" value={formData.target} onChange={handleChange} required />
                                </FormGroup>
                            </>
                        )}
                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>Add Employee</Button>
                            </Col>
                            <Col md="6">
                                <Button type="button" color="danger" block onClick={handleClear}>Clear</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEmployee;
