"""
URL configuration for DBS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.shortcuts import render
import os

# Enhanced view to handle SPA requests
def spa_view(request):
    try:
        # Explicitly looking for the index.html file
        template_name = "index.html"
        response = render(request, template_name)
        # Debug header to confirm we're using the right template
        response['X-Template-Used'] = template_name
        return response
    except Exception as e:
        # If there's an error, return it for debugging
        return render(request, "error.html", {"error": str(e)})

urlpatterns = [
    path('api/', include('api.urls')),
]

# Add the catch-all route for the React app
urlpatterns += [
    # First handle specific API paths to avoid conflicts
    re_path(r'^(?!api/|admin/).*$', spa_view),
]
