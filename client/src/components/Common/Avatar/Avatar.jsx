import "./Avatar.css";

const Avatar = ({ src, alt }) => {
  return (
    <img
      className="avatar"
      src={src}
      alt={alt}
    />
  );
};

export default Avatar;