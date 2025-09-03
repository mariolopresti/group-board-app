import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import {MyTable} from "./components/myTable/index.jsx";


const MyPage = () => {

  const groupByOptions = [
    {value: 'noGrouping', label: 'Nessuno'},
    {value: 'project_name', label: 'Progetto'},
    {value: 'employ_name', label: 'Dipendente'},
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
      const response = await axios.get("http://localhost:3040/api/activities");
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

  const extracted = (options) => {
    const result = arrayData.reduce((acc, entry) => {

      const keyParts = options.map(option => entry[option]); // Array di valori per ogni opzione
      const key_acc = keyParts.join('_'); // Unisce i valori per creare una chiave unica

      // Se la combinazione non esiste nell'accumulatore, la inizializziamo
      if (!acc[key_acc]) {
        const newEntry = {};
        options.forEach((option, index) => {
          newEntry[option] = entry[option];
        })
        newEntry.hours = 0; // Inizializza le ore
        acc[key_acc] = newEntry;
      }
      // Somma le ore alla combinazione di chiave esistente
      acc[key_acc].hours += entry.hours;
      return acc;
    }, {});

    return result;
  }

  const groupData = async (options) => {
    if (options.length == 1) {
      if (options.includes('noGrouping')) {
        return fetchAll()
      }
      const groupByOptionsUpdated = groupByOptions.filter(filter => !options.includes(filter.value));
      setSecondGroupByOptions(groupByOptionsUpdated)
    }
    if (options.length == 2) {
      const groupByOptionsUpdated = !options.includes('noGrouping') ? secondGroupByOptions.filter(filter => !options.includes(filter.value)) : secondGroupByOptions;
      setThirdGroupByOptions(groupByOptionsUpdated)
    }
    const result = extracted(options);
    setArrayDataGrouped(Object.values(result));
  }

  useEffect(() => {
    load();
  }, [])

  const handleSelectChange = (event) => {
    const { value, name } = event.target;

    switch (name) {
      case 'firstOption':
        setSelectedFirstOption(value);
        setSelectedSecondOption("noGrouping")
        setSelectedThirdOption("noGrouping")
        if (value === "noGrouping") {
          setSecondButtonDisabled(true)
        } else {
          setSecondButtonDisabled(false)
        }
        setThirdButtonDisabled(true)
        return
      case 'secondOption': // Se è il primo select
        setSelectedSecondOption(value);
        setSelectedThirdOption("noGrouping")
        if (value === "noGrouping") {
          setThirdButtonDisabled(true)
        } else
          setThirdButtonDisabled(false)
        return;
      case 'thirdOption': // Se è il primo select
        setSelectedThirdOption(value);
        return;
    }
  };

  return (
    <>
      <div className="selector-container">
        <div className="row g-4">
          <div className="col-md">
            <div className="form-floating">
              <select className="form-select" id="floatingSelectGrid" name="firstOption"
                      value={selectedFirstOption}
                      onChange={(e) => {
                        handleSelectChange(e);
                        groupData([e.target.value]);
                      }}>
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
            <div className="form-floating" >
              <select className="form-select" id="floatingSelectGrid" name="secondOption"
                      value={selectedSecondOption}
                      onChange={(e) => {
                        handleSelectChange(e);
                        groupData([selectedFirstOption, e.target.value]);
                      }}
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
            <div className="form-floating">
              <select className="form-select" id="floatingSelectGrid" name="thirdOption"
                      value={selectedThirdOption}
                      onChange={(e) => {
                        handleSelectChange(e);
                        groupData([selectedFirstOption, selectedSecondOption, e.target.value]);
                      }}
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
      <div className="table-wrapper">
        <MyTable data={arrayDataGrouped}/>
      </div>
    </>
  )
}

export default MyPage;