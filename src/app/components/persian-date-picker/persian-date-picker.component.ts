import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface PersianDate {
  year: number;
  month: number;
  day: number;
}

@Component({
  selector: 'app-persian-date-picker',
  templateUrl: './persian-date-picker.component.html',
  styleUrls: ['./persian-date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersianDatePickerComponent),
      multi: true
    }
  ]
})
export class PersianDatePickerComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'تاریخ را انتخاب کنید';
  @Input() disabled = false;
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;
  @Input() showTime = false;
  @Output() dateChange = new EventEmitter<string>();

  selectedDate: PersianDate | null = null;
  displayValue = '';
  isOpen = false;
  
  currentYear = 1403;
  currentMonth = 1;
  
  selectedTime = { hour: 12, minute: 0 };

  // Persian calendar data
  persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  persianDaysOfWeek = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  
  private gMonthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  // Form control interface
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    const now = new Date();
    const persianNow = this.gregorianToPersian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this.currentYear = persianNow.year;
    this.currentMonth = persianNow.month;
  }

  ngOnInit(): void {}

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (value) {
      this.setDateFromString(value);
    } else {
      this.selectedDate = null;
      this.displayValue = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Calendar navigation
  previousMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  toggleCalendar(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  closeCalendar(): void {
    this.isOpen = false;
  }

  // Calendar generation
  getCalendarDays(): Array<{day: number, isCurrentMonth: boolean, isToday: boolean, isSelected: boolean, isDisabled: boolean}> {
    const days = [];
    const daysInMonth = this.getDaysInPersianMonth(this.currentYear, this.currentMonth);
    const firstDayOfWeek = this.getFirstDayOfWeek(this.currentYear, this.currentMonth);
    
    // Add empty cells for previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: 0,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: true
      });
    }

    // Add days of current month
    const today = this.gregorianToPersian(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.year === this.currentYear && 
                      today.month === this.currentMonth && 
                      today.day === day;
      
      const isSelected = this.selectedDate && 
                        this.selectedDate.year === this.currentYear && 
                        this.selectedDate.month === this.currentMonth && 
                        this.selectedDate.day === day;

      const isDisabled = this.isDateDisabled(this.currentYear, this.currentMonth, day);

      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isDisabled
      });
    }

    return days;
  }

  // Date selection
  selectDate(day: number): void {
    if (day === 0 || this.isDateDisabled(this.currentYear, this.currentMonth, day)) {
      return;
    }

    this.selectedDate = {
      year: this.currentYear,
      month: this.currentMonth,
      day: day
    };

    this.updateDisplayValue();
    this.emitDateChange();
    this.onTouched();
    
    if (!this.showTime) {
      this.isOpen = false;
    }
  }

  // Time selection
  updateTime(): void {
    if (this.selectedDate) {
      this.updateDisplayValue();
      this.emitDateChange();
    }
  }

  // Helper methods
  private setDateFromString(dateString: string): void {
    try {
      if (this.showTime) {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('/').map(Number);
        
        if (timePart) {
          const [hour, minute] = timePart.split(':').map(Number);
          this.selectedTime = { hour, minute };
        }
        
        this.selectedDate = { year, month, day };
      } else {
        const [year, month, day] = dateString.split('/').map(Number);
        this.selectedDate = { year, month, day };
      }
      
      this.currentYear = this.selectedDate.year;
      this.currentMonth = this.selectedDate.month;
      this.updateDisplayValue();
    } catch (error) {
      console.error('Invalid date format:', dateString);
    }
  }

  private updateDisplayValue(): void {
    if (!this.selectedDate) {
      this.displayValue = '';
      return;
    }

    const { year, month, day } = this.selectedDate;
    let dateStr = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    
    if (this.showTime) {
      const { hour, minute } = this.selectedTime;
      dateStr += ` ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    this.displayValue = dateStr;
  }

  private emitDateChange(): void {
    if (this.selectedDate) {
      const { year, month, day } = this.selectedDate;
      let dateStr = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
      
      if (this.showTime) {
        const { hour, minute } = this.selectedTime;
        dateStr += ` ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      }
      
      this.onChange(dateStr);
      this.dateChange.emit(dateStr);
    }
  }

  private isDateDisabled(year: number, month: number, day: number): boolean {
    const dateStr = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    
    if (this.minDate && dateStr < this.minDate) {
      return true;
    }
    
    if (this.maxDate && dateStr > this.maxDate) {
      return true;
    }
    
    return false;
  }

  // Persian calendar calculations
  private getDaysInPersianMonth(year: number, month: number): number {
    if (month <= 6) {
      return 31;
    } else if (month <= 11) {
      return 30;
    } else {
      return this.isPersianLeapYear(year) ? 30 : 29;
    }
  }

  private isPersianLeapYear(year: number): boolean {
    // Simplified Persian leap year calculation
    const cycle = ((year - 979) % 128);
    return cycle !== 0 && cycle <= 29 && (cycle % 33) * 8 % 30 < 8;
  }

  private getFirstDayOfWeek(year: number, month: number): number {
    // Convert Persian date to Gregorian to get day of week
    const gregorian = this.persianToGregorian(year, month, 1);
    const date = new Date(gregorian.year, gregorian.month - 1, gregorian.day);
    return (date.getDay() + 1) % 7; // Adjust for Persian week (Saturday = 0)
  }

  // Date conversion utilities
  private gregorianToPersian(gYear: number, gMonth: number, gDay: number): PersianDate {
    const gDayNo = this.getGregorianDayNumber(gYear, gMonth, gDay);
    const pDayNo = gDayNo - 79;
    
    let pYear = 1;
    let pMonth = 1;
    let pDay = 1;
    
    let yearDay = pDayNo;
    
    // Find Persian year
    while (yearDay >= (this.isPersianLeapYear(pYear) ? 366 : 365)) {
      yearDay -= (this.isPersianLeapYear(pYear) ? 366 : 365);
      pYear++;
    }
    
    // Find Persian month
    if (yearDay < 186) {
      pMonth = Math.floor(yearDay / 31) + 1;
      pDay = (yearDay % 31) + 1;
    } else {
      pMonth = Math.floor((yearDay - 186) / 30) + 7;
      pDay = ((yearDay - 186) % 30) + 1;
    }
    
    return { year: pYear, month: pMonth, day: pDay };
  }

  private persianToGregorian(pYear: number, pMonth: number, pDay: number): {year: number, month: number, day: number} {
    let dayCount = pDay;
    
    // Add days for complete years
    for (let year = 1; year < pYear; year++) {
      dayCount += this.isPersianLeapYear(year) ? 366 : 365;
    }
    
    // Add days for complete months in current year
    for (let month = 1; month < pMonth; month++) {
      dayCount += this.getDaysInPersianMonth(pYear, month);
    }
    
    // Add base day offset
    dayCount += 78;
    
    // Convert to Gregorian
    const baseDate = new Date(622, 2, 22); // March 22, 622 CE
    const targetDate = new Date(baseDate.getTime() + (dayCount - 1) * 24 * 60 * 60 * 1000);
    
    return {
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      day: targetDate.getDate()
    };
  }

  private getGregorianDayNumber(gYear: number, gMonth: number, gDay: number): number {
    let dayCount = gDay;
    
    // Add days for complete years
    for (let year = 1; year < gYear; year++) {
      dayCount += this.isGregorianLeapYear(year) ? 366 : 365;
    }
    
    // Add days for complete months in current year
    for (let month = 1; month < gMonth; month++) {
      dayCount += this.getDaysInGregorianMonth(gYear, month);
    }
    
    return dayCount;
  }

  private isGregorianLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  private getDaysInGregorianMonth(year: number, month: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && this.isGregorianLeapYear(year)) {
      return 29;
    }
    return daysInMonth[month - 1];
  }

  // Public utility methods
  formatPersianDate(date: PersianDate): string {
    return `${date.year}/${date.month.toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`;
  }

  parsePersianDate(dateString: string): PersianDate | null {
    try {
      const [year, month, day] = dateString.split('/').map(Number);
      return { year, month, day };
    } catch {
      return null;
    }
  }

  getMonthName(month: number): string {
    return this.persianMonths[month - 1] || '';
  }

  getTodayPersian(): PersianDate {
    const now = new Date();
    return this.gregorianToPersian(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }
}
