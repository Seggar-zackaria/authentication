import { Github, Google } from "lucide-react";

const SocialAuth = () => {
  return (
    <div className="flex justify-center space-x-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        <Google className="size-6" />
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        <Github className="size-6" />
      </button>
    </div>
  );
};

export default SocialAuth;
