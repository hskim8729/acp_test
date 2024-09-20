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
// import commonUtils from '@/utils/common-utils';

export default {
  name: 'BarChart',

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

  watch: {
    series: function () {
      this.updateSeries();
    },
  },

  data() {
    return {
      chartData: [],

      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: true, // 수평 bar
            distributed: true,
            barHeight: '100%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        // theme: {
        //   palette: 'palette3',
        // },
        stroke: {
          width: 5,
          colors: ['#fff'],
        },
        xaxis: {
          categories: [],
          labels: {
            // eslint-disable-next-line no-unused-vars
            formatter: function (val, index) {
              if (!val) return '';
              // return commonUtils.convertNumberFormat(val, '#,#');
              return val;
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              if (!val) return '';
              // return commonUtils.convertNumberFormat(val, '#,#');
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
        colors: ['#5cc8ea', '#7c86de', '#ff5c00', '#97d670'], // 순서대로 색 지정
      },
    };
  },
  mounted() {
    // console.log('BarChart > mounted() > this.categories : ', this.categories);
    this.chartOptions.xaxis.categories = this.categories;
  },
  updated() {},
  methods: {
    updateSeries() {
      // console.log(
      //   'BarChart.vue > updateSeriesLine() > this.chartOptions : ',
      //   this.chartOptions,
      // );
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: this.categories,
          },
        },
      };
    },
  },
};
</script>
