import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import {MyTable} from "./components/myTable/index.jsx";


const MyPage = () => {

  const groupByOptions = [
    {value: 'noGrouping', label: 'Nessuno'},
    {value: 'project_name', label: 'Progetto'},
    {value: 'employ_name', label: 'Lavoratore'},
    {value: 'date', label: 'Data'}
  ];


  const [secondButtonDisabled, setSecondButtonDisabled] = useState(true);
  const [thirdButtonDisabled, setThirdButtonDisabled] = useState(true);
  const [secondGroupByOptions, setSecondGroupByOptions] = useState(groupByOptions);
  const [thirdGroupOptions, setThirdGroupByOptions] = useState(groupByOptions);

  const [selectedFirstOption, setSelectedFirstOption] = useState('noGrouping');
  const [selectedSecondOption, setSelectedSecondOption] = useState('noGrouping');
  const [selectedThirdOption, setSelectedThirdOption] = useState('noGrouping');

  // Variable for Data comining from DB
  const [arrayData, setArrayData] = useState([]);
  const [arrayDataGrouped, setArrayDataGrouped] = useState([]);

  const load = async () => {
    try {
      const response = await axios.get("http://localhost:3040/api/all");
      const data = response.data.map(el =>
        ({...el, date: new Date(el.date).toLocaleDateString('it-IT')}))

      setArrayData(data);
      setArrayDataGrouped(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const fetchAll = async () => {
    setArrayDataGrouped(arrayData);
  }

  const groupData = async (key) => {
    if (key === 'noGrouping') {
      return fetchAll()
    }

    const groupByOptionsUpdated = groupByOptions.filter(filter => filter.value !== key);
    setSecondGroupByOptions(groupByOptionsUpdated)

    const result = arrayData.reduce((acc, entry) => {
      const entryName = entry[key];
      // Se il nome del progetto non esiste nell'acc, creiamo un nuovo oggetto
      if (!acc[entryName]) {
        acc[entryName] = {[key]: entryName, hours: 0};
      }
      acc[entryName].hours += entry.hours;
      return acc;
    }, {});

    setArrayDataGrouped(Object.values(result));
  }


  const groupDataTwoFilters = async (key) => {
    const groupByOptionsUpdated = key != 'noGrouping' ? secondGroupByOptions.filter(filter => filter.value !== key) : secondGroupByOptions;
    setThirdGroupByOptions(groupByOptionsUpdated)
    const result = arrayData.reduce((acc, entry) => {
      const firstOption = entry[selectedFirstOption];
      const secondOption = entry[key];

      // Creiamo una chiave unica combinando project_name ed employ_name
      const key_project_employ = `${firstOption}_${secondOption}`;

      // Se la combinazione non esiste nell'accumulatore, la inizializziamo
      if (!acc[key_project_employ]) {
        acc[key_project_employ] = {[selectedFirstOption]: firstOption, [key]: secondOption, hours: 0};
      }
      acc[key_project_employ].hours += entry.hours;

      return acc;
    }, {});

    setArrayDataGrouped(Object.values(result));
    console.log("result proj e ", (Object.values(result)))
  }

  const groupDataThirdFilters = async (key) => {
    const result = arrayData.reduce((acc, entry) => {
      const firstOption = entry[selectedFirstOption];
      const secondOption = entry[selectedSecondOption];
      const thirdOption = entry[key];

      // Creiamo una chiave unica combinando project_name ed employ_name
      const key_project_employ = `${firstOption}_${secondOption}_${thirdOption}`;

      // Se la combinazione non esiste nell'accumulatore, la inizializziamo
      if (!acc[key_project_employ]) {
        acc[key_project_employ] = {
          [selectedFirstOption]: firstOption,
          [selectedSecondOption]: secondOption,
          [key]: thirdOption,
          hours: 0
        };
      }

      acc[key_project_employ].hours += entry.hours;

      return acc;
    }, {});

    setArrayDataGrouped(Object.values(result));
  }



  useEffect(() => {
    load();
  }, [])


  const handleSelectChange1 = (event) => {
    const valueSelected = event.target.value
    setSelectedFirstOption(valueSelected);
    setSelectedSecondOption("noGrouping")
    setSelectedThirdOption("noGrouping")
    if (valueSelected === "noGrouping") {
      setSecondButtonDisabled(true)

    } else {
      setSecondButtonDisabled(false)

    }
    setThirdButtonDisabled(true)

  };

  const handleSelectChange2 = (event) => {
    const valueSelected = event.target.value

    setSelectedSecondOption(event.target.value);
    setSelectedThirdOption("noGrouping")

    if (valueSelected === "noGrouping") {
      setThirdButtonDisabled(true)

    } else
      setThirdButtonDisabled(false)
  };

  const handleSelectChange3 = (event) => {
    setSelectedThirdOption(event.target.value);
  };


  return (
    <>
      <div>
        <div className="row g-2">
          <div className="col-md">
            <div className="form-floating" onChange={(e) => groupData(e.target.value)}>
              <select className="form-select" id="floatingSelectGrid"
                      value={selectedFirstOption}
                      onChange={handleSelectChange1}>
                {groupByOptions.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <label htmlFor="floatingSelectGrid">Seleziona il tipo di raggrupamento</label>
            </div>
          </div>
          <div className="col-md">
            <div className="form-floating"
                 onChange={(e) => groupDataTwoFilters(e.target.value)}>
              <select className="form-select" id="floatingSelectGrid"
                      value={selectedSecondOption}
                      onChange={handleSelectChange2}
                      disabled={secondButtonDisabled}
              >
                {secondGroupByOptions.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <label htmlFor="floatingSelectGrid">Seleziona il tipo di raggrupamento secondo livelllo</label>
            </div>
          </div>
          <div className="col-md">
            <div className="form-floating"
                 onChange={(e) => groupDataThirdFilters(e.target.value)}
            >
              <select className="form-select" id="floatingSelectGrid"
                      value={selectedThirdOption}
                      onChange={handleSelectChange3}
                      disabled={thirdButtonDisabled}
              >
                {thirdGroupOptions.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <label htmlFor="floatingSelectGrid">Seleziona il tipo di raggrupamento secondo livelllo</label>
            </div>
          </div>

        </div>
      </div>
      <div>
        <MyTable data={arrayDataGrouped}/>
      </div>
    </>
  )
}


export default MyPage;