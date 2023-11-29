import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";


require("highcharts/modules/exporting")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/modules/solid-gauge")(Highcharts);

export class Chart extends Component {
  state = {};

  Options = () => {
    return {
      lang:{
          downloadCSV:' دریـافت csv ',
          downloadJPEG:' دریـافت JPEG',
          downloadPNG:' دریـافت تصویـر',
          downloadPDF:' دریـافت PDF',
          downloadSVG:' دریـافت SVG',
          downloadXLS:' دریـافت EXCEL',
          viewFullscreen:'نمـایش در تمـام صفحـه',
          printChart:'چـاپ'
      },
      credits: {
        enabled: false
      },
      exporting: this.props.exporting,
        pane:this.props.pane,
      legend: {
        enabled: this.props.legend,
      
      },
      chart: {
        type: this.props.chartType,
        margin: this.props.chartMargin,
        height:this.props.height,
        width:this.props.width,
      },
      title: {
        text: this.props.title,
        style: {
          fontFamily: "iransansBold",
            color: "#fc0000"
        }
      },
      tooltip: this.props.tooltip,
      xAxis: {
        categories: this.props.categories,
        style: {
          fontFamily: "iransansBold"
        }

      },
      yAxis: this.props.yAxis,
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %", style:{fontSize:'16px'}
          }
        },
          solidgauge: {
              dataLabels: {
                  y: -50,
                  borderWidth: 0,
                  useHTML: true
              }
          }
      },
      series: this.props.data
    };
  };

  render() {
    return (
      <div className={"dirLTR "+this.props.className}>
        <HighchartsReact options={this.Options()} highcharts={Highcharts} />
      </div>
    );
  }
}

Chart.defaultProps = {
  legend: true,
  exporting: {
    enabled: true,
   // filename: this.props.filename,
      buttons: {
          contextButton: {
              menuItems: ['downloadPNG', 'downloadCSV',  'downloadPDF','downloadXLS','separator','printChart','viewFullscreen']
          }
      }
  },
  chartType: 'bar',
  filename: 'chart',
    chartMargin:[60,50,50,80],
    yAxis:{
        title:{text:'مقـدار (تعـداد)'},
        style: {
            fontFamily: "iransansBold"
        }

    },
    tooltip:{
        outside: false,
        useHTML: true,

        style: {
            direction: 'ltr'
        },
        className: 'tool-tip',
        // formatter:this.props.tooltipFormatter?this.props.tooltipFormatter.bind(Highcharts):undefined
    }
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
      name:PropTypes.string,
      data:PropTypes.array.isRequired
  })).isRequired,
  title: PropTypes.string,
  categories: PropTypes.array,
  legend: PropTypes.bool,
  chartType: PropTypes.string,
  exporting:PropTypes.any,
  filename: PropTypes.string,
  chartMargin:PropTypes.array,
  tooltipFormatter:PropTypes.func
};
