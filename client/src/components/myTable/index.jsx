import React from "react";

const labels = {
  project_name: "Progetto",
  employ_name: "Dipendente",
  date: "Data",
  hours: "Ore"
};

export const MyTable = ({data}) => {

  const listKey = data[0] ? Object.keys(data[0]) : null;
  const headerLabels = listKey?.map(entry => labels[entry]);

  return (
    <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              {headerLabels?.map((item, index) =>
                <th key={index} scope="col">{item}</th>
              )}
            </tr>
          </thead>
          <tbody className="table-body">
            {data?.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                {listKey.map((header, idx) => (
                  <td key={idx}>{item[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </>
  )
}
