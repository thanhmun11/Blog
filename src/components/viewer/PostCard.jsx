import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAE7Ir2I6OTwTlBt3F5CxIOZduRvxJcnzkdgJh49DfllAOnQ1B44iFnoV89OfBTd_Lv3Xx4qUHgudDLQnaxa09kQy_QjF3ICQbK-YECJ8Rfg"
        }
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary">{post.title}</h2>
        <p className="text-gray-600 mt-2">{post.excerpt}</p>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <Link
          to={`/posts/${post.id}`}
          className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
