import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  showLoginModal = false;
  showOtpModal = false;
  activeTab: 'password' | 'otp' = 'password';
  username = '';
  password = '';
  mobileNumber = '';
  showPassword = false;
  otpBoxes = [0, 1, 2, 3, 4, 5];
  otpValues: string[] = ['', '', '', '', '', ''];

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  ngOnInit(): void {
    // Auto-open login modal on load (optional)
    // this.openLoginModal();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('modal-open');
  }

  openLoginModal(): void {
    this.showLoginModal = true;
    this.showOtpModal = false;
    this.document.body.classList.add('modal-open');
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    this.document.body.classList.remove('modal-open');
  }

  closeOtpModal(): void {
    this.showOtpModal = false;
    this.document.body.classList.remove('modal-open');
  }

  closeOnBackdrop(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.classList.contains('modal-backdrop')) {
      this.showLoginModal = false;
      this.showOtpModal = false;
      this.document.body.classList.remove('modal-open');
    }
  }

  switchTab(tab: 'password' | 'otp'): void {
    this.activeTab = tab;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Please enter username and password');
      return;
    }

    this.showLoginModal = false;
    this.showOtpModal = true;
    this.resetOtp();
    this.focusFirstOtpInput();
  }

  sendOtp(): void {
    const digits = this.mobileNumber.replace(/\D/g, '');

    if (digits.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }

    this.mobileNumber = digits;
    this.showLoginModal = false;
    this.showOtpModal = true;
    this.resetOtp();
    this.focusFirstOtpInput();
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    this.otpValues[index] = value;
    input.value = value;

    if (value && index < this.otpBoxes.length - 1) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1]?.nativeElement.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      const inputs = this.otpInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = pasted.replace(/\D/g, '').split('').slice(0, 6);

    this.resetOtp();
    digits.forEach((digit, index) => {
      this.otpValues[index] = digit;
    });

    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      const focusIndex = Math.min(digits.length, this.otpBoxes.length - 1);
      inputs[focusIndex]?.nativeElement.focus();
    }, 0);
  }

  submitOtp(): void {
    const otp = this.otpValues.join('');

    if (otp.length < 6) {
      alert('Please enter complete 6-digit OTP');
      return;
    }

    this.closeOtpModal();
    alert('Login successful!');
  }

  resendOtp(event: Event): void {
    event.preventDefault();
    this.resetOtp();
    this.focusFirstOtpInput();
  }

  editNumber(): void {
    this.showOtpModal = false;
    this.showLoginModal = true;
    this.activeTab = 'otp';
  }

  private resetOtp(): void {
    this.otpValues = this.otpBoxes.map(() => '');
  }

  private focusFirstOtpInput(): void {
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      if (inputs.length > 0) {
        inputs[0].nativeElement.focus();
      }
    }, 100);
  }
}
