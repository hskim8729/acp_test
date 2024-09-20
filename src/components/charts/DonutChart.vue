<template>
  <apexchart
    :width="width"
    type="donut"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'DonutChart',

  components: {
    apexchart: VueApexCharts,
  },

  props: {
    width: {
      type: String,
      default: '100%',
    },
    title: {
      type: String,
      default: '',
    },
    labels: {
      type: Array,
      default: function () {
        return [];
      },
    },
    legendPosition: {
      type: String,
      default: 'bottom',
    },
    series: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },

  watch: {
    series: function () {
      this.updateSeries();
    },
    labels: function () {
      this.updateLabels();
    },
  },

  data: function () {
    return {
      chartOptions: {
        labels: [],
        legend: {
          show: true,
          position: this.legendPosition,
          fontSize: '13px',
          fontFamily: 'NotoSansKR, Helvetica, Arial',
          fontWeight: 400,
          // offsetX: 0,
          offsetY: 10,

          formatter: function (val, opts) {
            // console.log(val, opts);
            return val + ' : ' + opts.w.globals.series[opts.seriesIndex];
          },
        },
        title: {
          text: this.title,
        },
        plotOptions: {
          pie: {
            donut: {
              size: '60%',
              labels: {
                show: true,
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Total',
                  fontSize: '23px',
                  fontFamily: 'NotoSansKR, Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  formatter: function (w) {
                    return (
                      w.globals.seriesTotals.reduce((a, b) => {
                        return a + b;
                      }, 0) + '건'
                    );
                  },
                },
              },
            },
          },
        },
        tooltip: {
          enabled: false,
          // fillSeriesColor: true,
          // theme: 'light',
        },
        // theme: {
        //   palette: 'palette1',
        // },
        // fill: {
        //   colors: ['#5cc8ea', '#7c86de', '#97d670', '#ff5c00'], // 순서대로 색 지정
        // },
        dataLabels: {
          enabled: true,
          // formatter: function (val) {
          //   return Math.round(val) + '%';
          // },
          style: {
            fontSize: '12px',
            fontFamily: 'NotoSansKR, Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: ['#fff'],
          },
        },
        colors: ['#7BD047', '#28B6E3', '#FF5C00', '#9ba0a6'], // 순서대로 색 지정
      },
    };
  },
  mounted() {
    console.log('DonutChart > mounted() > this.labels : ', this.labels);
    this.chartOptions.labels = this.labels;
  },
  updated() {},

  methods: {
    updateSeries() {
      // this.chartOptions = {
      //   ...this.chartOptions,
      //   ...{
      //     xaxis: {
      //       categories: this.categories,
      //     },
      //   },
      // };
      // this.chartOptions.labels = this.labels;
      // console.log(
      //   'DonutChart.vue > updateSeries() > this.chartOptions : ',
      //   this.chartOptions,
      // );
    },
    updateLabels() {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          labels: this.labels,
        },
      };
      // this.chartOptions.labels = this.labels;
      console.log(
        'DonutChart.vue > updateLabels() > this.chartOptions : ',
        this.chartOptions,
      );
    },
  },
};
</script>
