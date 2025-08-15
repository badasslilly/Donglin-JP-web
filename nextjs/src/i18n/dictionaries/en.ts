import type { DictSchema } from '../get-dictionary';

const en = {
  stepper: { enter: 'Enter Info', review: 'Review', done: 'Sent' },
  hero: { title: 'Contact', subtitle: 'contact' },
  blurb: [
    'Please use the form below to send your inquiry or feedback.',
    'Fill in the required fields and tap “Review”.',
  ],
  labels: {
    cat: 'Category',
    desired: 'Topic',
    name: 'Name',
    email: 'Email',
    tel: 'Phone',
    comment: 'Message',
    age: 'Age',
    gender: 'Gender',
    enquete_cat: 'Visitor Type',
    reason: 'Reason you accessed our website',
    evaluation1: 'About the content of our website',
    evaluation2: 'Usability of our website (structure, readability, etc.)',
    enquete_cmt: 'Other comments',
    required: 'Required',
    reviewNote: 'Please review your input before submitting.',
    toReview: 'Review',
    back: '← Back',
    submit: 'Send →',
    sentTitle: 'Sent',
    sentBody: 'Thank you for your message. We will get back to you after reviewing.',
  },
  options: {
    cats: ['Inquiry','Feedback','Other'],
    desired: [
      'Memorial service',
      'Visitor info / temple grounds','Shop items (e.g., beads)',
      'Volunteer activities','Sutra copying','Publications',
      'Dharma talk','Publication / photography','Other',
    ],
    age: ['0–20','21–30','31–40','41–50','51–60','61–70','71–80','81+'],
    gender: ['Male','Female'],
    enquete_cat: ['Jodo sect clergy/family','Jodo sect member','Other sect—Buddhist','Other religion','General visitor'],
    reason: [
      'To learn about Donglin Monastery or Honen','To learn Buddhist teachings','To learn about the Miedo repair project',
      'Interested in cultural properties and buildings','To find visitor info and highlights','To get info on memorial, interment',
      'To learn about Shojin-ryori','To get info on Wajunkan (lodging)','To find event information','To find materials for newsletter, etc.','Other',
    ],
    evaluation1: ['Excellent','Good','Needs some improvement','Needs improvement'],
    evaluation2: ['Good','Rather good','Rather poor','Poor'],
  },
} as const satisfies DictSchema;

export default en;
