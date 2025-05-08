/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  FormGroup,
  Input,
  Label,
  Button,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import { NavLink, useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email_id: "",
    password: "",
    remember_me: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const login = async (email, password) => {
    if (!navigator.onLine) {
      throw new Error("No Internet Connection");
    }

    try {
      const response = await axios.post(
        serverEndPoint + "/login",
        { email, password },
        { timeout: 25000 }
      );

      const { token, user } = response.data;

      Cookies.set("authToken", token, { expires: 20 });
      Cookies.set("adminID", user.id, { expires: 20 });

      return { success: true, user };
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Request Timeout: Server took too long to respond");
      } else if (error.response) {
        if (error.response.status === 404) {
          throw new Error("No Data Found");
        } else if (error.response.status === 500) {
          throw new Error("Internal Server Error");
        }
      } else if (error.request) {
        throw new Error("Server Down or No Response from Server");
      }

      throw new Error(error.message || "Login Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formElement = formRef.current;
    if (formElement && !formElement.checkValidity()) {
      formElement.classList.add("was-validated");
      e.stopPropagation();
      return;
    }

    setLoading(true); // Set loading to true when the button is clicked
    try {
      const result = await login(formData.email_id, formData.password);

      if (result.success) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Logged in successfully",
        });

        console.log("User logged in:", result.user);
        setTimeout(() => {
          navigate("/dashboard/branches");
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false); // Set loading to false after the process is complete
    }
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} className="p-0">
            <div className="login-form-container">
              <div className="mb-4">
                <Link className="logo d-inline-block" to="">
                  <img src="/logo_new.png" width="350" alt="#" />
                </Link>
              </div>
              <div className="form_container">
                <form
                  className="app-form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="mb-3 text-center">
                    <h3>Login to your Account</h3>
                    <p className="f-s-12 text-secondary mt-2">
                      Experience the all-new KASP Dashboard, designed to provide
                      you with enhanced precision and seamless control over your
                      operations.
                    </p>
                  </div>
                  <div className="mb-3">
                    <FormGroup>
                      <Label for="validationCustom01">Email ID</Label>
                      <Input
                        type="email"
                        id="validationCustom01"
                        name="email_id"
                        value={formData.email_id}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please provide a valid email id.
                      </div>
                    </FormGroup>
                  </div>
                  <div className="mb-3">
                    <FormGroup>
                      <Label for="validationCustomPassword">Password</Label>
                      <Input
                        type="password"
                        id="validationCustomPassword"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please provide a valid password.
                      </div>
                    </FormGroup>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="formCheck1"
                      name="remember_me"
                      checked={formData.remember_me}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="formCheck1">
                      remember me
                    </label>
                  </div>
                  <div className="flex justify-content-center">
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner size="sm" /> : "Login"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLoginPage;
