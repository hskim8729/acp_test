<template>
  <apexchart
    :width="width"
    :height="height"
    type="line"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
// import commonUtils from '@/utils/common-utils';

export default {
  name: 'LineChart',

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
    title: {
      type: String,
      default: '',
    },
    legendPosition: {
      type: String,
      default: 'bottom',
    },
    xaxisType: {
      type: String,
      default: '',
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
  data: function () {
    return {
      chartOptions: {
        stroke: {
          curve: 'straight',
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          type: '',
          categories: [],
        },
        yaxis: {
          labels: {
            // eslint-disable-next-line no-unused-vars
            formatter: function (val, index) {
              if (!val) return '';
              // return commonUtils.$convertNumberFormat(val, '#,#')
              return val;
            },
          },

          min: 0,
          max: 100,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              if (!val) return '';
              // return commonUtils.$convertNumberFormat(val, '#,#.00')
              return val;
            },
          },
        },
        legend: {
          show: true,
          position: this.legendPosition,
        },
        title: {
          text: this.title,
        },

        colors: ['#FF5C00', '#28B6E3'],
      },
    };
  },
  mounted() {
    this.chartOptions.xaxis.type = this.xaxisType;
    this.chartOptions.xaxis.categories = this.categories;
    // console.log(
    //   'lineChart.vue > mounted() > this.chartOptions, this.series : ',
    //   this.chartOptions,
    //   this.series
    // )
  },
  updated() {},
};
</script>
