import * as moment from 'moment';

const Moment: any = (<any>moment).default || moment;

export interface IDateModel {
  day?: string;
  month?: string;
  year?: string;
  formatted?: string;
  momentObj: moment.Moment;
}

export class DateModel {
  day: string;
  month: string;
  year: string;
  formatted: string;
  momentObj: moment.Moment;

  constructor(obj?: IDateModel) {
    this.momentObj = obj && obj.momentObj ? obj.momentObj : null;
    if(this.momentObj) {
      obj.day = this.momentObj.format('DD');
      obj.month = this.momentObj.format('MM');
      obj.year = this.momentObj.format('YYYY');;
      obj.formatted = this.momentObj.format('L');
    }
    this.day = obj && obj.day ? obj.day : null;
    this.month = obj && obj.month ? obj.month : null;
    this.year = obj && obj.year ? obj.year : null;
    this.formatted = obj && obj.formatted ? obj.formatted : null;
  }

  static valueOf(tstamp: Timestamp): DateModel{
      let time = new Number(tstamp.timestamp);
      let date: moment.Moment = Moment(time.valueOf());
      return new DateModel({
          day:date.format('DD'),
          month:date.format('MM'),
          year:date.format('YYYY'),
          formatted: tstamp.txt,
          momentObj: date     
      })
    }
}

export interface IDatePickerOptions {
  autoApply?: boolean;
  style?: 'normal' | 'big' | 'bold';
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  initialDate?: Date;
  firstWeekdaySunday?: boolean;
  format?: string;
}

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
  today: boolean;
  sunday?: boolean;
  selected: boolean;
  momentObj: moment.Moment;
}


export interface Timestamp {
  timestamp: number;
  txt: string;
}