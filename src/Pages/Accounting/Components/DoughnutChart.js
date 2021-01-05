import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';

const DoughnutChart = (props) => {

    const chartRef = useRef(null);

    useEffect(() => {

        var myDoughnutChart = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {                
                datasets: [{
                  data: props.data,
                  backgroundColor: ['#81E979', '#E6AA68'],
                }],
                labels: [
                  'Income',
                  'Expenses'
                ]
              },
            options: {
                responsive: true,
                maintainAspectRatio: true
              }
            })
    }, [props.data]);

    return(
        <canvas ref={chartRef} />
    );

}

export default DoughnutChart;