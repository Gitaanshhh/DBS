from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api),
    path('new-table/', views.get_new_table),
    path('authenticate/', views.getUsers),
    path('users/', views.getUsers),  # add this line for frontend compatibility
    path('venues/', views.getVenues),
    path('venue-details/', views.getVenueDetails),
]
