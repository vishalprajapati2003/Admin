const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        }
      ]
    },
    {
      id: 'ui-element',
      title: 'User Details',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'table',
          title: 'All User',
          type: 'item',
          icon: 'feather icon-user',
          url: '/basic/tables'
        }
      ]
    },
    {
      id: 'packages',
      title: 'Packages',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Create Packages',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/form-basic'
        },
        {
          id: 'table',
          title: 'All Packages',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/bootstrap'
        }
      ]
    },
    {
      id: 'destinations-sightSeeings',
      title: 'Destinations & SightSeeings',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'table',
          title: 'Destinations',
          type: 'item',
          icon: 'feather icon-flag',
          url: '/destinations/destination'
        },
        {
          id: 'table',
          title: 'SightSeeing',
          type: 'item',
          icon: 'feather icon-navigation',
          url: '/sightSeeing/sightSeeing'
        }
      ]
    },
    {
      id: 'hotels-flights',
      title: 'Hotels & Flights',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'table',
          title: 'Hotels',
          type: 'item',
          icon: 'feather icon-home',
          url: '/hotel'
        },
        {
          id: 'table',
          title: 'Flights',
          type: 'item',
          icon: 'feather icon-airplay',
          url: '/flight'
        }
      ]
    },
    {
      id: 'deals',
      title: 'Deals',
      type: 'group',
      icon: 'icon-deals',
      children: [
        {
          id: 'table',
          title: 'Deals',
          type: 'item',
          icon: 'feather icon-tag',
          url: '/deals'
        }
      ]
    },
    {
      id: 'booking',
      title: 'Booking',
      type: 'group',
      icon: 'icon-deals',
      children: [
        {
          id: 'table',
          title: 'Booking',
          type: 'item',
          icon: 'feather icon-calendar',
          url: '/booking'
        }
      ]
    }
  ]
};

export default menuItems;
