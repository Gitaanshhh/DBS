from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api),
    path('new-table/', views.get_new_table),
    path('authenticate/', views.getUsers),
    path('users/', views.getUsers),  # add this line for frontend compatibility
    path('venues/', views.getVenues),
    path('venue-details/', views.getVenueDetails),
    path('filter-options/', views.getFilterOptions),  # add this line for filter options
    path('bookings/', views.createBooking),  # new booking endpoint
    path('my-bookings/', views.getMyBookings),  # endpoint for user's bookings
    path('bookings/<int:booking_id>/', views.deleteBooking, name='delete-booking'),
    path('booking-logs/', views.getBookingLogs, name='booking-logs'),
]
