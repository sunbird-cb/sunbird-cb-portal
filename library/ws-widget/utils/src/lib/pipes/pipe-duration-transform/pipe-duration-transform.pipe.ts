import { Pipe, PipeTransform } from '@angular/core'
import moment from 'moment'

@Pipe({
  name: 'pipeDurationTransform',
})
export class PipeDurationTransformPipe implements PipeTransform {

  transform(data: number, type: 'time24' | 'hms' | 'hour' | 'hms2H' | 'hms2M'| 'day'): any {
    if (data <= 0) {
      return ''
    }
    const h = Math.floor(data / 3600)
    const m = Math.floor((data % 3600) / 60)
    const s = Math.floor((data % 3600) % 60)
    let duration = ''
    switch (type) {
      case 'time24':
        return this.defaultDuration(h, m, s)
      case 'hms':
        return this.hmsCalculation(h, m, s, duration, type)
      case 'hms2H':
        /**to Print HH:mm:ss */
        const duration2 = moment.duration(data, 'seconds')
        const resultstring = moment.utc(duration2.asMilliseconds()).format('HH:mm:ss')
        return resultstring
      case 'hms2M': /**to Print mm:ss */
        const duration2H = moment.duration(data, 'seconds')
        const resultstring2H = moment.utc(duration2H.asMilliseconds()).format('mm:ss')

        return resultstring2H
      case 'hour':
        if (h === 0) {
          duration += 'less than an hour'
        }
        if (h === 1) {
          duration += `${h} hour`
        }
        if (h > 1) {
          duration += `${h} hours`
        }
        return duration
      case 'day':
        if (h > 24) {
          const duration3 = moment.duration(data, 'seconds')
          return `${duration3.days()} day(s)`
        }
        return this.hmsCalculation(h, m, s, duration, type)

      default:
        return this.defaultDuration(h, m, s)
    }
  }

  defaultDuration(h: number, m: number, s: number) {
    let duration = ''
    duration += h > 0 ? `${h.toString().padStart(2)}:` : ''
    duration += m > 0 ? `${m.toString().padStart(2)}:` : '00:'
    duration += s > 0 ? s.toString().padStart(2) : '00'
    return duration
  }
  hmsCalculation(h: number, m: number, s: number, dur: string, type: string) {
    let space = ''
    let duration = dur
    if (h > 0) {
      duration += type === 'hms' ? `${h}h` : `${h} hr`
    }
    if (m > 0) {
      if (h > 0) {
        space = ' '
      }
      duration += type === 'hms' ? `${space}${m}m` : `${space}${m} min`
    }
    if (s > 0 && h === 0) {
      if (m > 0) {
        space = ' '
      }
      duration += type === 'hms' ? `${space}${s}s` : `${space}${s} sec`
    }
    return duration
  }

}
