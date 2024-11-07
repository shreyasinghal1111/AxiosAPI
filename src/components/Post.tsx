/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getPost } from "../api/PostAPI";
import { FaStar } from "react-icons/fa";
import { GoIssueClosed } from "react-icons/go";
import { BiTime } from "react-icons/bi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClassicLoader from "./ClassicLoader";
import { convertDate } from "../utils/datepicker";

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const itemsPerPage = 9;
  const getPostData = async ({
    page = 1,
    perPage = 25,
  }: {
    page: number;
    perPage: number;
  }): Promise<void> => {
    setIsLoading(true);
    const formattedDate = convertDate(selectedDate);

    const payLoad = {
      ...(selectedDate
        ? { q: `created:>${formattedDate} stars:>10000` }
        : { q: null }),
      sort: "stars",
      order: "desc",
      page,
      per_page: perPage,
    };
    try {
      const res = await getPost(payLoad);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setData(res.data.items);
      setTotalPages(Math.ceil(res.data.total_count / itemsPerPage));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPostData({ page: currentPage, perPage: itemsPerPage });
  }, [currentPage, selectedDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).fromNow();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center relative before:absolute before:bottom-0 before:h-1 before:w-48 before:left-1/2 before:-translate-x-1/2 before:bg-blue-500 before:rounded-full pb-2 hover:before:w-96 before:transition-all">
          GitHub Repositories
        </h2>

        <div className="flex justify-center items-center gap-3 mb-5 bg-gradient-to-r from-blue-50 to-white p-2 rounded-xl shadow-lg max-w-sm mx-auto border border-blue-100">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="bg-blue-500 w-1.5 h-8 rounded-full mr-2"></span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Select Date
            </span>
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) {
                setSelectedDate(date);
                getPostData({ page: currentPage, perPage: itemsPerPage });
              }
            }}
            dateFormat="yyyy-MM-dd"
            className="px-2 py-2 text-gray-700 bg-white border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300 transition-all duration-300 cursor-pointer font-normal text-center min-w-[80px]"
            placeholderText="Pick a date"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px] text-blue-500">
            {/* Loader used syntax ui here so that when searching is done 
            it will show the loader */}
            <ClassicLoader />
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((repo) => (
              <li
                key={repo.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
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

                  <p className="text-gray-600 line-clamp-2">
                    {repo.description}
                  </p>

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
        )}

        {/* I have added the conditional rendering here 
so that when the data is loaded only then it will show the pagination */}
        {data.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition"
            >
              <IoIosArrowBack />
            </button>

            <button
              onClick={() => handlePageChange(1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-blue-100"
              }`}
            >
              1
            </button>

            {currentPage > 3 && <span className="px-4 py-2">...</span>}

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber !== 1 &&
                pageNumber !== totalPages &&
                pageNumber >= currentPage - 1 &&
                pageNumber <= currentPage + 1
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNumber
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 hover:bg-blue-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              return null;
            })}
            {currentPage < totalPages - 2 && (
              <span className="px-4 py-2">...</span>
            )}

            {totalPages > 1 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 hover:bg-blue-100"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition"
            >
              <IoIosArrowForward />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Post;
