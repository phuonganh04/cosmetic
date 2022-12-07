import moment from "moment";

export const NumberUtils = {
  formatNumber: (num: string | number | undefined) => {
    if ((typeof num === 'string' && !num.length) || num === null || num === undefined) {
      return null;
    }

    if (!num) return 0;

    const parts = num.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  },
}

export const DateTimeUtils = {
  dateConverterToString: (dateString: string|Date|undefined, formatString = 'hh:mm:ss DD/MM/YYYY') => {
    if (!dateString) return '';
    const dateWithMoment = moment(dateString);
    return dateWithMoment.format(formatString);
  },
}
