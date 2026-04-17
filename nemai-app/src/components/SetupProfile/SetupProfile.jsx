import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./SetupProfile.css";

// Mock data สำหรับ API ในอนาคต
const mockChronicConditions = [
  "None",
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Heart Disease",
  "High Cholesterol",
  "Thyroid Disorder"
];

export default function SetupProfile() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 2; // กำหนดจำนวน Step ทั้งหมดไว้ก่อน (สามารถเปลี่ยนได้เมื่อมี Step เพิ่ม)
  const [formData, setFormData] = useState({
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    // Step 2 Data
    chronicConditions: [],
    hasDrugAllergies: null,
    drugAllergies: "",
    hasFoodAllergies: null,
    foodAllergies: "",
    hasSevereAllergy: null,
    severeAllergy: "",
    hasActivePrescription: null,
    activePrescription: ""
  });
  const [isLocating, setIsLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleChronicCondition = (condition) => {
    setFormData((prev) => {
      if (condition === "None") {
        return { ...prev, chronicConditions: prev.chronicConditions.includes("None") ? [] : ["None"] };
      }
      const newConditions = prev.chronicConditions.includes(condition)
        ? prev.chronicConditions.filter((c) => c !== condition)
        : [...prev.chronicConditions.filter((c) => c !== "None"), condition];
      return { ...prev, chronicConditions: newConditions };
    });
  };

  const handleBooleanChange = (textField, boolField, value) => {
    setFormData((prev) => ({
      ...prev,
      [boolField]: value,
      ...(value === false ? { [textField]: "" } : {}) // ล้างข้อความทิ้งถ้าเปลี่ยนใจเลือก No
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else {
      console.log("Final Setup Data:", formData); // TODO: นำข้อมูล formData ไปยิง API บันทึก Profile ต่อที่นี่
      // เมื่อ Setup Profile เสร็จแล้ว ให้เด้งกลับไปหน้า Chat
      navigate("/", { replace: true });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ฟังก์ชันดึงที่อยู่ปัจจุบันผ่าน Geolocation และ OpenStreetMap API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // ใช้ Nominatim API (ฟรี) ในการแปลงพิกัดเป็นที่อยู่
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          if (data && data.address) {
            const { address } = data;
            setFormData((prev) => ({
              ...prev,
              streetAddress: address.road || address.pedestrian || prev.streetAddress,
              city: address.city || address.town || address.village || address.county || prev.city,
              state: address.state || prev.state,
              postalCode: address.postcode || prev.postalCode,
              country: address.country || prev.country
            }));
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("Could not fetch address details automatically.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location. Please allow location access.");
        setIsLocating(false);
      }
    );
  };

  // ตรวจสอบว่าฟิลด์ที่จำเป็นใน Step 1 ถูกกรอกครบหรือยัง
  const isStep1Valid =
    formData.streetAddress.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.country.trim() !== "";

  // ตรวจสอบว่าฟิลด์ที่จำเป็นใน Step 2 ถูกกรอกครบหรือยัง
  const isStep2Valid =
    formData.chronicConditions.length > 0 &&
    formData.hasDrugAllergies !== null && (!formData.hasDrugAllergies || formData.drugAllergies.trim() !== "") &&
    formData.hasFoodAllergies !== null && (!formData.hasFoodAllergies || formData.foodAllergies.trim() !== "") &&
    formData.hasSevereAllergy !== null && (!formData.hasSevereAllergy || formData.severeAllergy.trim() !== "") &&
    formData.hasActivePrescription !== null && (!formData.hasActivePrescription || formData.activePrescription.trim() !== "");

  // คำนวณเปอร์เซ็นต์ความคืบหน้า
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="setup-profile-page">
      <motion.div
        className="setup-profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="setup-header">
          {/* Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p className="step-indicator">STEP {step} &bull; {progressPercent}% COMPLETED</p>
          <h1 className="setup-title">{step === 1 ? "Where are you located?" : "Personal Health Data (PHD)"}</h1>
        </div>

        <form onSubmit={handleNext} className="setup-form">
          {step === 1 && (
            <motion.div
              className="form-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="location-action">
                <button type="button" className="location-btn" onClick={handleGetLocation} disabled={isLocating}>
                  {isLocating ? (
                    <>
                      <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
                      </svg>
                      Locating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Use Current Location
                    </>
                  )}
                </button>
              </div>

              <div className="form-group">
                <label>Street Address <span className="required">*</span></label>
                <input type="text" name="streetAddress" placeholder="123 Main St" value={formData.streetAddress} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Apartment, suite, etc. (optional)</label>
                <input type="text" name="apartment" placeholder="Apt 4B" value={formData.apartment} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input type="text" name="city" placeholder="New York" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State / Province <span className="required">*</span></label>
                  <input type="text" name="state" placeholder="NY" value={formData.state} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code <span className="required">*</span></label>
                  <input type="text" name="postalCode" placeholder="10001" value={formData.postalCode} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Country <span className="required">*</span></label>
                  <input type="text" name="country" placeholder="United States" value={formData.country} onChange={handleChange} required />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="form-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  </span>
                  <span>Chronic Condition <span className="required">*</span></span>
                </label>
                <div className="checkbox-grid">
                  {mockChronicConditions.map((opt) => (
                    <div
                      key={opt}
                      className={`checkbox-box ${formData.chronicConditions.includes(opt) ? "selected" : ""}`}
                      onClick={() => toggleChronicCondition(opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-title">Allergies</div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
                  </span>
                  <span>Drug Allergies <span className="required">*</span></span>
                </label>
                <div className="yes-no-group">
                  <button type="button" className={`yes-no-btn ${formData.hasDrugAllergies === false ? "active-no" : ""}`} onClick={() => handleBooleanChange("drugAllergies", "hasDrugAllergies", false)}>No</button>
                  <button type="button" className={`yes-no-btn ${formData.hasDrugAllergies === true ? "active-yes" : ""}`} onClick={() => handleBooleanChange("drugAllergies", "hasDrugAllergies", true)}>Yes</button>
                </div>
                {formData.hasDrugAllergies && (
                  <motion.input className="free-text-input" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} type="text" name="drugAllergies" placeholder="Please specify your drug allergies..." value={formData.drugAllergies} onChange={handleChange} required />
                )}
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
                  </span>
                  <span>Food Allergies <span className="required">*</span></span>
                </label>
                <div className="yes-no-group">
                  <button type="button" className={`yes-no-btn ${formData.hasFoodAllergies === false ? "active-no" : ""}`} onClick={() => handleBooleanChange("foodAllergies", "hasFoodAllergies", false)}>No</button>
                  <button type="button" className={`yes-no-btn ${formData.hasFoodAllergies === true ? "active-yes" : ""}`} onClick={() => handleBooleanChange("foodAllergies", "hasFoodAllergies", true)}>Yes</button>
                </div>
                {formData.hasFoodAllergies && (
                  <motion.input className="free-text-input" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} type="text" name="foodAllergies" placeholder="Please specify your food allergies..." value={formData.foodAllergies} onChange={handleChange} required />
                )}
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </span>
                  <span>Severe Allergy (Anaphylaxis History) <span className="required">*</span></span>
                </label>
                <div className="yes-no-group">
                  <button type="button" className={`yes-no-btn ${formData.hasSevereAllergy === false ? "active-no" : ""}`} onClick={() => handleBooleanChange("severeAllergy", "hasSevereAllergy", false)}>No</button>
                  <button type="button" className={`yes-no-btn ${formData.hasSevereAllergy === true ? "active-yes" : ""}`} onClick={() => handleBooleanChange("severeAllergy", "hasSevereAllergy", true)}>Yes</button>
                </div>
                {formData.hasSevereAllergy && (
                  <motion.input className="free-text-input" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} type="text" name="severeAllergy" placeholder="Please specify..." value={formData.severeAllergy} onChange={handleChange} required />
                )}
              </div>

              <div className="section-title">Current Medication</div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"></path></svg>
                  </span>
                  <span>Active Prescription <span className="required">*</span></span>
                </label>
                <div className="yes-no-group">
                  <button type="button" className={`yes-no-btn ${formData.hasActivePrescription === false ? "active-no" : ""}`} onClick={() => handleBooleanChange("activePrescription", "hasActivePrescription", false)}>No</button>
                  <button type="button" className={`yes-no-btn ${formData.hasActivePrescription === true ? "active-yes" : ""}`} onClick={() => handleBooleanChange("activePrescription", "hasActivePrescription", true)}>Yes</button>
                </div>
                {formData.hasActivePrescription && (
                  <motion.input className="free-text-input" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} type="text" name="activePrescription" placeholder="Please specify your active prescriptions..." value={formData.activePrescription} onChange={handleChange} required />
                )}
              </div>
            </motion.div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="back-btn" onClick={handleBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }}>
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
                Back
              </button>
            )}

            <button type="submit" className="next-btn" disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}>
              {step === 1 ? "Continue" : "Complete Setup"}
              {step === 1 && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}