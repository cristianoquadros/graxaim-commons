import {
  Component, ElementRef, Inject, OnInit, forwardRef, Input, Output, EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe.js'

import { DateModel, CalendarDate } from './datepicker.interface';
import { DatePickerOptions } from './datepicker.data';

import * as moment from 'moment';
import 'moment/locale/pt-br';

const Moment: any = (<any>moment).default || moment;
const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

@Component({
  selector: 'gx-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {

  @Input() options: DatePickerOptions;
  @Input() inputEvents: EventEmitter<{ type: string, data: string | DateModel }>;
  @Output() outputEvents: EventEmitter<{ type: string, data: string | DateModel }>;

  dateMask = {
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    guide: true,
    placeholderChar: '\u2000',
    keepCharPositions: true,
    pipe: autoCorrectedDatePipe
  };

  date: DateModel;

  opened: boolean;
  currentDate: moment.Moment;
  days: CalendarDate[];
  years: number[];
  yearPicker: boolean;

  minDate: moment.Moment | any;
  maxDate: moment.Moment | any;

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor( @Inject(ElementRef) public el: ElementRef) {
    this.opened = false;
    this.currentDate = Moment();
    this.options = this.options || {};
    this.days = [];
    this.years = [];
    this.date = this.createDataModel();

    this.generateYears();

    this.outputEvents = new EventEmitter<{ type: string, data: string | DateModel }>();

    if (!this.inputEvents) {
      return;
    }

    this.inputEvents.subscribe((event: { type: string, data: string | DateModel }) => {
      if (event.type === 'setDate') {
        this.value = event.data as DateModel;
      } else if (event.type === 'default') {
        if (event.data === 'open') {
          this.open();
        } else if (event.data === 'close') {
          this.close();
        }
      }
    });
  }

  createDataModel() : DateModel{
    return new DateModel({
          day: null,
          month: null,
          year: null,
          formatted: null,
          momentObj: null
        });
  }

  get value(): DateModel {
    return this.date;
  }

  set value(date: DateModel) {
    this.date = date;
    this.onChangeCallback(date ? date.momentObj : date);
  }

  ngOnInit() {
    this.options = new DatePickerOptions(this.options);
    if (this.options.initialDate instanceof Date) {
      this.currentDate = Moment(this.options.initialDate);
      this.selectDate(null, this.currentDate);
    }

    if (this.options.minDate instanceof Date) {
      this.minDate = Moment(this.options.minDate);
    } else {
      this.minDate = null;
    }

    if (this.options.maxDate instanceof Date) {
      this.maxDate = Moment(this.options.maxDate);
    } else {
      this.maxDate = null;
    }

    this.generateCalendar();
    this.outputEvents.emit({ type: 'default', data: 'init' });

    if (typeof window !== 'undefined') {
      let body = document.querySelector('body');
      body.addEventListener('click', e => {
        if (!this.opened || !e.target) { return; };
        if (this.el.nativeElement !== e.target && !this.el.nativeElement.contains((<any>e.target))) {
          this.close();
        }
      }, false);
    }

    if (this.inputEvents) {
      this.inputEvents.subscribe((e: any) => {
        if (e.type === 'action') {
          if (e.data === 'toggle') {
            this.toggle();
          }
          if (e.data === 'close') {
            this.close();
          }
          if (e.data === 'open') {
            this.open();
          }
        }

        if (e.type === 'setDate') {
          if (!(e.data instanceof Date)) {
            throw new Error(`Input data must be an instance of Date!`);
          }
          let date: moment.Moment = Moment(e.data);
          if (!date) {
            throw new Error(`Invalid date: ${e.data}`);
          }
          this.value = this.convertToDataModel(date);
        }
      });
    }
  }

  convertToDataModel(momentDate: moment.Moment) : DateModel {
    let dmValue: DateModel=null;
    if (momentDate) {
        dmValue = new DateModel({
        day: momentDate.format('DD'),
        month: momentDate.format('MM'),
        year: momentDate.format('YYYY'),
        formatted: momentDate.format(this.options.format),
        momentObj: momentDate
      });
    }
    return dmValue;
  }

  generateCalendar() {
    let date: moment.Moment = Moment(this.currentDate);
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay = (this.options.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    this.days = [];
    let selectedDate: moment.Moment = this.date.momentObj;
    for (let i = n; i <= date.endOf('month').date(); i += 1) {
      let currentDate: moment.Moment = Moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      let today: boolean = (Moment().isSame(currentDate, 'day') && Moment().isSame(currentDate, 'month')) ? true : false;
      let selected: boolean = (selectedDate && selectedDate.isSame(currentDate, 'day')
                              && selectedDate.isSame(currentDate, 'month')
                              && selectedDate.isSame(currentDate, 'year'));
      let betweenMinMax = true;
      let sunday = currentDate.isoWeekday()==7;

      if (this.minDate !== null) {
        if (this.maxDate !== null) {
          betweenMinMax = currentDate.isBetween(this.minDate, this.maxDate, 'day', '[]') ? true : false;
        } else {
          betweenMinMax = currentDate.isBefore(this.minDate, 'day') ? false : true;
        }
      } else {
        if (this.maxDate !== null) {
          betweenMinMax = currentDate.isAfter(this.maxDate, 'day') ? false : true;
        }
      }

      let day: CalendarDate = {
        day: i > 0 ? i : null,
        month: i > 0 ? month : null,
        year: i > 0 ? year : null,
        enabled: i > 0 ? betweenMinMax : false,
        today: i > 0 && today,
        selected: i > 0 && selected,
        sunday: i > 0 && sunday,
        momentObj: currentDate
      };
      this.days.push(day);
    }
  }

  selectDate(event: MouseEvent, date: moment.Moment) {
    if (event) { event.preventDefault(); }

    setTimeout(() => {
      this.value = {
        day: date.format('DD'),
        month: date.format('MM'),
        year: date.format('YYYY'),
        formatted: date.format(this.options.format),
        momentObj: date
      };
      this.generateCalendar();

      this.outputEvents.emit({ type: 'dateChanged', data: this.value });
    });

    if (this.options.autoApply === true && this.opened === true) {
      this.opened = false;
    }
  }

  selectYear(e: MouseEvent, year: number) {
    e.preventDefault();

    setTimeout(() => {
      let date: moment.Moment = this.currentDate.year(year);
      this.value = {
        day: date.format('DD'),
        month: date.format('MM'),
        year: date.format('YYYY'),
        formatted: date.format(this.options.format),
        momentObj: date
      };
      this.yearPicker = false;
      this.generateCalendar();
    });
  }

  generateYears() {
    let date: moment.Moment = this.options.minDate || Moment().year(Moment().year() - 40);
    let toDate: moment.Moment = this.options.maxDate || Moment().year(Moment().year() + 40);
    let years = toDate.year() - date.year();

    for (let i = 0; i < years; i++) {
      this.years.push(date.year());
      date.add(1, 'year');
    }
  }

  writeValue(date: DateModel | moment.Moment) {
    if (!date) { this.value = null; return; }
    if(date instanceof Moment) {
      this.value = new DateModel({momentObj: <moment.Moment>date});
    } else {
      this.value = <DateModel>date;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  today() {
    this.currentDate = Moment();
    this.selectDate(null, this.currentDate);
  }

  toggle() {
    this.opened = !this.opened;
    if (this.opened) {
      this.onOpen();
    }

    this.outputEvents.emit({ type: 'default', data: 'opened' });
  }

  open() {
    this.opened = true;
    this.onOpen();
  }

  close() {
    this.opened = false;
    this.outputEvents.emit({ type: 'default', data: 'closed' });
  }

  onOpen() {
    this.yearPicker = false;
  }

  openYearPicker() {
    setTimeout(() => this.yearPicker = true);
  }


  closeYearPicker() {
    setTimeout(() => this.yearPicker = false);
  }

  onDateChange(event:Event){
      if (event) { event.preventDefault(); }
      let dateStr = (<HTMLInputElement>event.target).value;
      if (!dateStr || dateStr.length==0){
        this.value=null;
        return;
      }
      let dateMom = moment(dateStr, "DD-MM-YYYY");
      if (dateMom.isValid()){
         this.currentDate = dateMom;
         this.value = this.convertToDataModel(dateMom);

         this.outputEvents.emit({ type: 'dateChanged', data: this.value });
         this.opened = false;
      }else{
         this.value = this.createDataModel();
      }
      setTimeout(() => {
        this.generateCalendar();
      });
  }
}
