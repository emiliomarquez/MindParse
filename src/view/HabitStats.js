import "../styles/HabitStats.css";

// Import Libraries
import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReactApexChart from 'react-apexcharts';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export default class HabitStats extends Component {

    constructor(props) {
        super(props);
        var test = "rgb(" + getRandomInt(255).toString() + "," + getRandomInt(255).toString() + "," + getRandomInt(255).toString() + ")";

        this.state = {
            values: [],
            series: [{
                data: this.props.hValues
            }],

            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    events: {
                        click: function(chart, w, e) {
                            // console.log(chart, w, e)
                        }
                    }
                },
                title: {
                    text: 'Habit Overview',
                    align: 'Center'
                },
                colors: this.props.hColors,
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    title: {
                        text: 'Habit Names',
                        fontSize: '36px'
                    },
                    categories: this.props.hNames,
                    labels: {
                        style: {
                            colors: this.props.hColors,
                            fontSize: '12px'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Habit Streaks',
                        fontSize: '36px'
                    }
                }
            },
        };
    }

    openPopup = () => {
        this.setState({popupOpen: true});
    };

    closePopup = () => {
        this.setState({popupOpen: false});
    };

    render() {
        console.log(this.state.series);
        console.log("categories = " + this.state.options.xaxis.categories);
        console.log("series = " + this.state.series[0].data);

        return (

            <div>
                <button className="habitStatsButton" onClick={this.openPopup}>Click Here To See Habit Stats</button>
                <Popup open={this.state.popupOpen}
                       onClose={this.closePopup} position={"right center"}
                >
                    <button className="close" onClick={this.closePopup}>
                        &times;
                    </button>
                    <div id="chart">
                        <ReactApexChart options={this.state.options}
                                        series={this.state.series}
                                        type="bar"
                                        height={350} />
                    </div>

                </Popup>
            </div>
        );

    }
}