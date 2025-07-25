import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="custom-container py-8 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
      >
        Back to Home
      </Link>
    </div>
  );
}
