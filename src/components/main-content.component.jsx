import React, { Component } from 'react';

import FormSection from './form-section.component';
import PreviewSection from './preview-section.component';

export default class MainContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientNameLast: '',
      patientNameFirst: '',
      patientNameMi: '',
      patientMrn: '',
      patientDob: '',

      cyclophosphamideIsEnabled: true,
      cyclophosphamideStrength: '',
      cyclophosphamideInfusionTime: '60',
      cyclophosphamideInfusionTimeIsOverridden: false,
      cyclophosphamideSpecialInstructions: '',

      mesnaIsEnabled: true,
      mesnaStrength: '',
      mesnaInfusionTime: '15',
      mesnaInfusionTimeIsOverridden: false,
      mesnaSpecialInstructions: '',

      granisetronIsEnabled: true,
      granisetronStrength: '',
      granisetronInfusionTime: '30',
      granisetronInfusionTimeIsOverridden: false,
      granisetronSpecialInstructions: '',

      verifier: '',
      preparation: '',

      copies: '',
    };

    this.initialState = this.state;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    const properNames = [
      'patientNameLast',
      'patientNameFirst',
      'patientNameMi',
    ];

    if (properNames.includes(name)) {
      this.setState({ [name]: capitalize(value) });
    } else if (name === 'verifier') {
      this.setState({ [name]: value.toUpperCase() });
    } else {
      this.setState({ [name]: value });
    }

    if (name.includes('IsOverridden') && value === false) {
      const resetName = name.slice(0, name.search('IsOverridden'));
      const resetValue = this.initialState[resetName];

      this.setState({ [resetName]: resetValue });
    }

    function capitalize(string) {
      return string.slice(0, 1).toUpperCase() + string.slice(1);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    window.print();
  }
  
  render() {
    const patient = {
      name: {
        last: this.state.patientNameLast,
        first: this.state.patientNameFirst,
        mi: this.state.patientNameMi
      },

      mrn: this.state.patientMrn,
      dob: this.state.patientDob
    };

    const medications = {
      cyclophosphamide: {
        isEnabled: this.state.cyclophosphamideIsEnabled,
        name: 'Cyclophosphamide',
        product: 'Cyclophosphamide 500 mG / 25 mL vial',
        concentration: 20,
        strength: this.state.cyclophosphamideStrength,
        infusionTime: this.state.cyclophosphamideInfusionTime,
        infusionTimeIsOverridden: this.state.cyclophosphamideInfusionTimeIsOverridden,
        specialInstructions: this.state.cyclophosphamideSpecialInstructions,
        diluent: {
          name: '0.9% Sodium Chloride',
          product: '0.9% Sodium Chloride bag',
          volume: (this.state.cyclophosphamideStrength >= 1000) ? 250 : 100
        }
      },

      mesna: {
        isEnabled: this.state.mesnaIsEnabled,
        name: 'Mesna',
        product: 'Mesna 1,000 mG / 10 mL vial',
        concentration: 100,
        strength: this.state.mesnaStrength,
        infusionTime: this.state.mesnaInfusionTime,
        infusionTimeIsOverridden: this.state.mesnaInfusionTimeIsOverridden,
        specialInstructions: this.state.mesnaSpecialInstructions,
        diluent: {
          name: '0.9% Sodium Chloride',
          product: '0.9% Sodium Chloride bag',
          volume: 50
        }
      },

      granisetron: {
        isEnabled: this.state.granisetronIsEnabled,
        name: 'Granisetron',
        product: 'Granisetron 1 mG / 1 mL vial',
        concentration: 1,
        strength: this.state.granisetronStrength,
        infusionTime: this.state.granisetronInfusionTime,
        infusionTimeIsOverridden: this.state.granisetronInfusionTimeIsOverridden,
        specialInstructions: this.state.granisetronSpecialInstructions,
        diluent: {
          name: '0.9% Sodium Chloride',
          product: '0.9% Sodium Chloride bag',
          volume: 50
        }
      },
    };

    return (
      <main className="container-fluid row">
        <FormSection
          patient={patient}
          medications={medications}
          verifier={this.state.verifier}
          preparation={this.state.preparation}
          copies={this.state.copies}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <PreviewSection
          patient={patient}
          medications={medications}
          verifier={this.state.verifier}
          preparation={this.state.preparation}
          copies={this.state.copies}
          isPrinting={this.state.isPrinting}
        />
      </main>
    );
  }
}


