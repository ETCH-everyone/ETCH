import { useState, useEffect } from "react";
import { Link } from "react-router";
import { likeApi } from "../../../../api/likeApi";
import type { JobLike } from "../../../../types/like";
import SeeMore from "../../../svg/seeMore";

interface Props {
  titleText: string;
  subText: string;
}

function FavoriteJobList({ titleText, subText }: Props) {
  const [jobs, setJobs] = useState<JobLike[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        setIsLoading(true);
        const data = await likeApi.jobs.getLikes();
        setJobs(data);
      } catch (error: any) {
        console.error("관심공고 목록 조회:", error);
        // 400 에러는 데이터가 없음을 의미하므로 빈 배열로 처리
        if (error.response?.status === 400) {
          setJobs([]);
        } else {
          console.error("예상치 못한 에러:", error);
          setJobs([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteJobs();
  }, []);

  const handleRemoveJob = async (jobId: number, jobTitle: string) => {
    if (!confirm(`'${jobTitle}'을(를) 관심공고에서 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await likeApi.jobs.removeLike(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      alert("관심공고에서 삭제되었습니다.");
    } catch (error) {
      console.error("관심공고 삭제 실패:", error);
      alert("관심공고 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[500px] flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {titleText} ({jobs.length})
          </h1>
          <p className="text-sm text-gray-500">{subText}</p>
        </div>
        <div className="flex items-center h-full">
          <Link to={"/mypage/favorites/jobs"}>
            <SeeMore />
          </Link>
        </div>
      </div>
      
      {/* List Section - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2 truncate">{job.companyName}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.regions?.slice(0, 2).map((region, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {region}
                    </span>
                  ))}
                  {job.jobCategories?.slice(0, 1).map((category, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      {category}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  마감: {new Date(job.expirationDate).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleRemoveJob(job.id, job.title)}
                className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                title="관심공고 삭제"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              관심 공고가 없습니다
            </p>
            <p className="text-gray-400 text-xs mt-1">
              관심있는 채용공고를 북마크해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteJobList;
