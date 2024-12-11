import { useEffect, useState } from "react";
import { useMainSearchStore } from "../../store/mainSearchStore";
import axiosInstance from "../../apis/axiosInstance";
import img_search from "../../assets/Search.svg";
import default_img from "../../assets/user.png";
import { Link } from "react-router-dom";

export default function MainSearchModal() {
  const searchInput = useMainSearchStore((state) => state.searchInput);

  const [users, setUsers] = useState<UserLists[]>([]);

  const getUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/get-users");

      const filteredData =
        searchInput.trim().length > 0 &&
        data.filter(
          (item: UserLists) =>
            item.fullName.toLowerCase().includes(searchInput.toLowerCase().trim()) ||
            item.username?.toLowerCase().includes(searchInput.toLowerCase().trim()),
        );
      setUsers(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, []);
  useEffect(() => {
    getUsers();
  }, [searchInput]);
  return (
    <>
      <div className="px-8 max-w-[600px] h-full z- ">
        <div className=" mt-5  ml-5">
          {/* 고정- 검색 keyword */}
          <ul className="flex flex-col gap-[14px]">
            <li className="flex items-center gap-[14px]">
              <div className="rounded-[20.34px] border border-[#D9D9D9] p-[10px]">
                <img className="w-[20px] h-[20px] fill-black" src={img_search} alt="검색 아이콘" />
              </div>
              <div className="text-[#000000]  ">
                <span className="text-[14px] font-bold">search : {searchInput}</span>
              </div>
            </li>
            {/* 입력값에 따라 출력되는 사용자들*/}
            {users.length > 0 &&
              users.map((user) => {
                console.log(user);

                return (
                  <li key={user._id} className="flex items-center">
                    <div className=" relative  w-[40px] h-[40px] overflow-hidden  bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]  rounded-full  ">
                      {/* user.profileImage */}
                      <img
                        className="w-[40px] h-[40px] rounded-full object-cover p-[3px]"
                        src={user.image ? user.image : "/Capsy.svg"}
                        alt="프로필 이미지"
                      />
                    </div>

                    <Link to="/mypage" className="block w-fit">
                      <div className="text-[#000000]  w-[300px] py-[10px] px-[20px]  ">
                        <p className="text-[14px] font-bold ">@{user.fullName}</p>
                        <p className="text-[14px] font-bold ">{user?.username}</p>
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
