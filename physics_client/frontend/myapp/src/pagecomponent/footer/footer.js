import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";


function Footer() {
    return (
        <div>
            <footer className="footer-wrapper">
                <div className="footer-container">


                    <div className="footer-left">
                        <h2 className="footer-title">
                            Let’s Make to <span>Dream</span> Real!
                        </h2>
                        <p className="footer-subtitle">
                            Join us in transforming your physics understanding and achieving your academic goals.
                        </p>
                    </div>


                    <div className="footer-right">
                        <h3 className="footer-info-title">Information</h3>
                        <ul className="footer-info">
                            <li>
                                <FaMapMarkerAlt className="footer-icon" />
                                <span>640/5, 4th Cross Street, R.R. Nagar, Thiruppalai, Madurai - 14</span>
                            </li>
                            <li>
                                <FaEnvelope className="footer-icon" />
                                <span>fathikhani12@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </footer>


            <div className="footer-end">
                <p>Alsana | © 2025 All Rights Reserved</p>
                <p className="designer">Designed by Zeploy</p>
            </div>
        </div>
    )
}
export default Footer