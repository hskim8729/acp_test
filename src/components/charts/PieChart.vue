<template>
  <apexchart
    :width="width"
    type="pie"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'PieChart',

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
      default: 'right',
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
        chart: {
          type: 'pie',
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: this.legendPosition,
              },
            },
          },
        ],
        title: {
          text: this.title,
        },
      },
    };
  },
  mounted() {
    this.chartOptions.labels = this.labels;
  },
  updated() {},
};
</script>
