import React from "react";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "Name",
    selector: (row) => row.title,
  },
  {
    name: "Email",
    selector: (row) => row.year,
  },
  {
    name: "Status",
    selector: (row) => row.year,
  },
  {
    name: "Role",
    selector: (row) => row.year,
  },
  {
    name: "Date Added",
    selector: (row) => row.year,
  },
  {
    name: "Actions",
    selector: (row) => row.year,
  },
];
const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];
function PeopleTable() {
  return (
    <div className="border-2 border-[#cbcaca] p-3 rounded-lg">
      <DataTable
        columns={columns}
        data={data}
        highlightOnHover
        pagination
        striped
        responsive
      />
    </div>
  );
}

export default PeopleTable;
