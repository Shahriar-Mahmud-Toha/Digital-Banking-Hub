import Link from "next/link";
import "../globals.css";

export default function Card() {
    return (
        
        <div className="flex flex-wrap justify-center">
            {/* First Card */}
            <div className="card h-auto w-96 glass mx-4 mb-4">
                <figure>
                    <img
                        src="https://av.sc.com/bd/content/images/bd-Home-Page_Pintile_SC-web-banner_400x400pix-300x300.jpg"
                        alt="image"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">Cultivating excellence in sustainable agriculture</h2>
                    <p>to know about terms of reference and proposal submission guidelines.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Learn now!</button>
                    </div>
                </div>
            </div>

            {/* Second Card */}
            <div className="card h-auto w-96 glass mx-4 mb-4">
                <figure>
                    <img
                        src="https://av.sc.com/bd/content/images/bd-home-pintile-cashless-300x300.jpg"
                        alt="image"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">Save Big Go Cashless</h2>
                    <p>Go cashless and enjoy great deals.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Learn now!</button>
                    </div>
                </div>
            </div>

            <div className="card h-auto w-96 glass mx-4 mb-4">
                <figure>
                    <img
                        src="https://av.sc.com/bd/content/images/bd-enjoying-card-benefits-Pintiles_400X400px-300x300.jpg"
                        alt="image"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">Latest card offers and deals	</h2>
                    <p>All latest promotion offers catered to your Lifestyle.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Learn now!</button>
                    </div>
                </div>
            </div>

        </div>
    );
}