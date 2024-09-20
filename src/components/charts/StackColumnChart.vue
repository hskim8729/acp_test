<template>
  <apexchart
    :width="width"
    :height="height"
    type="bar"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import commonUtils from '@/utils/common-utils';

export default {
  name: 'StackColumnChart',

  components: {
    apexchart: VueApexCharts,
  },

  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    yaxisTitle: {
      type: String,
      default: '',
    },
    is100: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      default: function () {
        return [];
      },
    },
    series: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },

  // watch: {
  //   series: function () {
  //     this.updateSeries()
  //   }
  // },

  data: function () {
    return {
      chartData: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        // theme: {
        //   palette: 'palette3',
        // },

        // 활성화시 데이터가 표시안되는 문제 발생
        // responsive: [
        //   {
        //     breakpoint: 480,
        //     options: {
        //       legend: {
        //         position: 'bottom',
        //         // offsetX: -10,
        //         // offsetY: 10,
        //       },
        //     },
        //   },
        // ],
        legend: {
          show: true,
          position: 'bottom',
          fontSize: '13px',
          fontFamily: 'NotoSansKR, Helvetica, Arial',
          fontWeight: 400,
          offsetY: 10,

          formatter: function (val, opts) {
            return val + ' : ' + opts.w.globals.series[opts.seriesIndex];
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            // 소수점 첫째자리까지 반올림
            // return val === 0 ? '' : val.toFixed(1) + '%';
            // 반올림 처리
            return val === 0 ? '' : Math.round(val) + '%';
          },
          style: {
            fontSize: '12px',
            fontFamily: 'NotoSansKR, Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            // colors: undefined,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        xaxis: {
          type: '',
          categories: [],
          labels: {
            show: false,
          },
        },
        yaxis: {
          show: false,
          labels: {
            // eslint-disable-next-line no-unused-vars
            formatter: function (val, index) {
              // if (!val) return '';
              return commonUtils.convertNumberFormat(val, '#,#');
              // return '';
            },
          },
        },
        tooltip: {
          enabled: false,
          // y: {
          //   formatter: function (val) {
          //     if (!val) return '';
          //     return commonUtils.convertNumberFormat(val, '#,#');
          //   },
          // },
        },
        // legend: {
        //   position: 'right',
        //   offsetY: 40
        // },
        fill: {
          opacity: 1,
        },
        colors: ['#A6AAAE', '#AE9384', '#28B6E3', '#FF5C00'], // 순서대로 색 지정
      },
    };
  },
  mounted() {
    this.chartOptions.xaxis.type = this.xaxisTye;
    this.chartOptions.xaxis.categories = this.categories;
    if (this.is100) {
      this.chartOptions.chart.stackType = '100%';
    }
    // console.log(
    //   'StackColumnChart.vue > mounted() > this.chartOptions, this.series : ',
    //   this.chartOptions,
    //   this.series
    // )
  },
  updated() {
    // console.log(
    //   'StackColumnChart.vue > updated() > this.chartOptions, this.series : ',
    //   this.chartOptions,
    //   this.series
    // )
  },
  methods: {
    // updateSeries() {
    //   console.log(
    //     'StackColumnChart.vue > updateSeriesLine() > this.chartOptions, this.series : ',
    //     this.chartOptions,
    //     this.series
    //   )
    //   // 아래 코드가 없어도 차트데이터 갱신 잘 처리됨
    //   this.chartOptions = {
    //     ...this.chartOptions,
    //     ...{
    //       xaxis: {
    //         categories: this.categories
    //       }
    //     }
    //   }
    //   //this.chartData = [{ data: this.series }]
    //   this.chartData = this.series
    // }
  },
};
</script>
