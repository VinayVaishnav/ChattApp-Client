import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
    CategoryScale, 
    Chart,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend,
    plugins,
    scales
} from 'chart.js';
import { getLast7Days } from '../../lib/features';
import { purple } from '@mui/material/colors';

Chart.register(
    CategoryScale,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
);

const labels=getLast7Days();


const LineChart = ({ value = [] }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'TAbles',
                data: value,
                fill: true,
                backgroundColor: '#ffcc80',
                borderColor: "orange",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display:false,
            },
            title: {
                display: false,
            },
        },
        scales:{
            x:{
                grid:{
                    display:false,
                }
            },
            y:{
                beginAtZero:true,
                grid:{
                    display:false,
                }
            },
        }
    };

    return (
        <div style={{width:"100%",height:"100%"}}>
            <Line data={data} options={options} />
        </div>
    );
}

const DoughnutChart = ({value=[],labels=[]}) => {
    const data={
        labels: labels,
        datasets: [
            {
                label: 'Total Chats vs Group Chats',
                data: value,
                fill: true,
                backgroundColor: ["purple","orange"],
                borderColor: ["purple","orange"],
                offset:30,
            },
        ],
    }
    const options={
        responsive:true,
        plugins:{
            legend:{
                display:false,
            }
        },
        cutout:120,

    }
    return (
        <Doughnut style={{zIndex:10}} data={data} options={options}/>
    )
  }

export {LineChart,DoughnutChart}
