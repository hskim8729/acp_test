export default {
    template: `
        <div class="custom-tooltip" v-bind:style="{ backgroundColor: color }">
            <p><span>{{ data.lgCatNm }}</span></p>
            <p><span>{{ data.mdCatNm }}</span></p>
            <p><span>{{ data.smCatNm }}</span></p>
        </div>
      `,
    data: function () {
      return {
        color: null,
        lgCatNm: null,
        mdCatNm: null,
        smCatNm: null,
      };
    },
    beforeMount() {
      this.data = this.params.api.getDisplayedRowAtIndex(
        this.params.rowIndex
      ).data;
      this.color = this.params.color || 'white';
    },
  };
  