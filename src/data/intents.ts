export interface MaestroIntent {
  id: string;
  name: string;
  description: string;
  callFlow: string[];
  navigationSteps: string[];
}

export const maestroIntents: MaestroIntent[] = [
  {
    id: 'prior_auth_medication',
    name: 'Prior Authorization - Medication',
    description: 'Use when a provider requests authorization approval for a prescription medication.',
    callFlow: [
      'Verify caller identity and relationship to member.',
      'Confirm member ID, name, date of birth, and call-back details.',
      'Capture medication name, dosage, frequency, and diagnosis supporting the request.',
      'Review criteria in KM and inform caller of expected turnaround time.',
    ],
    navigationSteps: [
      'Maestro Home > Authorization > Start Request',
      'Select Member > Enter Member ID',
      'Choose Request Type > Medication',
      'Complete Clinical Details > Submit',
    ],
  },
  {
    id: 'prior_auth_device',
    name: 'Prior Authorization - Medical Device',
    description: 'Used for durable medical equipment or other medical devices requiring authorization.',
    callFlow: [
      'Collect device information (HCPCS, device name, supplier).',
      'Confirm diagnosis and medical necessity documentation requirements.',
      'Provide estimated decision timeline and follow-up steps.',
    ],
    navigationSteps: [
      'Maestro Home > Authorization > Start Request',
      'Select Member > Enter Member ID',
      'Choose Request Type > Device',
      'Attach documentation > Submit',
    ],
  },
  {
    id: 'benefit_inquiry',
    name: 'Benefit Inquiry',
    description: 'Routing for benefits and eligibility questions relating to coverage.',
    callFlow: [
      'Authenticate caller and member.',
      'Review plan benefits related to the service requested.',
      'Document outcome and next steps for caller.',
    ],
    navigationSteps: [
      'Maestro Home > Benefits > Eligibility Summary',
      'Use KM quick links for benefit-specific policy.',
    ],
  },
];
