import "./ProjectChart.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import {Bar} from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
);

const ProjectChart=()=>{

const data={

labels:["Mon","Tue","Wed","Thu","Fri","Sat"],

datasets:[
{
label:"Completed",

data:[8,12,10,16,20,14],

backgroundColor:"#5B5FEF",

borderRadius:8

}
]

};

const options={

responsive:true,

plugins:{
legend:{
display:false
}
}

};

return(

<div className="chart-card">

<h2>Weekly Productivity</h2>

<Bar
data={data}
options={options}
/>

</div>

);

};

export default ProjectChart;