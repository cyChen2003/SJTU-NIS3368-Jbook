from django.shortcuts import render

# Create your views here.
def print(request):
    data = json.loads(request.body)
    print(data)
    return HttpResponse('ok')