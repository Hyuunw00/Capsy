import { useEffect, useState } from "react";
import { useMainSearchStore } from "../../store/mainSearchStore";
import axiosInstance from "../../apis/axiosInstance";
import img_search from "../../assets/Search.svg";
import { Link } from "react-router-dom";

export default function MainSearchModal() {
  const searchInput = useMainSearchStore((state) => state.searchInput);

  const [users, setUsers] = useState<UserLists[]>([]);

  // 검색된 user 목록
  const getUsers = async () => {
    try {
      // const { data } = await axiosInstance.get(`/search/users/${searchInput.replace(/\s+/g, "")}`);
      const { data } = await axiosInstance.get("/users/get-users");
      const filteredData =
        searchInput.trim().length > 0 &&
        data.filter(
          (item: UserLists) =>
            item.fullName.toLowerCase().includes(searchInput.toLowerCase().replace(/\s+/g, "")) ||
            item.username?.toLowerCase().includes(searchInput.toLowerCase().replace(/\s+/g, "")),
        );
      setUsers(filteredData);
    } catch (error) {
      setUsers([]);
    }
  };
  useEffect(() => {
    getUsers();
  }, [searchInput]);

  return (
    <>
      <div className="px-4 max-w-[600px] h-full">
        <div className="px-2 mt-5 ml-5">
          {/* 고정- 검색 keyword */}
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-4 px-4 max-[550px]:gap-2 max-[550px]:px-2">
              {/* 검색 아이콘 */}
              <div className="rounded-[20px] border border-[#D9D9D9] p-3 bg-white max-[550px]:p-2">
                <img
                  className="w-6 h-6 object-contain max-[550px]:w-4 max-[550px]:h-4"
                  src={img_search}
                  alt="검색 아이콘"
                />
              </div>

              {/* 텍스트 부분 */}
              <div className="text-black dark:text-white max-[550px]:leading-tight">
                <span className="font-bold text-[14px] max-[550px]:text-[10px]">KEYWORD : {searchInput}</span>
              </div>
            </li>
            {/* 입력값에 따라 출력되는 사용자들*/}
            {users.length > 0 &&
              users.map((user) => {
                return (
                  <li
                    key={user._id}
                    className="flex items-center gap-4 px-4 transition rounded hover:bg-bg-100 max-[550px]:gap-2 max-[550px]:px-2"
                  >
                    {/* 프로필 이미지 */}
                    <div
                      className={`relative w-10 h-10 overflow-hidden rounded-full ${
                        user.isOnline && "bg-gradient-to-r from-[rgba(3,199,90,0.60)] to-[rgba(103,78,255,0.60)]"
                      } max-[550px]:w-8 max-[550px]:h-8`}
                    >
                      <img
                        className="w-full h-full rounded-full object-cover p-0.5 max-[550px]:p-0.5"
                        src={user.image || "/Capsy.svg"}
                        alt="프로필 이미지"
                      />
                    </div>

                    {/* 유저 정보 */}
                    <Link
                      to={`userinfo/${user.fullName}`}
                      className="block w-[80%] transition-all duration-300 rounded-lg"
                    >
                      <div className="py-2 max-[550px]:py-1">
                        <div
                          className={`flex items-center gap-2 font-bold ${!user.username && "h-10 max-[550px]:h-8"}`}
                        >
                          <p className="text-black dark:text-white text-base max-[550px]:text-sm">@{user.fullName}</p>
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isOnline ? "bg-[#7CF335]" : "bg-red-500"
                            } max-[550px]:w-1 max-[550px]:h-1`}
                          ></div>
                        </div>
                        <p className="text-sm max-[550px]:text-xs">{user?.username}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
