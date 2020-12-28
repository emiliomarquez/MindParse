import "../styles/TimerStats.css";

// Import Libraries
import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

export default class TimerStats extends Component {
    constructor(props) {
        super(props);

        const date = new Date();
        this.date = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        this.time = new Date(this.date).getTime()

        const startingDate = new Date(this.date);
        startingDate.setDate(date.getDate() - 7);
        this.startingTime = startingDate.getTime();

        this.state = {
            popupOpen: false,

            options: {
                chart: {
                    id: 'area-datetime',
                    type: 'area',
                    height: 350,
                    zoom: {
                        autoScaleYaxis: true
                    }
                },
                title: {
                    text: 'Timer Overview',
                    align: 'Center',
                    offsetX: 0,
                    offsetY: 20,
                    style: {
                        fontSize: '1.5em'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Count',
                        align: 'Center',
                        style: {
                            fontSize: '1em'
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                    style: 'hollow',
                },
                xaxis: {
                    type: 'datetime',
                    min: this.startingTime,
                    max: this.time,
                    tickAmount: 2,
                },
                tooltip: {
                    x: {
                        format: 'dd MMM yyyy'
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    }
                },
            },

            selection: 'one_week',
        };
    }

    openPopup = () => {
        this.setState({popupOpen: true});
    };

    closePopup = () => {
        this.setState({popupOpen: false});
        this.updateData("one_week")
    };

    updateData(timeline) {
        const tempDate = new Date(this.date);
        this.setState({
            selection: timeline
        })

        switch (timeline) {
            case 'one_week':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    this.startingTime,
                    this.time
                )
                break;
            case 'one_month':
                tempDate.setMonth(tempDate.getMonth() - 1);
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    tempDate.getTime(),
                    this.time
                )
                break;
            case 'one_year':
                tempDate.setFullYear(tempDate.getFullYear() - 1);
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    tempDate.getTime(),
                    this.time
                )
                break;
            case 'ytd':
                const date = new Date("1 1 " + tempDate.getFullYear())
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    date.getTime(),
                    this.time
                )
                break;
            case 'all':
                console.log("minTime = " + this.props.minTime)
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    this.props.minTime,
                    this.time
                )
                break;
            default:
        }
    }

    render() {

            return (
                <div>
                    <button className="openButton" onClick={this.openPopup}> Click Here to See Timer Stats </button>

                    <Popup open={this.state.popupOpen}
                           onClose={this.closePopup} position={"right center"}
                    >
                        <button className="close" onClick={this.closePopup}>
                            &times;
                        </button>

                        <div id="chart">
                            <div className="toolbar">
                                <button id="one_week"
                                        onClick={()=>this.updateData('one_week')}
                                        className={ (this.state.selection==='one_week' ? 'active' : 'inactive')}>
                                    1W
                                </button>
                                &nbsp;
                                <button id="one_month"
                                        onClick={()=>this.updateData('one_month')}
                                        className={ (this.state.selection==='one_month' ? 'active' : 'inactive')}>
                                    1M
                                </button>
                                &nbsp;
                                <button id="one_year"
                                        onClick={()=>this.updateData('one_year')}
                                        className={ (this.state.selection==='one_year' ? 'active' : 'inactive')}>
                                    1Y
                                </button>
                                &nbsp;
                                <button id="ytd"
                                        onClick={()=>this.updateData('ytd')}
                                        className={ (this.state.selection==='ytd' ? 'active' : 'inactive')}>
                                    YTD
                                </button>
                                &nbsp;
                                <button id="all"
                                        onClick={()=>this.updateData('all')}
                                        className={ (this.state.selection==='all' ? 'active' : 'inactive')}>
                                    ALL
                                </button>

                            </div>

                            <div id="chart-timeline">
                                <ReactApexChart options={this.state.options}
                                                series={this.props.series}
                                                type="area"/>
                            </div>
                        </div>
                    </Popup>
                </div>
            );

    }
}
