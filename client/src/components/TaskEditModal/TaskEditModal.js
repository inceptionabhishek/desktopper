import React from "react";

function TaskEditModal({
  taskName,
  setTaskName,
  taskDescription,
  setTaskDescription,
  setTaskEditModal,
}) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6">
          {/*content*/}
          <div className="w-[100vh] border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <h3 className=" m-10 text-3xl font-semibold text-default ml-10 mt-22">
              Edit Task
            </h3>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                <h1 className="mb-4 text-black font-bold ml-10  text-lg leading-relaxed">
                  Task Name
                </h1>
                <input
                  className="ml-10 w-auto h-10 border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Project Name"
                  style={{
                    width: "70vh",
                  }}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                  }}
                  value={taskName}
                />
                <h1 className="mb-4 mt-4 text-black font-bold ml-10  text-lg leading-relaxed">
                  Project Description
                </h1>
                <input
                  className="mb-4 mt-4 ml-10 w-auto h-10 border-2 border-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Project Description"
                  style={{
                    width: "70vh",
                  }}
                  value={taskDescription}
                  onChange={(e) => {
                    setTaskDescription(e.target.value);
                  }}
                />

                <div className="flex flex-row w-[80vh] "></div>
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setTaskEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                //onClick={HandleEditTaskSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default TaskEditModal;
