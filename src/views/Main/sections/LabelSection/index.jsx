'use-strict';

import PropTypes from 'prop-types';
import React from 'react';

import Label from './containers/Label';
import { medications } from '../../../../config';
import { reduceClassName } from '../../../../util';

LabelSection.propTypes = {
  className: PropTypes.string,
};

export default function LabelSection({ className, ...restProps }) {
  const BASE_CLASS_NAME = 'align-items-center d-flex d-print-block flex-wrap justify-content-around overflow-auto p-3';
  const labels = mapToLabels(medications);
  return (
    <section
      className={reduceClassName(BASE_CLASS_NAME, className)}
      id="label-section"
      {...restProps}
    >
      {labels}
    </section>
  );
}

function mapToLabels(medications) {
  return medications.map(medication => <Label key={medication.name} medication={medication} />);
}