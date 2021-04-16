import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';

const BarChart = (props) => {

    const chartRef = useRef(null);

    useEffect(() => {

        var myBarChart = new Chart(chartRef.current, {
            type: 'bar',            
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
                         "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
                datasets: props.barChartDataSet
            }
        })
    }, [props.barChartDataSet]);

    return (
        <canvas ref={chartRef} />
    );

}

export default BarChart;