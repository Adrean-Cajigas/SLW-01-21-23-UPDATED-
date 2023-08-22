import React from "react";
import "../../pages/explore-services/main-page.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../../components/loading-screen.css";
import "./service-filter.css";
import ServicesDisplay from "../../components/servicesDisplay/serviceDisplay.js";
import ServiceDropdown from "./mobile-service-dropdown";

function Services(props) {
  return (
    <div>
      <NavBar isFixedPage={false} />
      <ServiceDropdown></ServiceDropdown>
      <ServicesDisplay  startingfilter={props.startingfilter}/>
      <Footer />
    </div>
  );
}

export default Services;
