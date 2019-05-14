import React from 'react';
import PropTypes from 'prop-types';

const Preview = props => (
  <section id="preview-section" className="col-8 d-flex flex-column d-print-block">
    <header className="d-print-none">
      <h2 className="text-primary">Preview</h2>
    </header>
    <div
      id="labels"
      className="d-flex d-print-block justify-content-between flex-grow-1 overflow-auto"
    >
      <Label
        patient={props.patient}
        medication={props.medications.cyclophosphamide}
        preparation={props.preparation}
        verifier={props.verifier}
      />
      <Label
        patient={props.patient}
        medication={props.medications.mesna}
        preparation={props.preparation}
        verifier={props.verifier}
      />
      <Label
        patient={props.patient}
        medication={props.medications.granisetron}
        preparation={props.preparation}
        verifier={props.verifier}
      />
    </div>
  </section>
);

Preview.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.object,
    mrn: PropTypes.string,
    dob: PropTypes.string,
  }).isRequired,

  medications: PropTypes.shape({
    cyclophosphamide: PropTypes.object,
    mesna: PropTypes.object,
    granisetron: PropTypes.object,
  }).isRequired,

  preparation: PropTypes.string,
  verifier: PropTypes.string,
};

Preview.defaultProps = {
  preparation: '',
  verifier: '',
};

const Label = props => {
  if (props.medication.isEnabled) {
    return (
      <article className="label">
        <div className="label__body">
          <div className="label__upper-half">
            <header>
              <p className="text-center font-weight-bold">
                North Shore University Hospital — Pharmacy Department
              </p>
              <div className="d-flex justify-content-between m-0">
                <p>
                  300 Community Drive
                  <br />
                  Manhasset, NY 11030
                </p>
                <p>
                  DEA# AN0768917
                  <br />
                  (516)562-4700
                </p>
              </div>
            </header>
            <PatientSection {...props.patient} />
            <MedicationSection {...props.medication} />
            <ExpPrepSection preparation={props.preparation} />
            <VerifyFillCheckSection verifier={props.verifier} />
          </div>
          <div className="label__lower-half">
            <p className="label__compounding-notice text-center font-weight-bold">
              * * * FOR COMPOUNDING ONLY * * *
            </p>
            <PatientSection {...props.patient} />
            <CompoundingSection {...props.medication} />
            <ExpPrepSection preparation={props.preparation} />
            <VerifyFillCheckSection verifier={props.verifier} />
          </div>
        </div>
      </article>
    );
  }

  return null;
};

Label.propTypes = {
  medication: PropTypes.shape({
    isEnabled: PropTypes.bool,
  }).isRequired,
  patient: PropTypes.shape({
    name: PropTypes.object,
    mrn: PropTypes.string,
    dob: PropTypes.string,
  }).isRequired,
  preparation: PropTypes.string,
  verifier: PropTypes.string,
};

Label.defaultProps = {
  preparation: '',
  verifier: '',
};

const PatientSection = props => {
  const name = {
    last: props.name.last ? props.name.last : 'Last name',
    first: props.name.first ? props.name.first : 'First name',
    mi: props.name.mi ? `${props.name.mi}.` : '',
  };

  const mrn = props.mrn ? props.mrn : '########';

  const dob = props.dob
    ? new Date(`${props.dob}T00:00:00`).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    : 'MM/DD/YYYY';

  return (
    <section className="my-1">
      <div className="d-flex justify-content-between m-0">
        <p className="font-weight-bold">
          {name.last}, {name.first} {name.mi}
        </p>
      </div>
      <div className="d-flex justify-content-between m-0">
        <p>MRN: {mrn}</p>
        <p>DoB: {dob}</p>
      </div>
    </section>
  );
};

PatientSection.propTypes = {
  name: PropTypes.shape({
    last: PropTypes.string,
    first: PropTypes.string,
    mi: PropTypes.string,
  }).isRequired,
  mrn: PropTypes.string,
  dob: PropTypes.string,
};

PatientSection.defaultProps = {
  mrn: '',
  dob: '',
};

const MedicationSection = props => {
  const medication = {
    name: props.name ? props.name : 'Medication',
    strength: props.strength ? props.strength : 0,
    volume:
      props.strength && props.concentration
        ? props.strength / props.concentration
        : 0,
  };

  const diluent = {
    name: props.diluent.name ? props.diluent.name : 'Diluent',
    volume: props.diluent.volume ? props.diluent.volume : '#',
  };

  const totalVolume =
    typeof (medication.volume + diluent.volume) === 'number'
      ? medication.volume + diluent.volume
      : 0;

  let infusionTime = props.infusionTime;
  let infusionTimeUnits = 'minute(s)';
  const rate = (totalVolume / infusionTime) * 60; // Rate is always mL / hr, but infusion time may be expressed in hours if simpler.

  if (props.infusionTime % 60 === 0) {
    infusionTime /= 60;
    infusionTimeUnits = 'hour(s)';
  }

  const specialInstructions = props.specialInstructions;

  const numberFormat = {
    useGrouping: true,
    maximumFractionDigits: 2,
  };

  return (
    <section className="my-1">
      <div className="d-flex justify-content-between m-0">
        <p className="font-weight-bold">
          {medication.name}{' '}
          {(+medication.strength).toLocaleString('en-US', numberFormat)} mG
        </p>
        <p>{(+medication.volume).toLocaleString('en-US', numberFormat)} mL</p>
      </div>
      <div className="d-flex justify-content-between m-0">
        <p className="font-weight-bold">in {diluent.name}</p>
        <p>{(+diluent.volume).toLocaleString('en-US', numberFormat)} mL</p>
      </div>
      <p className="text-right">
        Total volume: {(+totalVolume).toLocaleString('en-US', numberFormat)} mL
      </p>
      <div className="d-flex justify-content-between m-0">
        <p className="font-weight-bold">
          Rate: {(+rate).toLocaleString('en-US', numberFormat)} mL / hr
        </p>
        <p className="font-weight-bold">
          Infuse over {(+infusionTime).toLocaleString('en-US', numberFormat)}{' '}
          {infusionTimeUnits}
        </p>
      </div>
      <p className="font-italic">{specialInstructions}</p>
    </section>
  );
};

MedicationSection.propTypes = {
  name: PropTypes.string.isRequired,
  strength: PropTypes.string,
  concentration: PropTypes.number.isRequired,
  diluent: PropTypes.shape({
    name: PropTypes.string,
    volume: PropTypes.number,
  }).isRequired,
  infusionTime: PropTypes.string.isRequired,
  specialInstructions: PropTypes.string,
};

MedicationSection.defaultProps = {
  strength: '',
  specialInstructions: '',
};

const ExpPrepSection = props => {
  const dateFormat = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const preparation = props.preparation
    ? new Date(props.preparation).toLocaleString('en-US', dateFormat)
    : 'MM/DD/YYYY hh:mm';

  const getTomorrow = date => new Date(date.setDate(date.getDate() + 1));

  const expiration = props.preparation
    ? getTomorrow(new Date(props.preparation)).toLocaleString(
        'en-US',
        dateFormat
      )
    : 'MM/DD/YYYY hh:mm';

  return (
    <section className="my-1">
      <div className="d-flex justify-content-between m-0">
        <p className="font-weight-bold">Exp: {expiration}</p>
        <p>Prep: {preparation}</p>
      </div>
    </section>
  );
};

ExpPrepSection.propTypes = {
  preparation: PropTypes.string,
};

ExpPrepSection.defaultProps = {
  preparation: '',
};

const VerifyFillCheckSection = props => {
  const verifier = props.verifier ? props.verifier : '____';

  return (
    <section className="mt-3">
      <div className="d-flex justify-content-between m-0">
        <p>Verify: {verifier}</p>
        <p>Fill: ____</p>
        <p>Check: ____</p>
      </div>
    </section>
  );
};

VerifyFillCheckSection.propTypes = {
  verifier: PropTypes.string,
};

VerifyFillCheckSection.defaultProps = {
  verifier: '',
};

const CompoundingSection = props => {
  const medication = {
    product: props.product ? props.product : 'Medication product',
    strength: props.strength,
    concentration: props.concentration,
    volume:
      props.strength && props.concentration
        ? props.strength / props.concentration
        : 0,
  };

  const diluent = {
    product: props.diluent.product ? props.diluent.product : 'Diluent product',
    volume: props.diluent.volume ? props.diluent.volume : '#',
  };

  const totalVolume =
    typeof (medication.volume + diluent.volume) === 'number'
      ? medication.volume + diluent.volume
      : 0;

  const numberFormat = {
    useGrouping: true,
    maximumFractionDigits: 2,
  };

  return (
    <section className="my-1">
      <div className="d-flex justify-content-between m-0">
        <p>{medication.product}</p>
        <p>{(+medication.volume).toLocaleString('en-US', numberFormat)} mL</p>
      </div>
      <div className="d-flex justify-content-between m-0">
        <p>{diluent.product}</p>
        <p>{(+diluent.volume).toLocaleString('en-US', numberFormat)} mL</p>
      </div>
      <p className="text-right">
        Total volume: {(+totalVolume).toLocaleString('en-US', numberFormat)} mL
      </p>
    </section>
  );
};

CompoundingSection.propTypes = {
  product: PropTypes.string.isRequired,
  strength: PropTypes.string,
  concentration: PropTypes.number.isRequired,
  diluent: PropTypes.shape({
    product: PropTypes.string,
    volume: PropTypes.number,
  }).isRequired,
};

CompoundingSection.defaultProps = {
  strength: '',
};

export default Preview;
