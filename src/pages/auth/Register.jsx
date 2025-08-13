import React, { useState } from "react";
import { Mail, Phone, Fingerprint, LogIn, EyeOff, Eye, X } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { BASE_URI } from "../../utils/BaseUrl.utils";


export default function Register() {
  const [method, setMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleRegistration = (e) => {
    e.preventDefault();
    alert(`Registered via ${method}`);
  };

  const handleSendOtp = () => {
    // Here, you would typically trigger the backend to send the OTP.
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtp = () => {
    // In real scenario, verify OTP via API
    alert(`OTP entered: ${otp}`);
    setIsOtpModalOpen(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg relative">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Hotel User Registration
        </h2>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <h5 className="text-sm font-medium text-gray-500 whitespace-nowrap">
            Register via
          </h5>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {[
            { name: "email", label: "Email", icon: <Mail size={16} /> },
            { name: "phone", label: "Mobile", icon: <Phone size={16} /> },
            { name: "google", label: "Google", icon: <LogIn size={16} /> },
            {
              name: "aadhar",
              label: "Aadhaar",
              icon: <Fingerprint size={16} />,
            },
          ].map(({ name, label, icon }) => (
            <button
              key={name}
              onClick={() => setMethod(name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                method === name
                  ? "bg-blue-600 text-white"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegistration} className="space-y-4">
          {method === "email" && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Date of Birth
                </label>
                <input
                  type="date"
                //   value={dob}
                //   onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-600 transition"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Gender
                </label>
                <select
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-600 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  className="w-full border border-gray-200 p-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[60%] right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  required
                  className="w-full border border-gray-200 p-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[60%] right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                🚀 Send OTP to Email
              </button>
            </>
          )}

          {method === "phone" && (
            <>
              <input
                type="tel"
                placeholder="Mobile Number"
                required
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold">
                Send OTP to Mobile
              </button>
            </>
          )}

          {method === "google" && (
            <button className="bg-red-500 text-white w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2" onClick={() => {
              window.open(`${BASE_URI}/auth/google`, "_self");
            }}>
              <LogIn size={18} /> Sign in with Google
            </button>
          )}

          {method === "aadhar" && (
            <>
              <input
                type="text"
                placeholder="Aadhaar Number"
                required
                maxLength={12}
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold">
                Verify Aadhaar
              </button>
            </>
          )}
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium underline">
            Login
          </a>
        </p>

        {/* Modal */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setIsOtpModalOpen(false)}
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-semibold text-center text-blue-600 mb-6">
                Enter OTP
              </h3>
              <h4 className="text-sm font-semibold text-center text-black mb-4">
                Six digit OTP is sent to your {`${method}`}
              </h4>

              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/, ""); // Only digits
                      if (val) {
                        const newOtp = [...otp];
                        newOtp[index] = val;
                        setOtp(newOtp.join(""));
                        // Auto focus next
                        const next = document.getElementById(
                          `otp-${index + 1}`
                        );
                        if (next) next.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        const newOtp = otp.split("");
                        newOtp[index] = "";
                        setOtp(newOtp.join(""));
                        const prev = document.getElementById(
                          `otp-${index - 1}`
                        );
                        if (prev) prev.focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-14 text-center text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
