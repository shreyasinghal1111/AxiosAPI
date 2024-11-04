import { useEffect, useState } from "react";
import { getPost } from "../api/PostAPI";
import { FaStar } from "react-icons/fa";
import { GoIssueClosed } from "react-icons/go";
import { BiTime } from "react-icons/bi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize the relative time plugin using dayjs package
dayjs.extend(relativeTime);

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Post = (): JSX.Element => {
  const [data, setData] = useState<Repository[]>([]);

  const getPostData = async (): Promise<void> => {
    const res = await getPost();
    setData(res.data.items);
  };

  useEffect(() => {
    getPostData();
  }, []);

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).fromNow();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center relative before:absolute before:bottom-0 before:h-1 before:w-48 before:left-1/2 before:-translate-x-1/2 before:bg-blue-500 before:rounded-full pb-2 hover:before:w-96 before:transition-all">
  GitHub Repositories
</h2>        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((repo) => (
            <li
              key={repo.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <div className="grid gap-3">
                <div className="flex items-center gap-4">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login}'s avatar`}
                    className="w-16 h-16 rounded-full"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {repo.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 line-clamp-2">{repo.description}</p>
                
                <div className="flex items-center justify-start gap-6">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 w-5 h-5" />
                    <span className="ml-1 text-gray-700">
                      {repo.stargazers_count}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <GoIssueClosed className="text-green-600 w-5 h-5" />
                    <span className="ml-1 text-gray-700">
                      {repo.open_issues_count}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <BiTime className="w-4 h-4 mr-1" />
                  <span>Created: {formatDate(repo.created_at)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Post;
