import "@/components/button-group/ButtonGroup";
import "@/components/icon/Icon.ts";
import { html } from "lit-element";

export const buttonGroupTemplate = html`
  <div class="column">
    <h3>Icon only - 2 options</h3>
    <md-button-group>
      <button slot="button" type="button"><md-icon name="icon-text-table_16"></md-icon></button>
      <button slot="button" type="button"><md-icon name="icon-analysis_16"></md-icon></button>
    </md-button-group>
  </div>
  <div class="column">
    <h3>Icon only - disabled</h3>
    <md-button-group disabled>
      <button slot="button" type="button"><md-icon name="icon-text-table_16"></md-icon></button>
      <button slot="button" type="button"><md-icon name="icon-analysis_16"></md-icon></button>
    </md-button-group>
  </div>
  <div class="column">
    <h3>Icon only - 3 options</h3>
    <md-button-group>
      <button slot="button" type="button"><md-icon name="icon-pie-chart_16"></md-icon></button>
      <button slot="button" type="button"><md-icon name="icon-text-table_16"></md-icon></button>
      <button slot="button" type="button"><md-icon name="icon-analysis_16"></md-icon></button>
    </md-button-group>
  </div>
  <div class="column">
    <h3>Text Label - 2 options</h3>
    <md-button-group>
      <button slot="button" type="button">Option A</button>
      <button slot="button" type="button">Option B</button>
    </md-button-group>
  </div>
  <div class="column">
    <h3>Text Label - 3 options</h3>
    <md-button-group>
      <button slot="button" type="button">Option A</button>
      <button slot="button" type="button">Option B</button>
      <button slot="button" type="button">Option C</button>
    </md-button-group>
  </div>
`;