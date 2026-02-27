import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkIn } from "../redux/slices/VerificationSlice";

const QRScanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const { id } = useSelector((state) => state.auth.data);
  const { loading, success, error } = useSelector((state) => state.verification);

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      (res) => {
        if (res?.data && !result) {
          setResult(res.data);
          try {
            const { eventId, token } = JSON.parse(res.data);
            dispatch(checkIn({ userId: id, eventId, token }));
          } catch (err) {
            console.error("Invalid QR data:", err);
          }
        }
      },
      { highlightScanRegion: true, highlightCodeOutline: true }
    );

    scanner.start();

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [dispatch, id, result]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-6">
          Scan QR to Verify Attendance
        </h1>

        <div className="mb-6">
          <video ref={videoRef} style={{ width: "100%" }} />
        </div>

        <div className="mb-6">
          {loading && <p className="text-yellow-400">Verifying…</p>}
          {success && <p className="text-green-400">Verification successful ✅</p>}
          {error && (
            <div>
              <p className="text-red-400">Verification failed ❌</p>
              <button
                onClick={() => setResult(null)}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Retry Scan
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
