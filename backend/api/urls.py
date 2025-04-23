from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api),
    path('new-table/', views.get_new_table),  # <-- add this line
    path('api/venues/', views.getVenues),  # <-- add this line
]
