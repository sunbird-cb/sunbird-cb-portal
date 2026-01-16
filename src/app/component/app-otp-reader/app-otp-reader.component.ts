import {
  Component,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'ws-app-otp-reader',
  templateUrl: './app-otp-reader.component.html',
  styleUrls: ['./app-otp-reader.component.scss'],
})
export class AppOtpReaderComponent {
  @Output() getOTP: EventEmitter<string> = new EventEmitter<string>();

  public readonly inputs: string[] = [
    'input1',
    'input2',
    'input3',
    'input4',
    'input5',
    'input6',
  ];
  public inputValues: string[];
  public finalValues!: string;
  public timerInterval: any;

  @ViewChildren('input') inputElements!: QueryList<any>;

  constructor() {
    this.inputValues = ['', '', '', '', '', ''];
  }

  ngOnInit(): void {}

  public onValueChange(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    this.digitValidate(inputElement);
    this.tabChange(index);
  }

  private digitValidate(element: HTMLInputElement): void {
    const inputValue = element.value.replace(/[^a-zA-Z0-9]/g, '');
    element.value = inputValue.toUpperCase();
  }

  private tabChange(index: number): void {
    const inputElementArray = this.inputElements.toArray();
    if (
      index !== 5 &&
      inputElementArray[index + 1] &&
      inputElementArray[index + 1].value !== ''
    ) {
      this.focusElement(inputElementArray[index + 1]);
    } else {
      this.focusElement(inputElementArray[index]);
    }
  }

  public onBackspace(event: any, index: number) {
    if (event.key === 'Backspace') {
      const inputElementArray = this.inputElements.toArray();
      if (
        this.inputElements &&
        inputElementArray.length > 0 &&
        inputElementArray[index - 1]
      ) {
        if (inputElementArray[index].nativeElement.value === '') {
          inputElementArray[index - 1].nativeElement.value = '';
          this.focusElement(inputElementArray[index - 1]);
        }
      }
    }
  }
  private focusElement(element: any): void {
    const inputElementArray = this.inputElements.toArray();
    inputElementArray.forEach((input, i) => {
      this.inputValues[i] = input.nativeElement.value;
    });
    this.finalValues = this.inputValues.join('');
    element.nativeElement.focus();
  }

  public sendFinalOtp(): void {
    this.getOTP.emit(this.finalValues);
  }

  get finalOTPValues(): string {
    return this.finalValues;
  }
}
