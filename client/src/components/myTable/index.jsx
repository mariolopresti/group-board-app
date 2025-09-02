import React from "react";

const labels = {
  project_name: "Progetto",
  employ_name: "Dipendente",
  date: "Data",
  hours: "Ore"
};

export const MyTable = ({data}) => {

  const listkey = data[0] ? Object.keys(data[0]) : null;
  const mapped = listkey?.map(entry => labels[entry]);

  return (
    <>
      <div className="">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              {mapped?.map((item, index) =>
                <th key={index} scope="col">{item}</th>
              )}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data?.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                {listkey.map((header, idx) => (
                  <td key={idx}>{item[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
