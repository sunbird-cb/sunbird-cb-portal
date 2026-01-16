export const NOTIFICATION_TIME = 5;
export const AVAILABLE_LOCALES = ['en'];

export const CATEGORY_TYPE = [
  {
    displayName: 'All',
    name: '',
    count: 0,
    isChecked: true,
    filters: [],
    disabled: true,
  },
  {
    displayName: 'Contents',
    name: 'courses',
    count: 0,
    isChecked: false,
    filters: [
      {
        displayName: 'Course',
        name: 'course',
        count: 0,
        isChecked: false,
        filters: [
          {
            name: 'Course',
            count: 0,
            isChecked: false,
            displayName: 'Course',
          },
          {
            name: 'Moderated Course',
            count: 0,
            isChecked: false,
            displayName: 'Moderated Course',
          },
          // {
          //   name: 'Invite-Only Course',
          //   count: 0,
          //   isChecked: false,
          //   displayName: 'Invite Only Course',
          // },
        ],
      },
      {
        displayName: 'Programs',
        name: 'programs',
        count: 0,
        isChecked: false,
        filters: [
          {
            name: 'Moderated Program',
            count: 0,
            isChecked: false,
            displayName: 'Moderated Program',
          },
          {
            name: 'Invite-Only Program',
            count: 0,
            isChecked: false,
            displayName: 'Invite Only Program',
          },
          {
            name: 'Blended Program',
            count: 0,
            isChecked: false,
            displayName: 'Blended Program',
          },
          {
            name: 'Curated Program',
            count: 0,
            isChecked: false,
            displayName: 'Curated Program',
          },
        ],
      },
      {
        displayName: 'Assessments',
        name: 'assessments',
        count: 0,
        isChecked: false,
        filters: [
          {
            name: 'Moderated Assessment',
            count: 0,
            isChecked: false,
            displayName: 'Moderated Assessment',
          },
          {
            name: 'Standalone Assessment',
            count: 0,
            isChecked: false,
            displayName: 'Standalone Assessment',
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    displayName: 'Events',
    name: 'events',
    count: 0,
    isChecked: false,
    filters: [],
    disabled: false,
  },
  {
    name: 'peoples',
    count: 0,
    isChecked: false,
    displayName: 'People',
    filters: [],
    disabled: false,
  },
  {
    name: 'communities',
    count: 0,
    isChecked: false,
    displayName: 'Communities',
    filters: [],
    disabled: false,
  },
  {
    name: 'resources',
    count: 0,
    isChecked: false,
    displayName: 'Resources',
    filters: [],
    disabled: false,
  },
  {
    name: 'external-contents',
    count: 0,
    isChecked: false,
    displayName: 'External Contents',
    filters: [],
    disabled: false,
  },
];

export const SEARCH_SORT_DROPDOWN = [
  { name: 'Most Relevant', value: 'most_relevant' },
  { name: 'Recently Added (Newest)', value: 'recently_added_newest' },
  { name: 'Highest Rated', value: 'highest_rated' },
  { name: 'A-Z', value: 'a-z' },
  { name: 'Z-A', value: 'z-a' },
  // { name: 'Most Enrolled', value: 'most_enrolled' },
];

export const SEARCH_SORT_PEOPLES = [
  { name: 'A-Z', value: 'asc' },
  { name: 'Z-A', value: 'desc' },
  { name: 'Recently Added (Newest)', value: 'recently_added_newest' },
  { name: 'Most Relevant', value: 'most_relevant' },
];

export const TypeOfEvents = [
  {
    name: 'live',
    count: 0,
    isChecked: false,
    displayName: 'Live',
  },
  {
    name: 'upcoming',
    count: 0,
    isChecked: false,
    displayName: 'Upcoming',
  },
  {
    name: 'past events',
    count: 0,
    isChecked: false,
    displayName: 'Past Events',
  },
];

export const ALLOWED_CATEGORY_FOR_DYNAMIC_GENERATION = [
  "Invite-Only Program",
  "Moderated Program",
  "Blended Program",
  "Curated Program",
  "Standalone Assessment",
  "Moderated Assessment",
  "Invite-Only Assessment",
  "Comprehensive Assessment Program",
  "Pre Enrolment Assessment"
];