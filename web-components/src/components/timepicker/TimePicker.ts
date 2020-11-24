// import { addDays, addWeeks, DayFilters, isDayDisabled, now, subtractDays, subtractWeeks } from "@/utils/dateUtils";
import { customElement, html, LitElement, property, internalProperty } from "lit-element";
import { DateTime } from "luxon";
import reset from "@/wc_scss/reset.scss";
import styles from "./scss/module.scss";
import "@/components/input/Input";
import { ValidationRegex } from "@/utils/validations.ts";
import { Input } from "@/components/input/Input";
import { TIME_UNIT } from "@/constants";
import { ifDefined } from "lit-html/directives/if-defined";

export const timeUnits = [
  TIME_UNIT.HOUR,
  TIME_UNIT.MINUTE,
  TIME_UNIT.SECOND,
  TIME_UNIT.AM_PM,
] as const;

const timeUnitProps = (isTwentyFourHour: boolean) => {
  return {
    [TIME_UNIT.HOUR]: {
      type: "number" as Input.Type,
      min: 1,
      max: isTwentyFourHour ? 24 : 12
    },
    [TIME_UNIT.MINUTE]: {
      type: "number" as Input.Type,
      min: 1,
      max: 59
    },
    [TIME_UNIT.SECOND]: {
      type: "number" as Input.Type,
      min: 1,
      max: 59
    },
    [TIME_UNIT.AM_PM]: {
      type: "text" as Input.Type,
      min: undefined,
      max: undefined
    }
  }
}

export namespace TimePicker {
  export type TimeUnit = typeof timeUnits[number];
}

@customElement("md-timepicker")
export class TimePicker extends LitElement {
  @property({ type: Boolean }) twentyFourHourFormat = false;

  @internalProperty() private timeValue = {
    [TIME_UNIT.HOUR]: "",
    [TIME_UNIT.MINUTE]: "",
    [TIME_UNIT.SECOND]: "",
    [TIME_UNIT.AM_PM]: ""
  }

  @internalProperty() private timeValidity = {
    [TIME_UNIT.HOUR]: true,
    [TIME_UNIT.MINUTE]: true,
    [TIME_UNIT.SECOND]: true,
    [TIME_UNIT.AM_PM]: true
  }

  checkValidity = (input: string, unit: TimePicker.TimeUnit): boolean => {
    let result = true;
    const regexTester = (regex: RegExp): void => {
      if (input.match(regex) === null) {
        result = false;
      }
    };

    switch(unit) {
      case TIME_UNIT.HOUR:
        if (this.twentyFourHourFormat) {
          regexTester(new RegExp(ValidationRegex.twentyFourHourString));
        } else {
          regexTester(new RegExp(ValidationRegex.hourString));
        }
      break;
      case TIME_UNIT.MINUTE:
        regexTester(new RegExp(ValidationRegex.minuteSecondString));
      break;
      case TIME_UNIT.SECOND:
        regexTester(new RegExp(ValidationRegex.minuteSecondString));
      break;
      case TIME_UNIT.AM_PM:
        regexTester(new RegExp(ValidationRegex.amPmString));
      break;
      default:
        break;
    }
    console.log('[log][timePicker]: checkValidity', input, unit, result);
    return result;
  };

  handleTimeChange(event: CustomEvent, unit: TimePicker.TimeUnit) {
    console.log('[log][timePicker]: handleTimeChange', unit, event.detail.value);
    this.timeValue[unit] = event?.detail?.value;
    this.requestUpdate();

    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent(`${unit}-change`, {
        bubbles: true,
        composed: true,
        detail: {
          srcEvent: event,
          value: `${this.timeValue[unit]}`,
          isValid: this.timeValidity[unit]
        }
      })
    );
  }

  handleTimeKeyDown(event: CustomEvent, unit: TimePicker.TimeUnit) {
    console.log('[log][timePicker]: handleTimeKeyDown', unit, event.detail.srcEvent.key);
    this.timeValidity[unit] = true;
    this.requestUpdate();

    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent(`${unit}-keydown`, {
        bubbles: true,
        composed: true,
        detail: {
          srcEvent: event,
          value: `${this.timeValue[unit]}`
        }
      })
    );
  }

  handleTimeBlur(event: CustomEvent, unit: TimePicker.TimeUnit) {
    console.log('[log][timePicker]: handleTimeBlur', unit, this.timeValue[unit], this.timeValidity[unit]);
    this.timeValidity[unit] = this.timeValue[unit] ? this.checkValidity(this.timeValue[unit], unit) : true;
    this.formatTimeUnit(this.timeValue[unit], unit);
    this.requestUpdate();

    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent(`${unit}-blur`, {
        bubbles: true,
        composed: true,
        detail: {
          srcEvent: event,
          value: `${this.timeValue[unit]}`,
          isValid: this.timeValidity[unit]
        }
      })
    );
  }

  static get styles() {
    return [reset, styles];
  }

  formatTimeUnit = (timeValue: string, unit: TimePicker.TimeUnit) => {
    if (unit === TIME_UNIT.AM_PM) {
      this.timeValue[unit] = this.timeValue[unit].toUpperCase();
    } else if (timeValue.length === 1) {
      this.timeValue[unit] = "0" + timeValue;
    } else {
      this.timeValue[unit] = timeValue;
    }
  }

  getTimeString = () => {
    // DateTime.fromSQL('2017-05-15 09:12:34.342')
    let timeString = "";
      const hr = this.timeValue.hour || "00";
      const min = this.timeValue.minute || "00";
      const sec = this.timeValue.second || "00";
      const amPm = this.timeValue.am_pm || "AM";
  
      timeString = hr + ":" + min + ":" + sec + " " + amPm;
    return timeString;
  }

  messageType = (isValid: boolean) => {
    return isValid ? "" : "error";
  }

  generateTimeBox = (unit: TimePicker.TimeUnit) => {
    const unitProperties = timeUnitProps(this.twentyFourHourFormat)[unit];

    return html`
      <md-input
        class="${`time-input-box ${unit}`}"
        value="${this.timeValue[unit]}"
        type="${unitProperties.type}"
        min=${ifDefined(unitProperties.min)}
        max=${ifDefined(unitProperties.max)}
        @input-change="${(e: CustomEvent) => this.handleTimeChange(e, unit)}"
        @input-keydown="${(e: CustomEvent) => this.handleTimeKeyDown(e, unit)}"
        @input-blur="${(e: CustomEvent) => this.handleTimeBlur(e, unit)}"
        .messageArr=${[{ message: "", type: this.messageType(this.timeValidity[unit]) } as Input.Message]}
        aria-invalid="${!this.timeValidity[unit]}"
      ></md-input>
    `;
  }

  render() {
    return html`
    <div class="md-timepicker">
        <h2>Time: ${this.getTimeString()}</h2>
        ${this.generateTimeBox(TIME_UNIT.HOUR)}
        <span class="colon-separator">:</span>
        ${this.generateTimeBox(TIME_UNIT.MINUTE)}
        <span class="colon-separator">:</span>
        ${this.generateTimeBox(TIME_UNIT.SECOND)}
        ${this.generateTimeBox(TIME_UNIT.AM_PM)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "md-timepicker": TimePicker;
  }
}
