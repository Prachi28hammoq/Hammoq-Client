import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { Dropdown, Button } from 'semantic-ui-react'

const FilterBar = (props) => {

    const [monthDropdownOptions, setMonthDropdownOptions] = useState([
        { text: 'January', value: 'January' },
        { text: 'February', value: 'February' },
        { text: 'March', value: 'March' },
        { text: 'April', value: 'April' },
        { text: 'May', value: 'May' },
        { text: 'June', value: 'June' },
        { text: 'July', value: 'July' },
        { text: 'August', value: 'August' },
        { text: 'September', value: 'September' },
        { text: 'October', value: 'October' },
        { text: 'November', value: 'November' },
        { text: 'December', value: 'December' }]);

    const [yearDropdownOptions, setYearDropdownOptions] = useState([
        { text: '2019', value: '2019' },
        { text: '2020', value: '2020' },
        { text: '2021', value: '2021' },
        { text: '2022', value: '2022' },
    ]);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [previousOrCurrentMonth, setPreviousOrCurrentMonth] = useState('CURRENT_MONTH')

    let monthNameNumberMap = new Map();

    monthNameNumberMap.set(1, 'January');
    monthNameNumberMap.set(2, 'February');
    monthNameNumberMap.set(3, 'March');
    monthNameNumberMap.set(4, 'April');
    monthNameNumberMap.set(5, 'May');
    monthNameNumberMap.set(6, 'June');
    monthNameNumberMap.set(7, 'July');
    monthNameNumberMap.set(8, 'August');
    monthNameNumberMap.set(9, 'September');
    monthNameNumberMap.set(10, 'October');
    monthNameNumberMap.set(11, 'November');
    monthNameNumberMap.set(12, 'December');

    useEffect(() => {

        let month, year;

        if(previousOrCurrentMonth == 'CURRENT_MONTH') {

            month = new Date().getMonth();
            year = new Date().getFullYear();

            setSelectedMonth(monthNameNumberMap.get(month + 1));
            setSelectedYear('' + year + '');
        }

        if(previousOrCurrentMonth == 'PREVIOUS_MONTH') {

            month = new Date().getMonth() - 1;
            year = new Date().getFullYear();

            setSelectedMonth(monthNameNumberMap.get(month + 1));
            setSelectedYear('' + year + '');
        }

    }, [previousOrCurrentMonth])

    useEffect(() => {

        props.setFilterYearAndMonth(selectedYear, selectedMonth);

    }, [selectedYear, selectedMonth])

    const handleYearSelection =  (e, { value }) => {
        setPreviousOrCurrentMonth('');
        setSelectedYear(value);
    }

    const handleMonthSelection =  (e, { value }) => {
        setPreviousOrCurrentMonth('');
        setSelectedMonth(value);
    }

    return (
        <div className="filter-bar">
            <div className="filter-select-year-dropdown">
                <Dropdown
                    placeholder='Select Year'
                    fluid
                    search
                    selection
                    clearable
                    value={selectedYear}
                    options={yearDropdownOptions}
                    onChange={handleYearSelection}
                />
            </div>
            <div className="filter-select-month-dropdown">
                <Dropdown
                    placeholder='Select Month'
                    fluid
                    search
                    selection
                    clearable
                    value={selectedMonth}
                    options={monthDropdownOptions}
                    onChange={handleMonthSelection}
                />
            </div>
            <div className="current-previous-month-buttons">
                <Button.Group>
                    <Button size="tiny" onClick={() => setPreviousOrCurrentMonth('PREVIOUS_MONTH')} active={previousOrCurrentMonth == 'PREVIOUS_MONTH'}>Previous Month</Button>
                    <Button size="tiny" onClick={() => setPreviousOrCurrentMonth('CURRENT_MONTH')} active={previousOrCurrentMonth == 'CURRENT_MONTH'}>Current Month</Button>
                </Button.Group>
            </div>
            <div className="filter-button">
                <Button color="green" onClick={props.handleFilterTrigger}>Search</Button>
            </div>
        </div>
    );
}

export default FilterBar;