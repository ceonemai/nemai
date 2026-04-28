import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./SetupProfile.css";
import { usePrivy } from "@privy-io/react-auth";

// Component สำหรับ Dropdown แบบค้นหาได้ สไตล์ AI (Glassmorphism & Animated)
const SearchableDropdown = ({ options, value, onChange, placeholder, name, hideSearch = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rawFilteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOptions = rawFilteredOptions.slice(0, 100); // จำกัดการเรนเดอร์แค่ 100 รายการ เพื่อป้องกันการกระตุก

  const selectedOption = options.find(opt => opt.value === String(value));

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div
        className={`dropdown-header ${isOpen ? "open" : ""}`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(""); }}
      >
        <span className={selectedOption ? "selected-text" : "placeholder-text"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-list-container"
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ originY: "top" }}
          >
            {!hideSearch && (
              <div className="dropdown-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            )}
            <div className="dropdown-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`dropdown-item ${String(value) === opt.value ? "selected" : ""}`}
                    onClick={() => {
                      onChange({ target: { name, value: opt.value } });
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {opt.label}
                    {String(value) === opt.value && (
                      <motion.svg style={{ flexShrink: 0, marginLeft: 8 }} initial={{ scale: 0 }} animate={{ scale: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2187AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </motion.svg>
                    )}
                  </div>
                ))
              ) : (
                <div className="dropdown-no-results">No results found</div>
              )}
              {rawFilteredOptions.length > 100 && (
                <div style={{ padding: "8px 16px", fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic" }}>
                  Showing top 100 results. Type to search more...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Component สำหรับ Multiple Select Dropdown สไตล์ AI
const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rawFilteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOptions = rawFilteredOptions.slice(0, 100); // จำกัดการเรนเดอร์แค่ 100 รายการ เพื่อป้องกันการกระตุก

  const toggleSelection = (val) => {
    const newValues = selectedValues.includes(String(val))
      ? selectedValues.filter(v => v !== String(val))
      : [...selectedValues, String(val)];
    onChange({ target: { name, value: newValues } });
  };

  const removeValue = (e, val) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== String(val));
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div
        className={`dropdown-header multi-select-header ${isOpen ? "open" : ""}`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(""); }}
      >
        <div className="chips-container">
          {selectedValues.length > 0 ? (
            selectedValues.map(val => {
              const opt = options.find(o => o.value === String(val));
              return opt ? (
                <div key={val} className="chip">
                  {opt.label}
                  <span className="chip-remove" onClick={(e) => removeValue(e, val)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </span>
                </div>
              ) : null;
            })
          ) : (
            <span className="placeholder-text">{placeholder}</span>
          )}
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: 8 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-list-container"
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ originY: "top" }}
          >
            <div className="dropdown-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus />
            </div>
            <div className="dropdown-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = selectedValues.includes(String(opt.value));
                  return (
                    <div key={opt.value} className={`dropdown-item ${isSelected ? "selected" : ""}`} onClick={() => toggleSelection(opt.value)}>
                      {opt.label}
                      {isSelected && (
                        <motion.svg style={{ flexShrink: 0, marginLeft: 8 }} initial={{ scale: 0 }} animate={{ scale: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2187AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </motion.svg>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="dropdown-no-results">No results found</div>
              )}
              {rawFilteredOptions.length > 100 && (
                <div style={{ padding: "8px 16px", fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic" }}>
                  Showing top 100 results. Type to search more...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Component สำหรับ Custom Calendar แบบ Modern Glassmorphism
const CalendarPopover = ({ value, onSelect }) => {
  const [viewDate, setViewDate] = useState(() => {
    if (value && value.length === 10) {
      const [d, m, y] = value.split("/");
      const parsed = new Date(y, parseInt(m, 10) - 1, d);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const d = new Date();
    d.setFullYear(d.getFullYear() - 20); // Default ให้เริ่มที่ 20 ปีที่แล้วสำหรับการกรอกวันเกิด
    return d;
  });
  const [mode, setMode] = useState("days"); // "days" | "years"

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // ให้เลือกย้อนหลังได้ 100 ปี

  return (
    <div className="calendar-popover">
      {mode === "days" ? (
        <>
          <div className="calendar-header">
            <button type="button" className="calendar-nav-btn" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="calendar-title" onClick={() => setMode("years")}>
              {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <button type="button" className="calendar-nav-btn" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="calendar-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="calendar-days">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = value === `${String(day).padStart(2, "0")}/${String(viewDate.getMonth() + 1).padStart(2, "0")}/${viewDate.getFullYear()}`;
              return (
                <div key={day} className={`calendar-day ${isSelected ? "selected" : ""}`} onClick={() => onSelect(`${String(day).padStart(2, "0")}/${String(viewDate.getMonth() + 1).padStart(2, "0")}/${viewDate.getFullYear()}`)}>
                  {day}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="calendar-years">
          {years.map(y => (
            <div key={y} className="calendar-year-item" onClick={() => {
              setViewDate(new Date(y, viewDate.getMonth(), 1));
              setMode("days");
            }}>
              {y}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component สำหรับ Date Picker สไตล์ Modern (Input Mask DD/MM/YYYY)
const ModernDateInput = ({ value, onChange, name }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // อนุญาตเฉพาะตัวเลข
    if (val.length > 8) val = val.slice(0, 8);

    // Auto-correct วันที่และเดือนให้อยู่ในขอบเขตที่ถูกต้อง
    if (val.length >= 1) {
      let day = parseInt(val.slice(0, 2), 10);
      if (day > 31) val = "31" + val.slice(2);
      if (val.length >= 2 && day === 0) val = "01" + val.slice(2);
    }
    if (val.length >= 3) {
      let month = parseInt(val.slice(2, 4), 10);
      if (month > 12) val = val.slice(0, 2) + "12" + val.slice(4);
      if (val.length >= 4 && month === 0) val = val.slice(0, 2) + "01" + val.slice(4);
    }

    let formatted = val;
    if (val.length >= 3) {
      formatted = `${val.slice(0, 2)}/${val.slice(2)}`;
    } else if (val.length === 2 && e.target.value.endsWith("/")) {
      formatted = `${val}/`;
    }

    if (val.length >= 5) {
      formatted = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length === 4 && e.target.value.endsWith("/")) {
      formatted = `${formatted}/`;
    }

    onChange({ target: { name, value: formatted } });
  };

  return (
    <div className={`modern-date-container ${isFocused || showCalendar ? "focused" : ""}`} style={{ position: "relative" }} ref={containerRef}>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="DD/MM/YYYY"
        className="modern-date-input"
        autoComplete="off"
      />
      <motion.svg 
        onClick={() => setShowCalendar(!showCalendar)}
        animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? "#2187AA" : "#94a3b8" }}
        className="calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ cursor: "pointer" }}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </motion.svg>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", originY: "top", originX: "center" }}
          >
            <CalendarPopover value={value} onSelect={(val) => { onChange({ target: { name, value: val } }); setShowCalendar(false); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ฟังก์ชันสำหรับสร้าง Placeholder ของ Allergy ให้ตรงตาม Category ที่เลือก
const getAllergyPlaceholder = (categoryName) => {
  if (!categoryName) return "e.g. Please specify details...";
  const name = categoryName.toLowerCase();
  if (name.includes("food")) return "e.g. Peanuts, Shellfish, Dairy...";
  if (name.includes("respiratory") || name.includes("environmental")) return "e.g. Pollen, Dust mites, Pet dander...";
  if (name.includes("skin") || name.includes("contact")) return "e.g. Latex, Nickel, Poison ivy...";
  if (name.includes("drug")) return "e.g. Penicillin, Aspirin, Ibuprofen...";
  if (name.includes("insect") || name.includes("venom")) return "e.g. Bee stings, Wasp venom...";
  return "e.g. Please specify details...";
};

export default function SetupProfile() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 2; // กำหนดจำนวน Step ทั้งหมดไว้ก่อน (สามารถเปลี่ยนได้เมื่อมี Step เพิ่ม)
  const { getAccessToken } = usePrivy();
  
  const [countries, setCountries] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [allergyCategories, setAllergyCategories] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = await getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [countriesRes, medRes, drugsRes, allergyCatsRes] = await Promise.all([
          fetch("https://customer-api.nemai.io/api/v1/master/countries", { headers }),
          fetch("https://customer-api.nemai.io/api/v1/master/medical-conditions", { headers }),
          fetch("https://customer-api.nemai.io/api/v1/master/drugs", { headers }),
          fetch("https://customer-api.nemai.io/api/v1/master/allergy-categories", { headers })
        ]);

        if (countriesRes.ok) { const d = await countriesRes.json(); setCountries(d.data || d || []); }
        if (medRes.ok) { const d = await medRes.json(); setMedicalConditions(d.data || d || []); }
        if (drugsRes.ok) { const d = await drugsRes.json(); setDrugs(d.data || d || []); }
        if (allergyCatsRes.ok) { const d = await allergyCatsRes.json(); setAllergyCategories(d.data || d || []); }

      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, [getAccessToken]);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    countryId: "",
    // Step 2 Data
    weight: "",
    height: "",
    medicalConditionIds: [],
    drugIds: [],
    allergyCategoryIds: [],
    allergyDetails: {} // เก็บข้อมูล free-text ของแต่ละ category_id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergyDetailChange = (categoryId, value) => {
    setFormData(prev => ({
      ...prev,
      allergyDetails: {
        ...prev.allergyDetails,
        [categoryId]: value
      }
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else {
      // เตรียมข้อมูล Payload ให้ตรงกับ API Schema
      // แปลงรูปแบบวันที่จาก DD/MM/YYYY ให้เป็น YYYY-MM-DD ก่อนส่ง API (เพื่อให้เป็นมาตรฐาน)
      let formattedBirthDate = formData.birthDate;
      if (formattedBirthDate.includes("/")) {
        const [day, month, year] = formattedBirthDate.split("/");
        formattedBirthDate = `${year}-${month}-${day}`;
      }

      const payload = {
        allergies: formData.allergyCategoryIds.map(id => ({
          allergy: formData.allergyDetails[id] || "",
          category_id: Number(id)
        })),
        birth_date: formattedBirthDate,
        country_id: Number(formData.countryId),
        drug_ids: formData.drugIds.map(Number),
        name: formData.name || "-",
        gender: formData.gender,
        medical_condition_ids: formData.medicalConditionIds.map(Number),
        weight: Number(formData.weight),
        height: Number(formData.height)
      };

      console.log("Submit Payload:", payload);

      setIsSubmitting(true);
      try {
        const token = await getAccessToken();
        const response = await fetch("https://customer-api.nemai.io/api/v1/users/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          navigate("/", { replace: true });
        } else {
          console.error("Failed to submit profile:", response.status);
          alert("Failed to save profile. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting profile:", error);
        alert("An error occurred. Please connect to the internet and try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ตรวจสอบว่าฟิลด์ที่จำเป็นใน Step 1 ถูกกรอกครบหรือยัง
  const isStep1Valid =
    formData.name.trim() !== "" &&
    formData.gender !== "" &&
    formData.birthDate.length === 10 &&
    formData.countryId !== "";

  // ตรวจสอบความถูกต้องของสัดส่วนร่างกาย
  const weightNum = Number(formData.weight);
  const heightNum = Number(formData.height);
  const isWeightOutOfBounds = formData.weight !== "" && (weightNum < 2 || weightNum > 300);
  const isHeightOutOfBounds = formData.height !== "" && (heightNum < 30 || heightNum > 300);

  // ตรวจสอบว่าฟิลด์ที่จำเป็นใน Step 2 ถูกกรอกครบหรือยัง
  const isStep2Valid =
    formData.weight !== "" && !isWeightOutOfBounds &&
    formData.height !== "" && !isHeightOutOfBounds &&
    formData.allergyCategoryIds.every(
      id => formData.allergyDetails[id] && formData.allergyDetails[id].trim() !== ""
    ); // ถ้าเลือก Allergy ต้องกรอกรายละเอียดด้วย

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
          <h1 className="setup-title">{step === 1 ? "Personal Information" : "Personal Health Data (PHD)"}</h1>
        </div>

        <form onSubmit={handleNext} className="setup-form">
          {step === 1 && (
            <motion.div
              className="form-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group gender-group">
                  <label>Gender <span className="required">*</span></label>
                  <SearchableDropdown
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" }
                    ]}
                    placeholder="Select Gender"
                    hideSearch={true}
                  />
                </div>
                <div className="form-group dob-group">
                  <label>Date of Birth <span className="required">*</span></label>
                  <ModernDateInput name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Country <span className="required">*</span></label>
                <SearchableDropdown
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleChange}
                  options={countries.map(c => ({ value: String(c.id), label: c.name }))}
                  placeholder="Select Country"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="form-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <span className="label-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path><path d="M12 12l2.5-2.5"></path><circle cx="12" cy="12" r="2"></circle></svg>
                    </span>
                    <span>Weight (kg) <span className="required">*</span></span>
                  </label>
                <input type="number" name="weight" placeholder="e.g. 65" value={formData.weight} onChange={handleChange} min="2" max="300" required 
                  style={isWeightOutOfBounds ? { borderColor: "#e11d48", backgroundColor: "#fff1f2", color: "#e11d48" } : {}}
                />
                {isWeightOutOfBounds && <span style={{ color: "#e11d48", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>Please enter a valid weight (2 - 300 kg)</span>}
                </div>
                <div className="form-group">
                  <label>
                    <span className="label-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 15 12 19 16 15"></polyline><polyline points="8 9 12 5 16 9"></polyline><line x1="12" y1="5" x2="12" y2="19"></line></svg>
                    </span>
                    <span>Height (cm) <span className="required">*</span></span>
                  </label>
                <input type="number" name="height" placeholder="e.g. 170" value={formData.height} onChange={handleChange} min="30" max="300" required 
                  style={isHeightOutOfBounds ? { borderColor: "#e11d48", backgroundColor: "#fff1f2", color: "#e11d48" } : {}}
                />
                {isHeightOutOfBounds && <span style={{ color: "#e11d48", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>Please enter a valid height (30 - 300 cm)</span>}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  </span>
                  <span>Medical Conditions</span>
                </label>
                <MultiSelectDropdown
                  name="medicalConditionIds"
                  value={formData.medicalConditionIds}
                  selectedValues={formData.medicalConditionIds}
                  onChange={handleChange}
                  options={medicalConditions.map(c => ({ value: String(c.id), label: c.name }))}
                  placeholder="Select conditions (Optional)"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"></path></svg>
                  </span>
                  <span>Current Medications (Drugs)</span>
                </label>
                <MultiSelectDropdown
                  name="drugIds"
                  value={formData.drugIds}
                  selectedValues={formData.drugIds}
                  onChange={handleChange}
                  options={drugs.map(d => ({ value: String(d.id), label: d.name }))}
                  placeholder="Select drugs (Optional)"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
                  </span>
                  <span>Allergies</span>
                </label>
                <MultiSelectDropdown
                  name="allergyCategoryIds"
                  value={formData.allergyCategoryIds}
                  selectedValues={formData.allergyCategoryIds}
                  onChange={handleChange}
                  options={allergyCategories.map(c => ({ value: String(c.id), label: c.name }))}
                  placeholder="Select allergies (Optional)"
                />

                <AnimatePresence>
                  {formData.allergyCategoryIds.length > 0 && (
                    <motion.div 
                      className="allergy-details-container"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {formData.allergyCategoryIds.map(id => {
                        const category = allergyCategories.find(c => String(c.id) === String(id));
                        return (
                          <div key={id} className="allergy-detail-input">
                            <label>Specify {category?.name} <span className="required">*</span></label>
                            <input type="text" 
                              placeholder={getAllergyPlaceholder(category?.name)} 
                              value={formData.allergyDetails[id] || ""} 
                              onChange={(e) => handleAllergyDetailChange(id, e.target.value)} 
                              required />
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
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

            <button type="submit" className="next-btn" disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Saving...
                </>
              ) : step === 1 ? (
                <>
                  Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}