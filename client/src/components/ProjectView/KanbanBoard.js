import { ProjectDetailsContext } from "../../context/ProjectDetailsContext";
import { TaskContext } from "../../context/TaskContext";
import TaskEdit from "../TaskEditModal/TaskEdit";
import DeletePopUp from "./DeletePopUp";
import { Avatar, AvatarGroup } from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { useContext, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const KanbanBoard = ({ projectId }) => {
  const { getTasks, tasks, changeStatus, setTaskEditModal } =
    useContext(TaskContext);
  const { getProjectInfo, projectStatus, projectName } = useContext(
    ProjectDetailsContext
  );

  const [stateData, updateStateData] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskEdit, setTaskEdit] = useState(false);
  const [status, setStatus] = useState("");
  const [Task, setTask] = useState("");
  const convertToDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };
  const getDataInFormat = (projectStatus, tasks) => {
    const data = {
      columns: {},
      columnOrder: [],
    };
    projectStatus?.forEach((status) => {
      data.columns[status?.statusName] = {
        id: status?.statusName,
        title: status?.statusName,
        taskIds: [],
      };
      data.columnOrder.push(status.statusName);
    });
    tasks?.forEach((task) => {
      data.columns[task?.taskStatus].taskIds?.push({
        id: task?.taskId,
        name: task?.taskName,
        taskDescription: task?.taskDescription,
        dueDate: task?.dueDate,
        createdAt: task?.createdAt,
        members: task?.members,
      });
    });
    return data;
  };
  useEffect(() => {
    updateStateData(getDataInFormat(projectStatus, tasks));
  }, [tasks]);
  useEffect(() => {
    getTasks(projectId);
  }, []);
  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const sourceColumn = stateData.columns[result.source.droppableId];
    const destinationColumn = stateData.columns[result.destination.droppableId];
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    const draggedItem = sourceTaskIds[result.source.index];
    const isDuplicate = destinationTaskIds.some(
      (task) => task.id === draggedItem.id
    );
    if (isDuplicate) return;
    sourceTaskIds.splice(result.source.index, 1);
    destinationTaskIds.splice(result.destination.index, 0, draggedItem);
    const newStateData = {
      ...stateData,
      columns: {
        ...stateData.columns,
        [result.source.droppableId]: {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        },
        [result.destination.droppableId]: {
          ...destinationColumn,
          taskIds: destinationTaskIds,
        },
      },
    };
    updateStateData(newStateData);
    changeStatus(draggedItem.id, result.destination.droppableId);
  }
  const handleDelete = () => setDeleteModal(false);
  const handleCancel = () => setDeleteModal(false);
  return (
    <div className="App">
      {deleteModal && (
        <div onClick={() => setDeleteModal(false)}>
          <DeletePopUp onDelete={handleDelete} onCancel={handleCancel} />
        </div>
      )}
      {taskEdit ? (
        <>
          <TaskEdit
            projectName={projectName}
            Task={Task}
            status={status}
            setTaskEdit={setTaskEdit}
            convertToDate={convertToDate}
            taskEdit={taskEdit}
          />
        </>
      ) : null}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex overflow-x-scroll">
          {stateData?.columnOrder?.map((columnId) => {
            const column = stateData?.columns[columnId];
            return (
              <div
                className="w-1/2 mt-10 mx-2 border-2"
                key={columnId}
                style={{
                  minHeight: "50vh",
                }}
              >
                <div className="flex flex-row items-center space-x-4 text-lg font-bold mb-2 p-4 text-gray-600 flex-1">
                  <div
                    className="relative inline-flex w-5 h-5 overflow-hidden rounded-full"
                    key={columnId}
                    style={
                      column.title === "completed"
                        ? { backgroundColor: "#11CE00" }
                        : column.title === "InProgress"
                        ? { backgroundColor: "#E3CC00" }
                        : {
                            backgroundColor: "#A4A4A4",
                          }
                    }
                  ></div>
                  <h3 className="text-left flex items-center">
                    {column.title === "InProgress"
                      ? "In Progress"
                      : column.title === "completed"
                      ? "Completed"
                      : "To Do"}
                  </h3>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      className={`border rounded p-2 ${
                        snapshot.isDraggingOver ? "bg-gray-200" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <p
                        className="bg-white border-2 rounded px-2 py-1 mb-1 flex items-center cursor-pointer"
                        onClick={() => setTaskEditModal(true)}
                      >
                        <span className="">
                          <img
                            src={require("../../assets/Icons/plus.png")}
                            alt=""
                            className="w-4 h-4"
                          />
                        </span>
                        <h1 className="text-md p-2 font-semibold text-gray-300 text-left">
                          Add Task
                        </h1>
                      </p>

                      {column?.taskIds?.map((task, index) => (
                        <>
                          {" "}
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <p
                                className={`bg-white border-2 rounded px-2 py-1 mb-1 ${
                                  snapshot.isDragging ? "bg-gray-200" : ""
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => {
                                  setTaskEdit(!taskEdit);
                                  setTask({
                                    taskId: task?.id,
                                    taskName: task?.name,
                                    taskDescription: task?.taskDescription,
                                    dueDate: task?.dueDate,
                                    createdAt: task?.createdAt,
                                    members: task?.members,
                                  });
                                  setStatus({ statusName: column?.title });
                                }}
                              >
                                <div className="flex flex-row items-center justify-between space-x-1 ml-auto">
                                  <h1 className="text-md p-4 font-semibold text-black text-left">
                                    {task.name}
                                  </h1>
                                  <AvatarGroup max={4}>
                                    {task?.members.map((member) => (
                                      <Avatar
                                        sx={{ bgcolor: blue[500] }}
                                        key={member?._id}
                                        title={member?.fullName}
                                      >
                                        {member?.fullName
                                          ?.split(" ")[0][0]
                                          .toUpperCase()}
                                      </Avatar>
                                    ))}
                                  </AvatarGroup>
                                </div>
                              </p>
                            )}
                          </Draggable>
                        </>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
