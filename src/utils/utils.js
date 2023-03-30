import moment from "moment";

/**
 * 日付をフォーマットします
 * @param {String} str 
 * @returns {String} Date
 */
export function formatDate(str) {
    const date = moment(str).format('YYYY/MM/DD HH:mm:ss')
    return date;
}