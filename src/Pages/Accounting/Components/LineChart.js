import React, { useRef, useEffect } from 'react';
//import Chart from 'chart.js';

const LineChart = (props) => {

    const chartRef = useRef(null);

    useEffect(() => {

/*        let myLineChart = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: props.data1.length > props.data2.length ? props.data1.map((d, index) => index + 1) : props.data2.map((d, index) => index + 1),
                datasets: [{
                  label: 'Current Month',
                  data: props.data1,
                  borderColor: '#7FDEFF',
                  backgroundColor: 'white'
                },
                {
                    label: 'Previous Month',
                    data: props.data2,
                    borderColor: '#758ECD',
                    backgroundColor: 'white'
                  }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true
              }
        });*/

    }, [props.data1, props.data2]);

    return(
        <canvas ref={chartRef} />
    );
}

export default LineChart;