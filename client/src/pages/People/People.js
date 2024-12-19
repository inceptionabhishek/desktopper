import React, { useContext, useEffect, useState } from "react";
import "./People.css";
import ApproveMember from "../../components/PopUpBox/ApproveMember";
import TableRow from "../../components/TableRow/TableRow";
import PeopleTable from "../../components/Tables/PeopleTable";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import PeoplePageSkeleton from "../../skeletonUi/PeoplePageSkeleton";
import MemberRow from "./MemberRow";
import { Link } from "react-router-dom";

function People() {
  const [searchbyEmail, setsearchbyEmail] = useState("");
  const [activeTab, setactiveTab] = useState(false);
  const { user } = useContext(AuthContext);
  const { workspaceMembers, approvalMembers, isLoading } =
    useContext(WorkSpaceContext);

  const [
    approveMembersFromWorkspacePopup,
    setApproveMembersFromWorkspacePopup,
  ] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const { superAdmin, isLoading: userLoading } = useContext(UserContext);

  const { subscription, getIsSpaceAvailable } = useContext(PaymentContext);

  useEffect(() => {
    getIsSpaceAvailable(user?.email, user?.userId);
  }, [subscription]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="p-6">
        <div>
          <h2 className="font-bold text-2xl leading-6 text-gray-600 pb-8">
            People
          </h2>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row ">
              <button
                onClick={() => setactiveTab(false)}
                className={`tab ${activeTab === false ? "tab-active" : ""}`}
              >
                MEMBERS ({workspaceMembers?.length})
              </button>
              <button
                onClick={() => setactiveTab(true)}
                className={`tab ${activeTab === true ? "tab-active" : ""} ${
                  user.userRole === "user" || user.userRole === "manager"
                    ? "hidden"
                    : ""
                } `}
              >
                APPROVALS ({approvalMembers?.length})
              </button>
            </div>
            <Link
              className="invite-member-btn w-[180px]"
              to={"/invite-workspace"}
            >
              Invite Members
            </Link>
          </div>
        </div>
        {activeTab && (
          <>
            <div className="flex justify-between h w-[100%]  py-5"></div>
            {isLoading || userLoading || !superAdmin?.email ? (
              <PeoplePageSkeleton />
            ) : (
              <div className="border-2 border-[#ebeaea] p-3 rounded-lg ">
                <table className="table-fixed w-[100%] rounded">
                  <thead className="border-b-2 border-[#ebeaea]">
                    <tr>
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalMembers
                      ?.filter((member) => !member.approvalStatus)
                      .map((member) => {
                        return (
                          <TableRow
                            key={member.userId}
                            memberId={member.userId}
                            member={member}
                            setSelectedMemberId={setSelectedMemberId}
                            setSelectedRole={setSelectedRole}
                            setApproveMembersFromWorkspacePopup={
                              setApproveMembersFromWorkspacePopup
                            }
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {!activeTab && (
          <>
            <div className="flex justify-between  w-[100%]  py-5"></div>
            {isLoading || userLoading || !superAdmin?.email ? (
              <PeoplePageSkeleton />
            ) : (
              <div
                className="border-2 border-[#ebeaea] p-3 rounded-lg  "
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <table className="table-fixed w-[100%] rounded">
                  <thead className="border-b-2 border-[#ebeaea]">
                    <tr>
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Date Added</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspaceMembers
                      ?.filter((member) => member.approvalStatus)
                      .filter((member) =>
                        member.email
                          .toLowerCase()
                          .includes(searchbyEmail.toLowerCase())
                      )
                      .map((member) => {
                        return (
                          <>
                            <MemberRow
                              key={member.userId}
                              memberId={member.userId}
                              member={member}
                              superAdminEmail={superAdmin?.email}
                            />
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      {approveMembersFromWorkspacePopup && (
        <ApproveMember
          deletePopUp={approveMembersFromWorkspacePopup}
          setDeletePopUp={setApproveMembersFromWorkspacePopup}
          selectedMemberId={selectedMemberId}
          selectedRole={selectedRole}
        />
      )}
    </>
  );
}

export default People;
