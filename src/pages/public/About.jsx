export default function About() {
  return (
    <div className="custom-container py-8">
      <h1 className="text-3xl font-bold text-primary mb-4">About Us</h1>
      <p className="text-gray-600">
        Welcome to My Blog! We are passionate about sharing knowledge and
        stories on various topics. Our mission is to provide valuable content to
        our readers and foster a community of learning and engagement.
      </p>
      <p className="text-gray-600 mt-4">
        Contact us at:{" "}
        <a
          href="mailto:contact@myblog.com"
          className="text-primary hover:underline"
        >
          contact@myblog.com
        </a>
      </p>
    </div>
  );
}
