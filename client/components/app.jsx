import React from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';




class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartContent: [],
      fromDate: '',
      toDate: '',
      isLoading: true,
    };
  }
  componentWillMount() {
    this.runDefaultChart()
  }

  runDefaultChart() {
    const fromDate = this.getDate(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const toDate = this.getDate(Date.now())
    console.log(fromDate, toDate)
    this.setState({ fromDate, toDate }, () => this.processData());
  }

  getDate(date) {
    let day = new Date(date).getDate() + 1;
    let month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    if(month.toString().length === 1) {
      month = `0${month}`;
    }
    if(day.toString().length === 1) {
      day = `0${day}`;
    }

    return `${year}-${month}-01`;
  }

  fetch(index, currency, start, end) {
    return axios.get('/history', {
      params: { index, currency, start, end }
    });
  }

  processData(index='USD', currency='USD') {
    const start = this.state.fromDate;
    const end = this.state.toDate;

    if(new Date(end) - new Date(start) <= 0) {
      alert('invalid date range');
      this.runDefaultChart()
    } else{
      this.fetch(index, currency, start, end).then((response) => {
        const xCoordinates = Object.keys(response.data);
        xCoordinates.sort((a, b) => {
          if(new Date(a) < new Date(b)) {
            return -1;
          }
          if(new Date(a) >= new Date(b)) {
            return 1;
          }
        });

        const yCoordinates = xCoordinates.map(coordinate => response.data[coordinate]);

        const chartLabel = `BitCoin Price Index (${currency}) from ${start} to ${end}`;
        const chartContent = this.getChartContent(xCoordinates, yCoordinates, chartLabel)

        this.setState({ chartContent, isLoading: false });
      });
    }
  }

  getChartContent(xCoordinates, yCoordinates, chartLabel) {
    const data = {
      labels: xCoordinates,
      datasets: [
        {
          label: chartLabel,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: yCoordinates
        }
      ]
    };
    return data;
  }

  handleClick() {
    this.setState({ isLoading: true}, () => this.processData())
  }

  handleDateClick(e, type) {
    const key = `${type}Date`;
    const obj = {};
    obj[key] = e.target.value;
    this.setState(obj);
  }

  render() {
    if(this.state.isLoading) return null;
    return(
      <div>
        <Line data={this.state.chartContent} />
        <input type="date" id="from" placeholder="FROM" value={this.state.fromDate} onChange={(e) => this.handleDateClick(e, 'from')}/>
        <input type="date" id="to" placeholder="TO" value={this.state.toDate} onChange={(e) => this.handleDateClick(e, 'to')}/>
        <button onClick={() => this.handleClick()}>GO</button>
      </div>
    );
  }
}


export default App;