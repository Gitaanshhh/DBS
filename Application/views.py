from django.shortcuts import render

from django.http import HttpResponse

# Create your views here.

def index(request):
    my_dict = {
        'insert_me':'Hello, world! From views.py'
    }
    return render(request, 'Application/index.html', context=my_dict)