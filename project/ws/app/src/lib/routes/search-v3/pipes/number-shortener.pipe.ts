import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberShortener'
})
export class NumberShortenerPipe implements PipeTransform {
  private readonly SUFFIXES = ['', 'K', 'M', 'B', 'T'];

  transform(value: number | string | null | undefined, decimals: number = 1): string {
    if (value === null || value === undefined) {
      return '0';
    }

    if (value === 0 || value === '0') {
      return '0';
    }
    value = Number(value);

    if (Math.abs(value) < 1000) {
      return value.toString();
    }

    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const suffixIndex = Math.floor(Math.log10(absValue) / 3);

    if (suffixIndex >= this.SUFFIXES.length) {
      return value.toString();
    }

    const shortValue = (absValue / Math.pow(1000, suffixIndex));
    const formattedNumber = shortValue.toFixed(decimals);
    const cleanNumber = formattedNumber.replace(/\.?0+$/, '');

    return `${isNegative ? '-' : ''}${cleanNumber}${this.SUFFIXES[suffixIndex]}`;
  }
}