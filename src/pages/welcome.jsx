import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import HeroSection from "../components/heroSection.jsx"
import { supabase } from "../supabaseClient.js";

function Welcome() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
    </>
  );
}

export default Welcome;