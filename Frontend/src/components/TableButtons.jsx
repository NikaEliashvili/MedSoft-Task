import { FaPlus } from "react-icons/fa6";
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

export default function TableButtons({
  handleEditorBtn,
  handleAddBtn,
  handleDelete,
  clickedID,
}) {
  const [isClickedDeleteBtn, setIsClickedDeleteBtn] = useState(false);

  return (
    <div className="bg-zinc-100 rounded-lg py-2 px-1 flex gap-5">
      <div
        onClick={handleAddBtn}
        className="flex items-center gap-1 cursor-pointer"
      >
        <FaPlus className="text-2xl text-green-700" />
        <span className="font-semibold">დამატება</span>
      </div>

      <button
        onClick={handleEditorBtn}
        className="flex items-center gap-1 cursor-pointer group disabled:opacity-60 disabled:cursor-default transition"
        disabled={!clickedID}
      >
        <BiSolidEdit className="text-2xl text-orange-600 group-disabled:opacity-100" />
        <span className="font-semibold">რედაქტირება</span>
      </button>

      <button
        onClick={() => setIsClickedDeleteBtn(true)}
        className="flex items-center gap-1 cursor-pointer group disabled:opacity-60 disabled:cursor-default"
        disabled={!clickedID}
      >
        <IoClose className="text-2xl text-red-600 group-disabled:opacity-100" />
        <span className="font-semibold ">წაშლა</span>
      </button>

      {isClickedDeleteBtn && (
        <div
          className="absolute top-0 bottom-0 right-0 left-0 m-auto w-fit h-fit bg-zinc-100 rounded-lg p-5 shadow-[0_3px_30px_5px_rgba(0,0,0,0.4125)] 
        "
        >
          <h1 className="text-lg font-semibold text-red-800 border-b-2 border-b-zinc-200 mb-5 pb-1">
            წაშლა
          </h1>
          <p className="text-sm text-black border-b-2 border-b-zinc-200 pb-5 mb-5">
            გსურთ მონიშნული ჩანაწერის წაშლა?
          </p>
          <div className="w-full text-sm font-semibold flex justify-between items-center ">
            <button
              onClick={() => setIsClickedDeleteBtn(false)}
              className="bg-zinc-100 py-2 px-1 border border-gray-500 rounded-lg text-gray-700 hover:bg-gray-500 hover:text-white transition"
            >
              გაუქმება
            </button>
            <button
              onClick={() => handleDelete(clickedID)}
              className="bg-red-500 py-2 px-3   rounded-lg text-white hover:bg-red-600 hover:text-white transition"
            >
              წაშლა
            </button>
          </div>
        </div>
      )}

      {/* <div className="absolute bottom-3 left-0 right-0 m-auto bg-green-600 w-[12rem] h-[3rem] rounded-2xl flex justify-center items-center ">
        <span className="text-white font-semibold">დამატებულია</span>
      </div> */}
    </div>
  );
}
